-- PostgreSQL concede EXECUTE a PUBLIC globalmente por padrão.
-- REVOKE por schema não remove esse privilégio global. A migration inicial
-- removeu os grants específicos do Supabase, mas faltava remover o global.
-- Mantemos o histórico já aplicado e corrigimos sem apagar o banco local.
alter default privileges for role postgres
  revoke execute on functions from public, anon, authenticated;

-- Funções futuras só poderão ser chamadas pelo cliente após GRANT explícito.
-- Não altera funções existentes dos serviços Auth/Storage/extensões.
