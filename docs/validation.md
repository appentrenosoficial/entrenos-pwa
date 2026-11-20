# Validação da Etapa 1 — 15/11/2026

## Comandos executados

| Verificação                                     | Resultado                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `npx --yes npm@11.13.0 ci`                      | Passou; instalação reproduzida a partir do lockfile                            |
| `npm ls --depth=0`                              | Passou; workspaces resolvidos                                                  |
| `npm run check`                                 | Passou: ESLint, TypeScript estrito em 4 workspaces e 4 testes unitários        |
| `npm run build:admin`                           | Passou; build Next.js de produção                                              |
| `npm run export:android`                        | Passou; bundle Android/Hermes gerado pelo Metro                                |
| `npx expo install --check` em `apps/mobile`     | Passou; dependências compatíveis                                               |
| `npx expo-doctor` em `apps/mobile`              | Passou: 20/20 verificações                                                     |
| Servidor Next de produção + `curl`              | HTTP 200 e cabeçalhos configurados presentes                                   |
| Chrome headless, painel em 1440×1120 e 390×1100 | Capturas inspecionadas; layout responsivo sem corte horizontal                 |
| `npm run supabase:start`                        | Passou no terminal do usuário após instalar Docker; migration inicial aplicada |
| `npx supabase migration up`                     | Passou; migration corretiva aplicada ao banco local, sem reset                 |
| `npm run test:db`                               | Passou: 9/9 asserções pgTAP após correção dos privilégios de funções           |
| `adb devices`                                   | Nenhum dispositivo conectado                                                   |
| `npm audit --json`                              | 10 alertas moderados transitivos; zero altos/críticos                          |

Os testes unitários cobrem ausência de configuração, URL/chave válidas, rejeição
de service_role/segredos/JWT inválido, URL insegura e endereço local do emulador.
Um teste identificou uma exceção com URL inválida, corrigida antes da entrega.

O npm 9 falhou internamente na instalação; npm 11.13.0 instalou e reproduziu o
lockfile. ESLint 9 emite aviso de fim de suporte; a atualização para 10 depende
de compatibilidade dos plugins transitivos do Next (ver decisões).
Os 10 alertas do audit estão associados a minimatch por Expo fingerprint e
TypeScript ESLint. Não foi executado `audit fix --force` nem downgrade do SDK.

## Limites da verificação

- A exportação Android não equivale a compilar/instalar APK. Java 17 e SDK
  Android foram instalados posteriormente. Uso das telas no dispositivo ainda
  não foi validado; a conexão física está ausente na verificação atual.
- As duas migrations estão aplicadas no banco local. As 9 asserções pgTAP foram
  executadas e passaram. Nenhuma migration foi aplicada ao Supabase remoto.
- CI foi criada, mas não executada em GitHub Actions nesta entrega.
- Em uma configuração posterior à entrega inicial, URL e chave publicável foram
  preenchidas nos arquivos locais ignorados pelo Git; o endpoint remoto de saúde
  do Auth respondeu HTTP 200. Isso não valida login nem autorização de negócio.
- Não há fluxos de negócio para testes de integração/E2E nesta etapa.
- Login, RLS de perfis e autorização administrativa ainda não existem. A página
  pública do painel apresenta apenas a configuração, sem dados ou operações.

## Checklist manual pendente no development build

- [ ] Abrir as cinco abas em Android.
- [ ] Navegar pelos atalhos e voltar.
- [ ] Conferir fonte ampliada, leitor de tela, áreas seguras e botão voltar.
- [ ] Conferir estados sem ambiente e com ambiente inválido.
- [ ] Confirmar que ações futuras continuam desabilitadas e não pedem permissões.

A Etapa 2 não foi iniciada e depende de autorização do usuário.

## Correção após instalação do Docker

O teste original falhou porque o PostgreSQL concede EXECUTE globalmente a PUBLIC.
REVOKE por schema não remove esse privilégio global. Foi adicionada a migration
`20261115000200_function_default_privileges.sql`, preservando a migration já
aplicada e o conteúdo do banco. A correção afeta somente privilégios padrão de
funções futuras criadas por postgres, sem alterar funções existentes dos serviços.

O teste foi ampliado de 6 para 9 asserções: inclui authenticated, função interna e
manutenção da permissão do proprietário. O erro original foi reproduzido antes da
correção. Depois da migration local, `test:db` e `check` passaram.

A sessão do agente ainda não tinha o grupo docker ativo; os comandos de banco
foram executados via `sg docker -c`, usando a associação já configurada pelo usuário.

## Instalação do SDK Android no usuário

SDK instalado em `~/Android/Sdk`, sem Android Studio ou emulador:
Platform-Tools 37.0.1, Platform 37.0, Build-Tools 37.0.0,
NDK 27.1.12297006 e CMake 3.30.5. Ferramentas de linha de comando 19.0
selecionadas para o Java 17; arquivo conferido com checksum do repositório Google.
`--list_installed` confirmou os cinco componentes.

Ambiente configurado em `~/.config/entrenos/android-env.sh`, carregado por
`~/.bashrc` e `~/.profile`. O `local.properties` nativo ignorado pelo Git recebeu
`sdk.dir`. Na sessão de terminal já aberta, carregar com
`. "$HOME/.config/entrenos/android-env.sh"`.

## Compilação nativa Android

`app:assembleDebug` passou com Gradle 9.4.1, Java 17 e SDK local em 8m20s:
463 tarefas, 421 executadas e 42 atualizadas. APK de desenvolvimento arm64-v8a:
`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`.
`apksigner verify` confirmou a assinatura. O Gradle instalou também CMake 3.22.1
exigido por uma dependência. Permanecem avisos de APIs obsoletas das dependências.

O aparelho foi reconhecido como `device` durante a sessão, mas a conexão USB
oscilou e voltou a desaparecer do ADB ao final da compilação. Instalação e uso das
telas ainda dependem de estabilizar essa conexão; compilação bem-sucedida não
constitui teste de execução no aparelho.

## Instalação no aparelho

Após reconectar e autorizar o dispositivo, `adb install -r` concluiu com
`Success`. O APK de desenvolvimento foi instalado no celular físico.
Foi configurado `adb reverse tcp:8081 tcp:8081` e enviado o intent de abertura
do development client apontando para o Metro local. O Metro está na porta 8081.

A conexão USB voltou a desaparecer antes da captura de tela, portanto a renderização
e a navegação nas cinco abas ainda **não foram confirmadas**. O checklist manual
permanece pendente. Compilação e instalação passaram; não alegar teste funcional.

## Conexão do development build pela rede local

A tela do aparelho mostrou falha ao carregar o script após a conexão USB cair.
O Metro foi reiniciado em modo LAN (`expo start --dev-client --lan --port 8081`).
O status e o manifesto Android responderam HTTP 200 pela interface Wi-Fi do
computador; o bundle Android de desenvolvimento compilou em 8,8 segundos e foi
servido com HTTP 200 (8.462.099 bytes). A URL do bundle no manifesto aponta para
o IP da rede local, sem depender do reverse USB.

O usuário informou que ainda conectaria o celular ao mesmo Wi-Fi. A renderização
no aparelho continua pendente de confirmação; a resposta HTTP foi verificada
pelo computador, não pelo celular.

## Etapa 2 — contas e perfis

- Autorização recebida do usuário; escopo e inventário em `docs/stage2.md`.
- Migrations 003/004/005 aplicadas localmente e todas as cinco migrations aplicadas
  no remoto EntreNós confirmado pela conta do CLI e pelo project ref.
- SQL remoto: dez tabelas públicas com RLS; db lint sem erros de schema.
- pgTAP: 49 verificações passaram (fundação, dados civis, maioridade, consentimento,
  convites, contexto ativo, isolamento de chats e ausência de grants indevidos).
- Integração local real: 17 verificações passaram, incluindo confirmação PKCE,
  upload privado, URL assinada, recuperação, refresh e logout. Artefatos de teste
  são locais e removidos; nenhum perfil fictício foi criado no remoto.
- Exportação Android/Hermes passou. Novo APK nativo compilou em 3m33s; assinatura
  verificada. USB novamente indisponível na tentativa de atualização do aparelho.
- APK disponibilizado na LAN para instalação manual pelo usuário, mantendo Metro.
- Auth remoto public settings: e-mail e signup habilitados, confirmação automática
  desabilitada e Google desabilitado. SMTP externo/Google real não foram testados.
- Check final e conferência de SDK registrados em `docs/stage2.md` após execução.

Check final da Etapa 2: ESLint e TypeScript passaram, 10 testes unitários
aprovados, dependências Expo compatíveis, Expo Doctor 20/20 e build Next de
produção aprovado. Repositório Git local inicializado sem commit/publicação;
variáveis e diretórios nativos gerados são ignorados.

Revisão criptográfica final: expo-crypto fornece RNG seguro e SHA-256 ao PKCE
no runtime nativo; encoding UTF-8 padronizado. APK recompilado em 22s, assinatura
e presença do módulo Crypto confirmadas. Check passou novamente (10 testes).
A verificação no aparelho dessa revisão ainda não foi confirmada; o APK final
está disponível na LAN no mesmo endereço de download com `?v=2`.

Verificação final após a ponte criptográfica: exportação Android passou novamente
(1.392 módulos), Expo Doctor 20/20 e dependências compatíveis. O APK final continua
assinado e servido com HTTP 200 na LAN. Auditoria npm final registra 10 alertas
moderados transitivos, sem altos/críticos. Não foi aplicado audit fix --force.

## Retomada em 18/11/2026 — abertura no aparelho por ADB

Aparelho autorizado reconhecido pelo ADB. Metro iniciado em localhost:8081,
reverse TCP 8081 configurado e development client aberto por deep link.
O bundle Android carregou e uma captura do aparelho confirmou a tela real de
login da Etapa 2 (e-mail, senha e criação de conta). Google aparece indisponível,
conforme configuração do provedor. Cadastro completo/entrega de e-mail externo
ainda não foram testados nesta retomada.
