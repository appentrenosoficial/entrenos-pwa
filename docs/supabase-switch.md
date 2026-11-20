# Troca do projeto Supabase

Em 19/11/2026, o EntreNós foi apontado para o projeto
`hagkkxcqfnmqryvshthc` (região informada pelo pooler: `us-east-2`). O projeto
anterior `oqutbrozahljxicaybbu` não foi apagado nem alterado.

Antes das migrations, uma consulta somente leitura confirmou que o novo banco
não tinha tabelas públicas. O dry run listou as cinco migrations versionadas.
Elas foram aplicadas com `supabase db push` sem seed. A verificação posterior
encontrou 10 tabelas públicas, todas com RLS habilitada, e cinco registros de
migration. Nenhum dado de usuário foi copiado.

`supabase/config.toml` aponta para o novo ref. Os arquivos locais ignorados pelo
Git contêm as URLs e a chave publicável do projeto novo. A API de Auth respondeu
HTTP 200 a partir dos dois apps; e-mail está habilitado, cadastro está aberto e
a confirmação é obrigatória.

A sessão atual do Supabase CLI lista apenas o projeto antigo. O banco novo foi
alcançado diretamente pela senha Postgres fornecida; ações de administração pela
API do Supabase CLI, como link do projeto, exigem autenticar o CLI com uma conta
que tenha acesso ao projeto novo.

A senha Postgres foi compartilhada durante esta conversa. Depois de validar a
conexão, troque-a no painel do Supabase e atualize `DATABASE_URL` e `DIRECT_URL`
no `.env` local. Não registre esses valores no Git nem os coloque nos apps.

## SMTP temporário com Gmail

Em 20/11/2026, o endpoint de cadastro com confirmação enviou a mensagem de teste
para um alias Gmail exclusivo. O usuário confirmou que recebeu a mensagem na
pasta Spam. O cadastro temporário foi removido do Auth após a confirmação de
entrega; o link desse e-mail de teste não funciona mais.

O asset `apps/mobile/assets/brand/email-logo.png` foi publicado no bucket público
separado `brand-assets`; leitura pública funciona e não há política pública de
upload. A migration `20261120000100_brand_email_asset.sql` versiona o bucket e a
política. O HTML profissional de confirmação está em
`supabase/templates/confirmation.html`, e a configuração local aponta para ele.
O template foi copiado para Auth → Email Templates no Dashboard. O primeiro
assunto salvo perdeu o "S" no e-mail recebido; após corrigir e salvar o assunto,
um novo envio foi recebido com o texto correto. As contas temporárias de teste
foram removidas do Auth.
