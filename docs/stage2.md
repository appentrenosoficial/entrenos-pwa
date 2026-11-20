# Entrega da Etapa 2 — contas e perfis

Autorizada pelo usuário em 15/11/2026. Corresponde à Fase 1 dos documentos de
produto. A próxima entrega será descoberta/relacionamentos, após nova autorização.

## Escopo entregue

- Login e cadastro por e-mail/senha, confirmação, reenvio, recuperação e nova senha.
- Google OAuth por navegador, PKCE, retorno e detecção de provedor indisponível.
- Onboarding 18+, nome civil privado, nascimento privado, apelido/username públicos,
  biografia, cidade/UF, interesses e preferências. Foto por seletor nativo no perfil.
- Edição e visibilidade, contexto ativo no servidor, convite/aceite/recusa/
  cancelamento/expiração de casal e retirada de consentimento.
- RLS e testes de isolamento de dados pessoais e de chats individuais/casal.
- Painel administrativo preservado sem operações restritas.

## Arquivos criados

- `supabase/migrations/20261115000300_accounts_profiles.sql`
- `supabase/migrations/20261115000400_account_validation.sql`
- `supabase/migrations/20261115000500_account_cleanup.sql`
- `supabase/tests/accounts.test.sql`
- `packages/shared/src/accounts.ts`
- `packages/shared/src/accounts.test.ts`
- `packages/shared/src/database.types.ts`
- `packages/shared/src/secure-storage.ts`
- `packages/shared/src/secure-storage.test.ts`
- `apps/mobile/src/auth/AuthProvider.tsx`
- `apps/mobile/src/auth/AuthScreen.tsx`
- `apps/mobile/src/auth/AccountGate.tsx`
- `apps/mobile/src/auth/PasswordRecovery.tsx`
- `apps/mobile/src/auth/callback.ts`
- `apps/mobile/src/auth/crypto.ts`
- `apps/mobile/app/auth/callback.tsx`
- `apps/mobile/src/components/forms.tsx`
- `apps/mobile/src/features/account/api.ts`
- `apps/mobile/src/features/account/AccountProvider.tsx`
- `apps/mobile/src/features/account/ProfileFields.tsx`
- `apps/mobile/src/features/account/Onboarding.tsx`
- `apps/mobile/src/features/account/IdentityScreen.tsx`
- `scripts/test-auth-local.mjs`
- `docs/stage2.md`

Alterados: layout raiz/abas, rotas de Perfil/Início/Explorar/atalhos, primitives,
cliente Supabase, exports compartilhados, app.json, package.json/lockfile, config
Supabase, workflow CI, README e documentação de arquitetura/segurança/contratos.

## Banco remoto

Projeto original da Etapa 2: **entrenos**, `oqutbrozahljxicaybbu`.
A conta autenticada no CLI foi conferida antes da aplicação. Consulta prévia não
encontrou tabelas públicas ou migrations anteriores. Dry run revisado.
As cinco migrations (fundação e contas) foram aplicadas sem seed e sem reset.
Consulta posterior confirmou RLS nas dez tabelas públicas.

Foi aplicado um config parcial revisado que alterou somente os callbacks
permitidos e a senha mínima para 12 caracteres; as demais configurações remotas
foram preservadas. O Auth remoto confirma: e-mail habilitado, cadastro habilitado,
confirmação automática desabilitada, Google desabilitado.
Não versionar tokens de login do CLI ou os arquivos `.env`.

## Critérios de aceite

- [x] Banco impede onboarding abaixo de 18 anos ou sem e-mail confirmado.
- [x] B não lê dados civis de A, mesmo após vínculo de casal.
- [x] Convite sozinho não cria casal; somente destinatário aceita.
- [x] Índices e locks impedem vínculos adicionais/aceites repetidos.
- [x] Perfil ativo não pode ser falsificado por UPDATE ou RPC.
- [x] RLS não permite ao parceiro ler chat pessoal da outra pessoa.
- [x] Recusa, cancelamento, expiração e retirada de consentimento testados.
- [x] Avatar não está acessível em endpoint público; URL assinada funciona.
- [x] Integração local confirma e-mail, recupera senha, renova e encerra sessão.
- [ ] Google OAuth real: depende das credenciais do provedor.
- [ ] Entrega real de e-mail/SMTP e fluxo completo de cadastro no celular.
- [x] Tela de acesso do novo build confirmada no aparelho por ADB em 18/11/2026.
  Cadastro e onboarding completos no aparelho ainda aguardam teste.

## Validação executada

- ESLint, TypeScript dos quatro workspaces e **10 testes unitários passaram**.
- `npm audit`: 10 alertas moderados transitivos, zero altos/críticos; atualização
  depende do conjunto Expo/TypeScript ESLint, sem downgrade forçado.
- Expo install --check: dependências compatíveis; Expo Doctor **20/20** após
  inicializar o repositório Git local e confirmar os diretórios gerados ignorados.
- Build de produção do painel Next.js passou.
- pgTAP: **49 verificações aprovadas** em dois arquivos, transações com rollback.
- Auth/Storage/PostgREST locais: **17 verificações aprovadas**, conta e mídia de
  integração removidas ao final. Destino remoto não é aceito pelo script.
- Exportação Android/Hermes passou.
- Novo APK arm64 de development build compilou em **3m33s** e assinatura foi
  verificada com apksigner. A revisão nativa com expo-crypto foi recompilada
  em 22s; presença do módulo Crypto no APK confirmada. Avisos de APIs obsoletas
  das dependências persistem.
- Lint SQL remoto: **nenhum erro de schema**.
- O teste de integração não substitui E2E de interface nativa ou Google real.

## Google OAuth e e-mail remoto

1. Supabase Dashboard → Authentication → Sign In / Providers → Google.
2. No Google Cloud, criar cliente OAuth do tipo Web e configurar callback do
   Supabase `https://hagkkxcqfnmqryvshthc.supabase.co/auth/v1/callback`.
3. Colocar client ID e client secret **no provedor do Supabase**, não no `.env`
   mobile e não no frontend do painel.
4. Manter os dois redirects `entrenos://auth/callback` e a variante
   `entrenos://auth/callback?flow=recovery` na configuração Auth.
5. Após habilitar Google, reabra/recarregue o app para atualizar o estado do provedor.
6. Para e-mail público confiável, configurar SMTP próprio e domínio/remetente.
   Sem SMTP próprio, o serviço padrão só entrega para e-mails dos integrantes
   da organização e possui limite reduzido. Não desabilitar confirmação para
   contornar essa restrição.
7. Abrir confirmação/recuperação no mesmo celular em que o fluxo foi iniciado.

Referências: [native deep linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking),
[PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow),
[Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google),
[SMTP](https://supabase.com/docs/guides/auth/auth-smtp).
