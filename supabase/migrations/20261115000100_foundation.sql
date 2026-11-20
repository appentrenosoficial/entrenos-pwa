-- Fundação: nenhum dado pessoal e nenhuma tabela de negócio nesta etapa.
-- Este schema NÃO faz parte de api.schemas no config.toml.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

-- Qualquer futura tabela criada pelo postgres começa sem privilégios de cliente.
-- Cada migration de domínio deve habilitar RLS e conceder somente o necessário.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;
alter default privileges for role postgres in schema app_private
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema app_private
  revoke execute on functions from public, anon, authenticated;
