-- Ajustes transacionais e de validação encontrados na revisão da Etapa 2.
create function app_private.valid_interests(p_values text[]) returns boolean language sql immutable set search_path='' as $$
 select p_values is not null and cardinality(p_values)<=20 and not exists(
  select 1 from unnest(p_values) i where i is null or length(trim(i)) not between 1 and 40
 );
$$;
alter table public.profiles add constraint valid_interest_items check (app_private.valid_interests(interests));
alter table public.profiles add constraint limited_preferences check (cardinality(connection_preferences)<=4);
drop function public.complete_onboarding(text,date,boolean,text,text,text,text,text[],text[]);
create function public.complete_onboarding(p_legal_name text,p_birth_date date,p_adult_confirmed boolean,p_nickname text,p_username text,p_city text,p_state text,p_interests text[] default '{}',p_preferences text[] default '{}',p_bio text default '') returns uuid
language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) then raise exception 'Confirme seu e-mail antes de continuar.'; end if;
 if p_adult_confirmed is distinct from true or p_birth_date is null or p_birth_date+interval '18 years'>(now() at time zone 'America/Sao_Paulo')::date then raise exception 'Cadastro permitido somente para maiores de 18 anos.'; end if;
 perform app_private.throttle('onboarding',5,interval '1 hour');
 if exists(select 1 from public.users_private where user_id=auth.uid()) then raise exception 'Cadastro já concluído.'; end if;
 insert into public.users_private(user_id,legal_name,birth_date) values(auth.uid(),trim(p_legal_name),p_birth_date);
 insert into public.profiles(type,nickname,username,city,state,interests,connection_preferences,bio) values('individual',trim(p_nickname),lower(trim(p_username)),trim(p_city),p_state,p_interests,p_preferences,p_bio) returning id into result;
 insert into public.profile_members(profile_id,user_id,profile_type) values(result,auth.uid(),'individual');
 insert into public.profile_visibility(profile_id) values(result);
 insert into public.account_context(user_id,active_profile_id) values(auth.uid(),result);
 return result;
end; $$;

grant execute on function public.complete_onboarding(text,date,boolean,text,text,text,text,text[],text[],text) to authenticated;
-- Mostra às partes o @username individual que está consentindo no vínculo.
create function public.invitation_partners(p_invitation_id uuid)
 returns table(inviter_username text,invitee_username text,city text,state text)
 language sql stable security definer set search_path='' as $$
 select a.username,b.username,a.city,a.state
 from public.couple_invitations i
 join public.profile_members ma on ma.user_id=i.inviter_id and ma.profile_type='individual'
 join public.profiles a on a.id=ma.profile_id
 join public.profile_members mb on mb.user_id=i.invitee_id and mb.profile_type='individual'
 join public.profiles b on b.id=mb.profile_id
 where i.id=p_invitation_id and auth.uid() in(i.inviter_id,i.invitee_id) and app_private.ready();
$$;
grant execute on function public.invitation_partners(uuid) to authenticated;
