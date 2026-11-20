# EntreNós

Aplicativo 18+, Android primeiro, React Native + Expo Router + TypeScript,
painel Next.js e Supabase. **Etapa 2: contas e perfis** implementada. Feed,
descoberta/Match, envio de chat, galerias, selfie, Premium e administração funcional
continuam nas próximas etapas, sem dados ou recursos simulados.

## Requisitos e instalação

Node 22.13+ e npm 11. Para Android local: JDK 17, Android SDK, NDK e CMake; Android
Studio é opcional. Para Supabase local/testes: Docker ativo.

```bash
npx --yes npm@11.13.0 ci
cp apps/mobile/.env.example apps/mobile/.env
cp apps/admin/.env.example apps/admin/.env.local
```

Não sobrescreva arquivos `.env` existentes com credenciais configuradas.

| Arquivo                 | Variáveis públicas                                                 |
| ----------------------- | ------------------------------------------------------------------ |
| `apps/mobile/.env`      | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `apps/admin/.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

Para ferramentas de banco locais, `DATABASE_URL` usa o pooler de transações e
`DIRECT_URL` o pooler de sessão. Mantenha essas URLs em um `.env` local ignorado
pelo Git; nunca as coloque nos apps ou em arquivos versionados.

Use URL e chave publicável/anon do mesmo projeto. Nunca service_role, sb_secret_,
senha do banco ou segredo OAuth nesses arquivos. Sem configuração, o app informa
que autenticação está indisponível. Reinicie Metro/Next ao alterar variáveis.

## Android — development build

Com emulador ativo ou aparelho USB autorizado:

```bash
npm run android
```

O comando gera/compila/instala o projeto nativo e inicia Metro. Não usar Expo Go.
Após mudanças em plugins nativos, reinstale o development build. Nas próximas
execuções, basta iniciar o servidor:

```bash
npm run mobile
```

No celular, abra EntreNós e conecte ao servidor indicado pelo Expo. Computador e
celular devem estar no mesmo Wi-Fi para usar a URL LAN. `127.0.0.1` exige USB com
`adb reverse tcp:8081 tcp:8081`; desconectar a USB pode interromper o encaminhamento.
O development build depende do Metro ativo para carregar o código.

Nesta máquina, Java/SDK já foram configurados. Para carregar o ambiente em um
terminal antigo:

```bash
source "$HOME/.config/entrenos/android-env.sh"
adb devices -l
```

Em outra máquina, configure JAVA_HOME, ANDROID_HOME e PATH segundo a instalação
local. SDK usado: Platform 37.0, Build-Tools 37.0.0, NDK 27.1.12297006,
CMake 3.30.5 e 3.22.1, Java 17. Artefato de debug:
`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`.

## Web — PWA

A versão web instala-se pela opção “Adicionar à tela inicial” do navegador. Para
desenvolver e gerar o pacote de produção:

```bash
npm run start:web -w @entrenos/mobile
npm run build:web
```

O deploy Vercel usa `vercel.json` e publica `apps/mobile/dist`. Configure no
projeto Vercel apenas `EXPO_PUBLIC_SUPABASE_URL` e
`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, para Production e Preview. São valores
públicos do cliente; nunca configure `sb_secret`, `service_role`, senha de banco
ou segredo SMTP/OAuth no frontend. Depois de obter o domínio Vercel, adicione
`https://SEU-DOMINIO/auth/callback` em Supabase → Authentication → URL
Configuration → Redirect URLs. O login Google segue desativado.

Esta etapa publica a fundação atual de contas e perfis; Explorar/Match, chat,
galerias, Premium e outras funções continuam fora do escopo implementado.
Sessões web usam o armazenamento local do navegador; sessões Android/iOS seguem
no Keychain/Android Keystore.

## Usar contas e perfis

1. Criar conta por e-mail/senha (12+ caracteres).
2. Confirmar o e-mail no mesmo aparelho e concluir o onboarding 18+.
3. Adicionar foto e editar biografia, localização manual, interesses e privacidade.
4. Em Perfil → Alternar perfil e gerenciar casal, enviar convite por username.
5. A outra pessoa entra na própria conta e aceita/recusa; convite não cria vínculo
   automaticamente. Trocar identidade não compartilha chats pessoais.

Google só aparece disponível quando o provedor está habilitado. Configuração e
pendências externas estão em `docs/stage2.md`. Não há conta padrão ou admin padrão.

## Painel administrativo

```bash
npm run admin
```

Acesse http://localhost:3000. Página de instalação sem dados/ações administrativas.
A autorização por papéis será implementada antes de qualquer recurso restrito.

## Supabase local e verificações

```bash
npm run supabase:start
npm run test:db
npm run test:auth
npm run check
npm run export:android
npm run build:admin
```

- `test:db`: pgTAP para RLS, consentimento, identidade ativa e chat isolado.
- `test:auth`: integração real local com Auth, PostgREST, Mailpit e Storage. Usa
  contas `@example.test` temporárias e as remove. Nunca execute contra produção.
- `check`: ESLint, TypeScript estrito e testes unitários.
- `supabase:reset` apaga o **banco local** e reaplica migrations; não é necessário
  para atualização normal. Prefira `npx supabase migration up`.
- `npx expo install --check` e `npx expo-doctor`, dentro de apps/mobile, conferem SDK.

Studio local: http://127.0.0.1:54323; e-mails locais: http://127.0.0.1:54324.
Use `http://10.0.2.2:54321` no emulador Android padrão; no aparelho físico, usar
URL HTTPS de desenvolvimento ou `adb reverse tcp:54321 tcp:54321` e 127.0.0.1.
Não misture chaves locais e remotas. O banco local tem confirmação de e-mail ativa.

## Banco remoto

Migrations já aplicadas ao projeto EntreNós configurado. Para projetos novos,
revise dry run e confirme o alvo antes de executar mutações remotas:

```bash
npx supabase login
npx supabase db push --remote=SEU_PROJECT_REF --skip-vault --dry-run
npx supabase db push --remote=SEU_PROJECT_REF --skip-vault --yes
```

Configure callbacks e confirmação em Auth conforme `docs/stage2.md`.
Não envie o config local inteiro ao remoto sem revisar o diff: ele contém
endereços e serviços locais. Esta entrega usou config parcial para preservar as
demais definições do projeto. Nunca commitar token do CLI ou senha do banco.

## Documentação

- `docs/stage2.md`: entrega, arquivos, aceite, testes e pendências da Etapa 2.
- `docs/architecture.md`: estrutura, identidades e fronteiras.
- `docs/api-contracts.md`: RPCs e acesso aos dados.
- `docs/security.md`: proteções implementadas e limites.
- `docs/decisions.md`: decisões e parâmetros operacionais.
- `docs/validation.md`: histórico de validação da fundação e atualizações.
- `docs/files-created.md`: inventário original da fundação.

A próxima etapa (descoberta e relacionamentos) exige nova autorização do usuário.
