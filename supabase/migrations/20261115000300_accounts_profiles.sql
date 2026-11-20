-- Etapa 2: todas as mutações de identidade passam por funções transacionais.
create table public.users_private (
  user_id uuid primary key references auth.users(id) on delete cascade,
  legal_name text not null check (length(trim(legal_name)) between 2 and 120),
  birth_date date not null,
  adulthood_confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint adults_only check (birth_date + interval '18 years' <= (now() at time zone 'America/Sao_Paulo')::date)
);
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('individual','couple')),
  nickname text not null check (length(trim(nickname)) between 2 and 60),
  username text not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  bio text not null default '' check (length(bio) <= 500),
  city text not null check (length(trim(city)) between 2 and 100),
  state text not null check (state in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO')),
  interests text[] not null default '{}' check (cardinality(interests) <= 20),
  connection_preferences text[] not null default '{}' check (connection_preferences <@ array['friendship','relationship','individuals','couples']::text[]),
  avatar_path text,
  created_at timestamptz not null default now(),
  unique (id,type)
);
create table public.profile_members (
  profile_id uuid not null,
  user_id uuid not null references public.users_private(user_id) on delete cascade,
  profile_type text not null,
  consented_at timestamptz not null default now(),
  primary key (profile_id,user_id),
  unique (user_id,profile_type),
  foreign key (profile_id,profile_type) references public.profiles(id,type) on delete cascade
);
create index profile_members_user_idx on public.profile_members(user_id,profile_id);
create table public.profile_visibility (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  audience text not null default 'registered' check (audience in ('registered','individuals','couples','connections','hidden'))
);
create table public.account_context (
  user_id uuid primary key references public.users_private(user_id) on delete cascade,
  active_profile_id uuid references public.profiles(id) on delete set null
);
create table public.couple_invitations (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.users_private(user_id) on delete cascade,
  invitee_id uuid not null references public.users_private(user_id) on delete cascade,
  nickname text not null check (length(trim(nickname)) between 2 and 60),
  username text not null check (username ~ '^[a-z0-9_]{3,30}$'),
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  responded_at timestamptz,
  check (inviter_id <> invitee_id)
);
create index invitations_inbox_idx on public.couple_invitations(invitee_id,status);
create unique index invitations_pair_pending_idx on public.couple_invitations(least(inviter_id,invitee_id),greatest(inviter_id,invitee_id)) where status='pending';
-- Base de autorização para próximos módulos. Não há envio ou criação de chat no cliente.
create table public.connections (
  profile_a uuid not null references public.profiles(id) on delete cascade,
  profile_b uuid not null references public.profiles(id) on delete cascade,
  primary key (profile_a,profile_b), check (profile_a < profile_b)
);
create table public.conversations (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now()
);
create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key(conversation_id,profile_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id),
  body text not null, created_at timestamptz not null default now()
);
create table app_private.account_action_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null, created_at timestamptz not null default now()
);

create function app_private.ready() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.users_private u join auth.users a on a.id=u.user_id
  where u.user_id=auth.uid() and a.email_confirmed_at is not null);
$$;
create function app_private.member(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
 select app_private.ready() and exists(select 1 from public.profile_members where profile_id=p_id and user_id=auth.uid());
$$;
create function app_private.active_id() returns uuid language sql stable security definer set search_path='' as $$
 select c.active_profile_id from public.account_context c where c.user_id=auth.uid() and app_private.member(c.active_profile_id);
$$;
create function app_private.can_view(p_id uuid,p_direct boolean default false) returns boolean language sql stable security definer set search_path='' as $$
 select app_private.ready() and (
  app_private.member(p_id) or exists (
    select 1 from public.profile_visibility v join public.profiles viewer on viewer.id=app_private.active_id()
    where v.profile_id=p_id and (
      v.audience='registered' or (v.audience='hidden' and p_direct)
      or (v.audience='individuals' and viewer.type='individual')
      or (v.audience='couples' and viewer.type='couple')
      or (v.audience='connections' and exists(select 1 from public.connections c
        where c.profile_a=least(p_id,viewer.id) and c.profile_b=greatest(p_id,viewer.id)))
    )
  )
 );
$$;
create function app_private.chat_access(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.conversation_members m where m.conversation_id=p_id and m.profile_id=app_private.active_id());
$$;
create function app_private.throttle(p_action text,p_limit integer,p_window interval) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if (select count(*) from app_private.account_action_log where user_id=auth.uid() and action=p_action and created_at>now()-p_window)>=p_limit then
  raise exception 'Muitas tentativas. Aguarde antes de tentar novamente.';
 end if;
 insert into app_private.account_action_log(user_id,action) values(auth.uid(),p_action);
end; $$;

alter table public.users_private enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_members enable row level security;
alter table public.profile_visibility enable row level security;
alter table public.account_context enable row level security;
alter table public.couple_invitations enable row level security;
alter table public.connections enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table app_private.account_action_log enable row level security;
-- Helpers internos acessíveis somente para avaliação das políticas; schema fora da API.
grant execute on function app_private.ready(),app_private.member(uuid),app_private.active_id(),app_private.can_view(uuid,boolean),app_private.chat_access(uuid) to authenticated;
grant select on public.users_private,public.profiles,public.profile_members,public.profile_visibility,public.account_context,public.couple_invitations,public.connections,public.conversations,public.conversation_members,public.messages to authenticated;
create policy private_self on public.users_private for select to authenticated using(user_id=auth.uid());
create policy profile_read on public.profiles for select to authenticated using(app_private.can_view(id));
create policy members_read on public.profile_members for select to authenticated using(app_private.member(profile_id));
create policy visibility_read on public.profile_visibility for select to authenticated using(app_private.member(profile_id));
create policy context_self on public.account_context for select to authenticated using(user_id=auth.uid());
create policy invitations_parties on public.couple_invitations for select to authenticated using(app_private.ready() and auth.uid() in (inviter_id,invitee_id));
create policy connections_parties on public.connections for select to authenticated using(app_private.active_id() in (profile_a,profile_b));
create policy chat_read on public.conversations for select to authenticated using(app_private.chat_access(id));
create policy chat_members_read on public.conversation_members for select to authenticated using(app_private.chat_access(conversation_id));
create policy messages_read on public.messages for select to authenticated using(app_private.chat_access(conversation_id));

create function public.complete_onboarding(p_legal_name text,p_birth_date date,p_adult_confirmed boolean,p_nickname text,p_username text,p_city text,p_state text,p_interests text[] default '{}',p_preferences text[] default '{}') returns uuid
language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) then raise exception 'Confirme seu e-mail antes de continuar.'; end if;
 if p_adult_confirmed is distinct from true or p_birth_date is null or p_birth_date+interval '18 years'>(now() at time zone 'America/Sao_Paulo')::date then raise exception 'Cadastro permitido somente para maiores de 18 anos.'; end if;
 perform app_private.throttle('onboarding',5,interval '1 hour');
 if exists(select 1 from public.users_private where user_id=auth.uid()) then raise exception 'Cadastro já concluído.'; end if;
 insert into public.users_private(user_id,legal_name,birth_date) values(auth.uid(),trim(p_legal_name),p_birth_date);
 insert into public.profiles(type,nickname,username,city,state,interests,connection_preferences) values('individual',trim(p_nickname),lower(trim(p_username)),trim(p_city),p_state,p_interests,p_preferences) returning id into result;
 insert into public.profile_members(profile_id,user_id,profile_type) values(result,auth.uid(),'individual');
 insert into public.profile_visibility(profile_id) values(result);
 insert into public.account_context(user_id,active_profile_id) values(auth.uid(),result);
 return result;
end; $$;
create function public.set_active_profile(p_profile_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if not app_private.member(p_profile_id) then raise exception 'Perfil não autorizado.'; end if;
 update public.account_context set active_profile_id=p_profile_id where user_id=auth.uid();
end; $$;
create function public.update_profile(p_profile_id uuid,p_nickname text,p_bio text,p_city text,p_state text,p_interests text[],p_preferences text[],p_audience text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not app_private.member(p_profile_id) or p_profile_id is distinct from app_private.active_id() then raise exception 'Perfil ativo não autorizado.'; end if;
 perform app_private.throttle('profile_update',30,interval '1 hour');
 if exists(select 1 from unnest(p_interests) i where length(trim(i)) not between 1 and 40) then raise exception 'Interesse inválido.'; end if;
 update public.profiles set nickname=trim(p_nickname),bio=p_bio,city=trim(p_city),state=p_state,interests=p_interests,connection_preferences=p_preferences where id=p_profile_id;
 update public.profile_visibility set audience=p_audience where profile_id=p_profile_id;
end; $$;
create function public.get_profile(p_profile_id uuid) returns setof public.profiles language sql stable security definer set search_path='' as $$
 select p.* from public.profiles p where p.id=p_profile_id and app_private.can_view(p.id,true);
$$;

create function public.invite_couple(p_partner_username text,p_nickname text,p_username text) returns uuid language plpgsql security definer set search_path='' as $$
declare target uuid; result uuid;
begin
 if not app_private.ready() then raise exception 'Conclua seu cadastro.'; end if;
 perform app_private.throttle('couple_invite',5,interval '1 day');
 select m.user_id into target from public.profiles p join public.profile_members m on m.profile_id=p.id
  where p.type='individual' and p.username=lower(trim(p_partner_username));
 if target is null or target=auth.uid() then raise exception 'Não foi possível convidar esse perfil.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(least(auth.uid(),target)::text,1));
 perform pg_advisory_xact_lock(hashtextextended(greatest(auth.uid(),target)::text,1));
 if exists(select 1 from public.profile_members where user_id in (auth.uid(),target) and profile_type='couple') then raise exception 'Um dos integrantes já participa de um casal.'; end if;
 update public.couple_invitations set status='cancelled',responded_at=now() where status='pending' and expires_at<=now() and (inviter_id in(auth.uid(),target) or invitee_id in(auth.uid(),target));
 if exists(select 1 from public.profiles where username=lower(trim(p_username))) then raise exception 'Username indisponível.'; end if;
 insert into public.couple_invitations(inviter_id,invitee_id,nickname,username) values(auth.uid(),target,trim(p_nickname),lower(trim(p_username))) returning id into result;
 return result;
end; $$;
create function public.respond_couple_invitation(p_invitation_id uuid,p_accept boolean) returns uuid language plpgsql security definer set search_path='' as $$
declare inv public.couple_invitations; result uuid; source public.profiles;
begin
 if not app_private.ready() then raise exception 'Conclua seu cadastro.'; end if;
 -- Lê antes do lock para adquirir locks de integrantes sempre na mesma ordem.
 select * into inv from public.couple_invitations where id=p_invitation_id and invitee_id=auth.uid();
 if inv.id is null then raise exception 'Convite não autorizado.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(least(inv.inviter_id,inv.invitee_id)::text,1));
 perform pg_advisory_xact_lock(hashtextextended(greatest(inv.inviter_id,inv.invitee_id)::text,1));
 select * into inv from public.couple_invitations where id=p_invitation_id for update;
 if inv.status<>'pending' or inv.expires_at<=now() then raise exception 'Convite encerrado ou expirado.'; end if;
 if p_accept is null then raise exception 'Resposta obrigatória.'; end if;
 if not p_accept then update public.couple_invitations set status='declined',responded_at=now() where id=inv.id; return null; end if;
 if exists(select 1 from public.profile_members where user_id in(inv.inviter_id,inv.invitee_id) and profile_type='couple') then raise exception 'Um dos integrantes já participa de um casal.'; end if;
 select p.* into source from public.profiles p join public.profile_members m on p.id=m.profile_id where m.user_id=inv.inviter_id and p.type='individual';
 insert into public.profiles(type,nickname,username,city,state) values('couple',inv.nickname,inv.username,source.city,source.state) returning id into result;
 insert into public.profile_members(profile_id,user_id,profile_type) values(result,inv.inviter_id,'couple'),(result,inv.invitee_id,'couple');
 insert into public.profile_visibility(profile_id,audience) values(result,'registered');
 update public.couple_invitations set status='accepted',responded_at=now() where id=inv.id;
 update public.couple_invitations set status='cancelled',responded_at=now() where status='pending' and (inviter_id in(inv.inviter_id,inv.invitee_id) or invitee_id in(inv.inviter_id,inv.invitee_id));
 return result;
end; $$;
create function public.cancel_couple_invitation(p_invitation_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 update public.couple_invitations set status='cancelled',responded_at=now() where id=p_invitation_id and inviter_id=auth.uid() and status='pending';
 if not found then raise exception 'Convite não autorizado ou encerrado.'; end if;
end; $$;
create function public.leave_couple(p_profile_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if not app_private.member(p_profile_id) then raise exception 'Perfil não autorizado.'; end if;
 perform 1 from public.profiles where id=p_profile_id and type='couple' for update;
 if not found then raise exception 'Perfil de casal necessário.'; end if;
 -- Retirar o próprio consentimento encerra a identidade compartilhada para ambos.
 update public.account_context c set active_profile_id=(select m.profile_id from public.profile_members m where m.user_id=c.user_id and m.profile_type='individual') where c.active_profile_id=p_profile_id;
 delete from public.profiles where id=p_profile_id;
end; $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('profile-avatars','profile-avatars',false,5242880,array['image/jpeg','image/png','image/webp'])
 on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create function app_private.avatar_owner(p_name text) returns boolean language sql stable security definer set search_path='' as $$
 select split_part(p_name,'/',1)=app_private.active_id()::text and app_private.member(app_private.active_id());
$$;
create function app_private.avatar_reader(p_name text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles p where p.avatar_path=p_name and app_private.can_view(p.id,true));
$$;
grant execute on function app_private.avatar_owner(text),app_private.avatar_reader(text) to authenticated;
create policy avatar_insert on storage.objects for insert to authenticated with check(bucket_id='profile-avatars' and app_private.avatar_owner(name));
create policy avatar_select on storage.objects for select to authenticated using(bucket_id='profile-avatars' and (app_private.avatar_owner(name) or app_private.avatar_reader(name)));
create policy avatar_delete on storage.objects for delete to authenticated using(bucket_id='profile-avatars' and app_private.avatar_owner(name));
create function public.set_profile_avatar(p_profile_id uuid,p_path text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not app_private.member(p_profile_id) or p_profile_id is distinct from app_private.active_id() then raise exception 'Perfil ativo não autorizado.'; end if;
 if p_path is not null and (split_part(p_path,'/',1)<>p_profile_id::text or not exists(select 1 from storage.objects where bucket_id='profile-avatars' and name=p_path)) then raise exception 'Arquivo inválido.'; end if;
 update public.profiles set avatar_path=p_path where id=p_profile_id;
end; $$;
-- Somente RPCs revisadas recebem execução pública autenticada.
grant execute on function public.complete_onboarding(text,date,boolean,text,text,text,text,text[],text[]),public.set_active_profile(uuid),public.update_profile(uuid,text,text,text,text,text[],text[],text),public.get_profile(uuid),public.invite_couple(text,text,text),public.respond_couple_invitation(uuid,boolean),public.cancel_couple_invitation(uuid),public.leave_couple(uuid),public.set_profile_avatar(uuid,text) to authenticated;
