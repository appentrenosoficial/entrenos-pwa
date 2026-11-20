# Arquitetura — Etapa 2

A Etapa 1 entregou a fundação (Fase 0 dos documentos originais). A Etapa 2,
autorizada em 15/11/2026, implementa contas e perfis (Fase 1). Descoberta/Match
é a próxima etapa e não foi iniciada.

- `apps/mobile`: Expo Router, React Native, TypeScript e development build.
  `AuthProvider` restaura sessão e acompanha AppState. `AccountProvider` carrega
  somente os vínculos da conta e invalida resultados de requisições antigas.
  `AccountGate` exige sessão e onboarding antes de mostrar abas e atalhos.
- `apps/admin`: página de instalação Next.js; sem dados ou operações restritas.
  Autorização administrativa permanece na fase específica do painel.
- `packages/shared`: schemas Zod, regras de maioridade, parsing de callback,
  adapter de sessão fragmentada no SecureStore e tipos gerados do PostgreSQL.
- `packages/ui`: tokens dark compartilhados por RN e CSS do painel.
- `supabase`: migrations incrementais, RLS, RPCs transacionais e bucket privado.
  Seeds vazios. Fixtures só nos testes, com rollback ou limpeza local.

## Identidades

Uma conta possui um perfil individual e pode integrar um único perfil de casal.
Índices únicos e operações transacionais garantem essa cardinalidade. Um convite
não cria o casal: o registro e os dois vínculos são criados juntos no aceite.

`users_private` contém nome civil e nascimento, com RLS por `auth.uid()`.
`profiles` contém somente dados públicos; `profile_members` guarda consentimento.
`account_context` mantém a identidade ativa no servidor, separada por conta.

Trocar identidade exige RPC e pertencimento. Atualização/foto exige também que
seja a identidade ativa. O cliente descarta dados anteriores durante a troca e
não oferece ações enquanto recarrega. Chats futuros usam essa identidade no
backend, sem inferir permissões pessoais a partir do vínculo de casal.

## Fluxos

- E-mail/senha: signup real → confirmação no e-mail → troca PKCE → onboarding 18+.
- Google: navegador do sistema → Supabase OAuth → callback PKCE. O botão consulta
  disponibilidade do provedor; não apresenta um login simulado quando desativado.
- Recuperação: e-mail real, callback específico, nova senha, atualização no Auth.
- Localização: cidade e UF manuais; nenhum GPS/endereço exato é coletado.
- Foto: seletor nativo, bucket privado, limite de 5 MB, JPG/PNG/WebP, URL assinada
  de 60 segundos. Não há galeria nem selfie nesta etapa.
- Casal: convite por username, consentimento explícito do remetente e aceite do
  destinatário. Recusa, cancelamento, expiração e retirada de consentimento reais.

## Fronteiras

As tabelas `connections`, `conversations`, `conversation_members` e `messages`
preparam e testam autorização. O cliente só tem SELECT protegido; ainda não
existem envio de mensagem, criação de chat ou criação de conexão. Não são
apresentados como funcionalidades disponíveis.
