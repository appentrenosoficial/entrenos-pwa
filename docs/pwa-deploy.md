# EntreNós Web (PWA)

## Arquitetura

A PWA reutiliza o Expo Router e a lógica de conta/perfil em `apps/mobile`, com
React Native Web. O painel Next.js continua separado em `apps/admin`. A saída é
uma SPA estática servida em HTTPS pela Vercel; rewrites encaminham as rotas do
Expo Router ao `index.html`.

O cliente web tem adaptadores próprios para Web Crypto e armazenamento de sessão
do navegador. As versões nativas continuam usando Expo Crypto e SecureStore.
Não há cache offline de telas autenticadas, bundles ou respostas do Supabase. O
service worker fica restrito à instalação/atualização, evitando servir sessões
ou código antigo. Web Push não está implementado.

## Desenvolvimento e build

```bash
npm run start:web -w @entrenos/mobile
npm run build:web
```

O build vai para `apps/mobile/dist`. O teste local de produção pode ser servido
com `npx expo serve` executado em `apps/mobile`; HTTPS deve ser usado para testar
recursos de navegador que exigem contexto seguro.

## Vercel

O `vercel.json` configura `npm ci`, `npm run build:web`, saída
`apps/mobile/dist`, rewrites e cabeçalhos de segurança. Configure no projeto
somente:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Esses valores são compilados no bundle do navegador e devem ser somente a URL e
a chave publicável/anon do mesmo projeto. Nunca adicionar `sb_secret`,
`service_role`, `DATABASE_URL`, `DIRECT_URL`, SMTP ou segredo OAuth ao ambiente
client-side.

Após criar o domínio Vercel, adicione `https://SEU-DOMINIO/auth/callback` à lista
de Redirect URLs em Authentication → URL Configuration no Supabase. O fluxo de
confirmação de e-mail e recuperação de senha usa essa URL web; o callback nativo
`entrenos://auth/callback` permanece inalterado.

## Estado do produto

A PWA oferece os fluxos entregues na etapa de contas e perfis. Explorar/Match,
chat, galerias, Stories, grupos, eventos, Premium, painel administrativo
funcional, Web Push e operação de moderação não são apresentados como entregues.
