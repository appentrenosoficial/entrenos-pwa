-- Evita identidades sem titular após exclusão administrativa de uma conta Auth.
-- Exclusão/exportação pelo usuário e retenções legais continuam na fase de hardening.
create function app_private.cleanup_account_profiles() returns trigger language plpgsql security definer set search_path='' as $$
declare item record;
begin
 for item in select profile_id,profile_type from public.profile_members where user_id=old.user_id order by profile_type loop
  if item.profile_type='couple' then
   update public.account_context c set active_profile_id=(select m.profile_id from public.profile_members m where m.user_id=c.user_id and m.profile_type='individual') where c.active_profile_id=item.profile_id;
  end if;
  delete from public.profiles where id=item.profile_id;
 end loop;
 return old;
end; $$;
create trigger cleanup_account_profiles before delete on public.users_private for each row execute function app_private.cleanup_account_profiles();
