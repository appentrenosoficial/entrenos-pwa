# Segurança — Etapa 2

## Implementado

- Nome civil/nascimento em tabela privada por RLS; parceiro não recebe acesso.
- Maioridade e confirmação explícita validadas no PostgreSQL, além da UI.
  Aniversário calculado pela data em America/Sao_Paulo. Autodeclaração não comprova
  idade civil. Nome civil e nascimento não são copiados para metadata pública.
- Auth real, confirmação de e-mail, recuperação e PKCE S256. Aleatoriedade e
  SHA-256 fornecidos por expo-crypto; encoder UTF-8 padronizado. O adaptador
  fornece apenas RNG/digest usados pelo PKCE, não uma WebCrypto completa. Google só habilitado na UI
  quando o provedor está disponível. Segredos OAuth ficam no Supabase.
- Sessão e verifier no SecureStore. Fragmentos Unicode pequenos suportam sessões
  longas; o índice só muda depois de todas as gravações. Logout local usa semântica
  do SDK que limpa o aparelho antes da revogação remota; JWT emitido continua
  sujeito à própria expiração. AppState controla renovação automática.
- Dez tabelas públicas com RLS e sem escrita direta para clientes. Mutações por
  RPC revisada, search_path vazio e GRANT explícito para authenticated.
- Casal criado atomicamente após dois consentimentos, com locks e unicidade.
  Nome de usuário de cada parte aparece no convite. Terceiros não consultam ou
  respondem convites. Retirada de consentimento encerra a identidade de casal.
- Identidade ativa validada no servidor. RLS de chat não herda permissões de uma
  pessoa por ela integrar o casal. UI invalida resultados antigos em transições.
- Avatar privado, pasta por perfil, JPG/PNG/WebP, máximo 5 MB no bucket, URL assinada
  por 60s. O servidor valida metadata MIME do upload; inspeção binária/moderação
  avançada ainda requer implementação antes do lançamento público.
- Registro interno e limites para operações de conta. Schema interno não exposto
  pela Data API, sem USAGE para anon/authenticated; helpers têm apenas EXECUTE
  necessário às políticas já compiladas. Não há leitura pública do log.
- Nenhuma chave service_role/secret no mobile/admin. Teste de integração usa
  service role **somente do ambiente local**, em script Node, com destino fixo
  127.0.0.1 e limpeza. Nunca transportar esse script para o cliente.

## Ainda pendente

- Chat de produção, bloqueios, discovery, galerias, mídia efêmera e Premium.
- Análise manual de selfie/liveness, funções administrativas e auditoria detalhada
  de moderação; nenhum selo automático ou administrador padrão foi criado.
- Google OAuth configurado pelo responsável no painel, com client ID/secret reais.
  A implementação está pronta, mas o provedor remoto segue desativado.
- SMTP de produção e teste de entrega para destinatários reais. E-mails do teste
  local são capturados pelo Mailpit; não equivalem a entrega externa.
- FLAG_SECURE Android, testes de captura, hardening, E2E de interface completo,
  retenção, exportação e exclusão pelo titular, políticas LGPD/moderação/lojas.
- A exclusão administrativa Auth limpa identidades e vínculos sem titular. A
  rotina de exclusão de conta com retenção legal ainda será definida. A FK de
  remetente de mensagens futuras evita apagamento silencioso sem essa política.
- Limpeza privilegiada de arquivos órfãos de avatar após exclusão administrativa;
  arquivos órfãos permanecem privados e inacessíveis após perda do vínculo.
- Regras de upload de avatar (5 MB e formatos) são limites iniciais de operação,
  não limites definitivos de vídeo/galerias. Não há transcodificação ou antifraude.

O painel Next permanece uma página pública sem dados nem operações restritas.
Autorização server-side por papéis será pré-requisito para recursos administrativos.
