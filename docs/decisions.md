# Decisões

## 2026-11-15 — Escopo

A solicitação atual prevalece sobre o comando do prompt de iniciar também a
Fase 1. A **Etapa 1** aqui entrega apenas a **Fase 0 — Estrutura**. Autenticação e
perfis aguardam autorização para a Etapa 2. Nenhuma regra funcional foi alterada.

## Workspace e dependências

npm workspaces, Node 22 e npm 11; Expo SDK 58 e Next.js 16 com React 19.3.
As versões efetivas estão no package-lock.json. O npm 9 do ambiente falhou durante
resolução de peers; npm 11 é executado via npx, sem alterar instalação global.
Documentação consultada: https://docs.expo.dev/get-started/create-a-project/ e
https://nextjs.org/docs/app/getting-started/installation .

## Identidade visual

Sem arquivos visuais de referência no repositório. Tokens dark roxo/magenta,
infinito tipográfico, cartões arredondados, cores de texto claras e alvos de toque.
Nenhum asset externo, fonte remota, logo definitivo ou imagem gerada é necessário.

## Supabase e administração

Não criar tabelas, buckets ou credenciais fictícias de recursos futuros. Supabase
local preparado com grants restritos e teste pgTAP. Cadastro local desabilitado até
a etapa de Auth. O painel permanece fechado por ausência de operações/dados;
autorização real por papéis será requisito prévio a qualquer recurso restrito.

## Publicação

`com.entrenos.app` é identificador técnico inicial reversível; confirmar propriedade
antes de distribuição. EAS projectId não é inventado: associar a conta/projeto real
apenas quando necessário. Expo Go não é o caminho de execução suportado.

## Ferramentas de lint

ESLint 9.39.5 foi mantido porque os plugins transitivos de React/import/a11y do
`eslint-config-next` ainda restringem os peers à série 9. ESLint 10 passou no lint,
mas produziu uma árvore de dependências inválida; a versão compatível foi
restabelecida. A série 9 emite aviso de fim de suporte. Atualizar em conjunto
quando os plugins permitirem, sem ignorar conflitos de dependências.

## CLI Supabase

CLI 3.1.0 fixado no lockfile. Configuração usa `[local_smtp]` e
`auth.email.enabled`, conforme a configuração atual. Referência:
https://supabase.com/docs/guides/local-development/cli/migrating-to-v3 .

## Correção de privilégios padrão de funções

Após executar pgTAP com Docker, a asserção de execução por anon revelou que
revogar por schema não remove o EXECUTE global padrão de PUBLIC. A correção foi
versionada em migration adicional, sem editar o histórico aplicado, sem reset e
sem alterar funções existentes do Supabase. Migrations futuras devem conceder
EXECUTE explicitamente apenas aos papéis necessários. Referência PostgreSQL:
https://www.postgresql.org/docs/17/sql-alterdefaultprivileges.html .

## 2026-11-15 — Etapa 2 autorizada

Contas e perfis implementam a Fase 1 original. A Etapa 3 será descoberta e
relacionamentos; não iniciar sem nova autorização. Nenhum envio de chat ou
conteúdo social foi incluído nesta entrega.

Sessão PKCE e verifier ficam no SecureStore, fragmentados para respeitar limites
nativos e preservar Unicode. Geração nova só substitui o índice após gravação
completa. Não usar AsyncStorage para tokens. O SDK faz logout local antes da
revogação no servidor, permitindo sair do aparelho mesmo com rede instável.

Cidade/UF manual atende ao requisito de localização aproximada nesta fase.
GPS não é solicitado. Foto foi movida para edição de perfil após o onboarding,
para evitar gravar mídia sem uma identidade autorizada. Biografia é gravada
atomicamente junto com o onboarding; falha de username não deixa conta parcial.

Parâmetros iniciais: senha 12–128 caracteres no cliente (mínimo 12 no Auth),
username 3–30, bio 500, até 20 interesses de 40 caracteres, avatar 5 MB JPG/PNG/WebP,
URL assinada 60s e convites de 7 dias. São limites operacionais revisáveis, sem
alterar Premium, consentimento, selo ou regras de galeria.

Quem envia convite consente ao confirmar o formulário; quem recebe vê os dois
usernames e a localização inicial antes de aceitar. O username do casal só é
reservado no aceite. Locks por integrantes + unicidade impedem vínculos
concorrentes. Um integrante pode retirar seu consentimento; isso encerra o
perfil de casal e restaura o individual. Ambos podem editar os dados públicos do
perfil compartilhado; concessão de galeria e modo de interesses não existem ainda.

Perfis ocultos não aparecem em SELECT de listagem. `get_profile` por UUID continua
permitindo acesso direto a cadastrados, pois ocultar das buscas não é exclusão.
Audiência por perfil sempre usa tipo da identidade ativa. Chats preparatórios
não têm grants de escrita ao cliente e só são lidos por identidade participante.

Migrations aplicadas localmente e no projeto remoto confirmado por ref. O remoto
não tinha tabelas públicas; nenhuma migration destrutiva/reset/seed foi usado.
Config Auth parcial revisado modificou apenas redirects e tamanho mínimo da senha,
preservando SMTP, MFA, pooler e demais campos remotos. Google continua desativado
até o responsável informar credenciais no painel; a UI consulta esse estado.

Referências: documentação oficial Supabase Auth Native Deep Linking/PKCE/Storage
citada em `docs/stage2.md`, código local do SDK @supabase/auth-js 2.119 e docs Expo
WebBrowser/ImagePicker. Não foram usadas credenciais fictícias de integrações.

Repositório Git local inicializado em `main`, sem commit ou publicação. Isso
permite ao Expo reconhecer os diretórios nativos gerados como ignorados pelo
versionamento/CNG. `.env`, `.env.local` e APKs gerados tiveram o ignore conferido.

Na revisão de segurança do runtime nativo, a autenticação recebeu ponte explícita
para RNG seguro e SHA-256 via expo-crypto, com UTF-8 padronizado. Impede fallback
do SDK para Math.random/challenge plain. O adaptador não oferece importKey/verify;
a aplicação não usa getClaims que dependa de uma WebCrypto completa.
