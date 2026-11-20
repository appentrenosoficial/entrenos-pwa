# Login e cadastro com Google

O app usa o fluxo OAuth PKCE do Supabase em navegador seguro. O botão já existe
na tela de login; a tela de cadastro também oferece **Cadastrar com Google**.
Para uma conta Google nova, o Supabase cria o usuário e depois o app encaminha
para o onboarding de perfil, que mantém a regra de idade mínima de 18 anos.

## Configuração necessária

1. No Google Cloud / Google Auth Platform, configure a tela de consentimento com
   o nome EntreNós e os escopos `openid`, `email` e `profile`. Enquanto o app
   estiver em modo de teste, inclua as contas Google de teste permitidas.
2. Crie um OAuth Client ID do tipo **Web application**. Em **Authorized redirect
   URIs**, adicione:
   `https://hagkkxcqfnmqryvshthc.supabase.co/auth/v1/callback`
3. No Supabase, abra Authentication → Providers → Google, habilite o provedor e
   cole o Client ID e o Client Secret. O segredo fica somente no painel Supabase;
   nunca no app, `.env` mobile ou repositório.
4. Em Authentication → URL Configuration → Redirect URLs, permita:
   `entrenos://auth/callback`
   Este é o retorno do Supabase ao aplicativo; ele é diferente do callback do
   provedor configurado no Google Cloud.
5. Salve e abra/recarregue o app. O app consulta o estado do provedor e passa a
   iniciar o fluxo quando o Google estiver habilitado.

O fluxo atual usa o navegador do aparelho e o Client ID Web do Supabase. Ele não
usa o SDK nativo Google Sign-In nem exige um client Android/SHA-1 para esse fluxo.

## Estado observado

Em 20/11/2026, a API pública Auth do projeto `hagkkxcqfnmqryvshthc` indicou
`external.google = false`. A conta Supabase autenticada no CLI não tem permissão
administrativa nesse projeto, então habilitar o provedor deve ser feito no
Dashboard. Depois de salvar, a mesma API deve indicar `external.google = true`;
em seguida é possível testar login existente e criação de uma conta nova.
