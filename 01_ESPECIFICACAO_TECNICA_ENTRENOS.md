# EntreNós — Especificação técnica consolidada

**Versão:** 1.0 — 15/11/2026  
**Produto:** rede social 18+ para amizades, relacionamentos, perfis individuais e de casal, comunidades e eventos.  
**Slogan de referência:** Conexões reais começam aqui.

## 1. Direção de produto e experiência
- Android primeiro, iOS depois; aplicativo nativo com React Native, Expo development build e TypeScript.
- Visual dark premium, roxo e magenta, cartões arredondados, logo de infinito; preservar referências visuais originais do projeto quando disponibilizadas no repositório.
- Barra inferior: **Início**, **Explorar**, **Criar**, **Chat**, **Perfil**. Atalhos para notificações, grupos, eventos e alternância de perfil ativo.
- Um usuário autenticado pode ter perfil individual e participar de perfil de casal. Os integrantes precisam consentir no vínculo. Conversas individuais nunca ficam acessíveis ao parceiro.

## 2. Autenticação, onboarding e identidade
- Login por Google OAuth ou e-mail/senha; confirmação de e-mail e recuperação de senha.
- Apenas maiores de 18 anos; data de nascimento obrigatória e privada, com confirmação de maioridade. A autodeclaração não equivale à comprovação robusta de idade.
- Nome civil privado, apelido público e @username único. Preferências de conexão, foto, biografia e interesses.
- Localização aproximada por GPS com consentimento **ou** cidade/estado manual; nunca publicar coordenadas precisas nem endereço residencial.
- Verificação por selfie com prova de presença: solicitação fica **Em análise**; apenas administrador autorizado pode **aprovar, reprovar ou solicitar nova selfie** pelo painel. Nada de aprovação automática. Selo indica avaliação de autenticidade da selfie/perfil, não verificação de identidade civil. Casal recebe selo somente quando **ambos** forem aprovados individualmente.

## 3. Privacidade de perfis e relacionamentos
- Visibilidade configurável por perfil: todos os cadastrados, apenas individuais, apenas casais, apenas conexões aceitas ou oculto das buscas. Oculto das buscas não equivale a apagar a conta.
- Seguir perfis e enviar solicitações de conexão mútua são ações distintas; remover seguidores, desfazer conexões, bloquear e denunciar.
- Descoberta geográfica por raio (5, 10, 25, 50, 100 km ou personalizado quando permitido), cidade, estado ou Brasil; filtros por idade, tipo de perfil e somente verificados.
- **Explorar:** grade/lista de perfis. **Descobrir:** cartões com interesse/passar. Interesse mútuo gera Match, animação e chat liberado, com conexão formal opcional.
- Perfil de casal: **modo livre** (um integrante demonstra interesse) ou **modo conjunto** (ambos aprovam antes de enviar); mudança de modo exige concordância dos dois.

## 4. Galerias
- Galeria pública e privada; organização em visão geral e álbuns nomeados.
- Todos os usuários podem criar galerias privadas. Somente **Premium pode solicitar acesso** à galeria de terceiros; qualquer usuário pode receber autorização e visualizar enquanto válida.
- Proprietário decide: autorizar, recusar ou propor **acesso recíproco** (ambos liberam galerias; revogação de um lado encerra ambos). Acesso cobre itens atuais e futuros de todos os álbuns enquanto autorizado.
- Registrar visitantes e horários de acesso; aviso push de visita configurável. Revogação disponível. Galeria de casal requer consentimento de ambos os integrantes para concessão compartilhada.
- Não oferecer botão de download de mídia privada. Captura externa não pode ser impedida integralmente.

## 5. Chat e mídia efêmera
- Caixa com **Conversas**, **Solicitações** e **Arquivadas**. Conexões aceitas e Matches podem conversar diretamente; sem vínculo, mensagens dependem de solicitação aceita, salvo permissões mais restritivas. Premium pode iniciar solicitação de contato sem Match, mas nunca forçar entrega/aceite.
- Texto, emojis, imagens, vídeos, áudios, resposta, reações, digitação, recibos de leitura, exclusão, silenciar, arquivar, bloquear e denunciar.
- Imagens/vídeos com **visualização única**: abertura autorizada uma vez, consumo registrado no servidor, expiração, sem encaminhamento/download na interface. Proteger contra reabertura por corrida de requisições e URLs persistentes. Não prometer proteção absoluta contra câmera externa.
- Mensagens temporárias por **remetente**, independentes em cada conversa: desativado, 1h, 12h, 24h, 7d ou 30d. Prazo começa no envio e só vale para mensagens novas; expiração remove para ambas as partes, observadas retenções legais/denúncias.
- Chats do casal: modo **compartilhado** (mensagens em nome do casal) ou **identificado** (indica integrante emissor). Ambos acessam apenas conversas do perfil de casal, nunca chats pessoais.

## 6. Feed, Stories, grupos e eventos
- Feed: texto, fotos, vídeos, carrosséis, curtidas, comentários, compartilhamento interno, enquetes, marcações, localização aproximada, salvos e controle de comentários.
- Visibilidade por publicação: todos autorizados a ver o perfil, seguidores, conexões, apenas individuais, apenas casais ou somente eu. Regra mais restritiva entre publicação e perfil prevalece.
- Stories de 24h: foto/vídeo, música (somente conteúdo licenciado), textos, figurinhas, enquetes, perguntas, marcações, respostas privadas, reações, lista de espectadores e horário, ocultar de perfis específicos. Públicos: todos autorizados, seguidores, conexões, individuais, casais, lista personalizada. Destaques permanentes com capa, nome e privacidade própria.
- Grupos: **público** (encontrável, entrada aberta conforme regras), **privado** (encontrável, entrada aprovada) e **secreto** (não listado, convite). Chat, feed, enquetes, eventos, moderação, permissões de publicação/convite, filtros de idade 18+, tipo de perfil e região.
- Eventos: público, privado e secreto; capa, agenda, organizadores, convites, aprovação, limite, lista de espera, comentários, lembretes, chat de confirmados; endereço exato só para aprovados; lista de participantes pode ser oculta; eventos exclusivos de grupos.

## 7. Notificações
- Categorias: mensagens, matches/conexões, social, galerias, grupos, eventos, segurança.
- Push ou somente internas, controle granular, silêncio por conversa/grupo, horário de silêncio, separação individual/casal e ocultação de prévias na tela bloqueada. Alertas essenciais de segurança continuam disponíveis nos canais apropriados.

## 8. Monetização
- **Gratuito:** funcionalidades gerais, inclusive criação de galeria privada, matches, chat após Match e acesso a galerias explicitamente autorizadas.
- **Premium:** visualizar quem demonstrou interesse antes de Match; iniciar solicitação de contato sem Match; solicitar acesso a galerias privadas de terceiros.
- Premium nunca ignora privacidade, bloqueios ou consentimento. Entitlements conferidos no backend; compras in-app conforme regras vigentes das lojas; webhooks idempotentes, status de assinatura e restauração de compras.

## 9. Arquitetura e módulos
```text
entrenos/
  apps/
    mobile/          # Expo Router, React Native, TypeScript
    admin/           # Next.js, TypeScript, painel administrativo
  packages/
    shared/          # tipos, validações, regras puras, constantes
    ui/              # tokens de design e componentes compartilháveis
  supabase/
    migrations/      # SQL versionado, RLS, índices, constraints
    functions/       # ações privilegiadas, mídia efêmera, webhooks
    seed.sql         # dados fictícios para ambiente local
  docs/
    architecture.md
    security.md
    api-contracts.md
    decisions.md
  .env.example
```
- Supabase Auth, PostgreSQL, Storage privado, Realtime e Edge Functions.
- RLS habilitada em todas as tabelas expostas; storage policies; operações sensíveis via funções server-side. **Nunca** expor service role ou segredos de pagamento no cliente.
- Serviços adicionais poderão ser necessários para liveness, notificações push, transcodificação de vídeo, moderação e filas. Custos gratuitos não são garantidos em escala.

## 10. Modelo lógico de dados (proposta inicial)
- **Identidade:** `users_private`, `profiles`, `profile_members`, `couple_invitations`, `profile_preferences`, `profile_visibility`, `profile_verifications`, `verification_reviews`.
- **Relacionamentos:** `follows`, `connection_requests`, `connections`, `discovery_actions`, `matches`, `blocks`, `reports`.
- **Galerias:** `gallery_albums`, `gallery_media`, `gallery_access_requests`, `gallery_grants`, `gallery_visit_logs`.
- **Chat:** `conversations`, `conversation_members`, `message_requests`, `messages`, `message_media`, `message_reactions`, `message_receipts`, `conversation_settings`.
- **Social:** `posts`, `post_media`, `post_audiences`, `post_likes`, `post_comments`, `post_saves`, `polls`, `poll_votes`, `stories`, `story_views`, `story_highlights`.
- **Comunidades:** `groups`, `group_members`, `group_join_requests`, `group_posts`, `events`, `event_attendees`, `event_invites`.
- **Operação:** `notifications`, `notification_preferences`, `subscriptions`, `subscription_events`, `admin_roles`, `moderation_actions`, `audit_logs`.

### Restrições essenciais
- `profiles` representam a identidade ativa; `profile_members` vincula uma ou duas pessoas com papéis e consentimento; nenhuma consulta de perfil ativo pode vazar dados de outra identidade.
- Impedir duplicação de ações de seguir/interesse/Match e concessões inconsistentes com índices únicos e transações.
- Match gerado apenas por reciprocidade válida e perfis elegíveis; chat autorizado por Match, conexão ou solicitação aceita.
- Aprovação de selfie exige função privilegiada, trilha de auditoria e dupla aprovação para selo de casal (uma por integrante).
- Solicitações de galeria exigem Premium válido no momento da solicitação; concessão exige autorização do proprietário, e de ambos no caso de casal.
- Conteúdo temporário usa `expires_at` e processo de expiração confiável; não depender apenas de timer do celular.
- Conteúdo privado e arquivos de selfie usam buckets privados e URLs assinadas de curta duração; downloads não devem ficar publicamente indexáveis.

## 11. Segurança, LGPD e moderação
- Consentimento explícito e finalidade clara para selfies/liveness, dados sensíveis e localização; definir prazo de retenção e descarte, base legal e direitos dos titulares com assessoria jurídica.
- Minimização de dados; HTTPS, criptografia em repouso do provedor, auditoria, rate limiting, proteção antispam, validação de uploads, verificação de MIME, limites de tamanho, controle de conteúdo e canais de denúncia.
- Conteúdo denunciado pode ser preservado em ambiente restrito pelo prazo adequado para apuração; acesso administrativo excepcional, justificado e auditado.
- No Android, aplicar `FLAG_SECURE` via implementação nativa testada; pode bloquear capturas/gravadores ou produzir tela preta dependendo do dispositivo. Não garante contra câmeras externas. No iOS não prometer bloqueio equivalente.
- Implementar política de conteúdo, proteção de menores, denúncia, recurso contra moderação, exclusão de conta e exportação de dados.

## 12. Painel administrativo
- Dashboard: cadastros, atividade, assinaturas e receita.
- Fila de verificações: pendente/em análise/aprovado/reprovado/novo envio, evidência protegida, motivo e auditoria. **Aprovação manual exclusiva de administrador autorizado**.
- Fila de denúncias, usuários, bloqueios, grupos, eventos, financeiro, notificações administrativas, papéis e auditoria.
- Autorização server-side por função e menor privilégio; moderador/suporte sem permissão automática para aprovar selfie.

## 13. Plano de implementação e critérios de aceite
**Fase 0 — Fundação:** monorepo, tokens visuais, Expo development build, Next.js, Supabase local, migrations, CI, testes e `.env.example`.

**Fase 1 — Contas e perfis:** login, onboarding 18+, individual/casal, consentimento dos dois, alternância de identidade, privacidade e RLS. **Aceite:** conta B não acessa dados privados da conta A; parceiro não vê chat individual.

**Fase 2 — Descoberta e relacionamentos:** Explorar, filtros, seguir/conectar, Descobrir, Matches e regras de casal. **Aceite:** match apenas por reciprocidade e aprovação conjunta quando configurada.

**Fase 3 — Chat e galerias:** solicitações, Realtime, mídias, visualização única, expiração, galeria privada e acesso recíproco. **Aceite:** mídia única não reabre; revogação de acesso recíproco remove ambos os acessos.

**Fase 4 — Social e comunidades:** feed, Stories, destaques, grupos, eventos e notificações. **Aceite:** todas as consultas respeitam audiências e bloqueios.

**Fase 5 — Premium e administração:** compras, entitlements, dashboard, denúncias, selfie manual e auditoria. **Aceite:** plano grátis não solicita acesso a galeria; admin não autorizado não aprova selfie; casal só recebe selo após duas aprovações.

**Fase 6 — Qualidade e publicação:** testes de integração/E2E, revisão de segurança, carga, acessibilidade, políticas de loja, LGPD, publicação Android e preparação iOS.

## 14. Pontos que precisam de validação durante a implementação
- Fornecedor de selfie com prova de presença e comparação, custos, tratamento de biometria e critérios de análise manual.
- Provedor de pagamentos/assinaturas e regras atuais das lojas; valor do Premium ainda não definido.
- Política de moderação, retenção de dados, denúncia e tratamento de conteúdo adulto conforme regras de distribuição das lojas.
- Licenciamento de músicas para Stories, custos de vídeo e push.
- Limites de upload, políticas de mídia, métricas e objetivos de lançamento.

> Este documento consolida decisões de produto e propõe um desenho técnico inicial. Detalhes operacionais ainda sujeitos a validação não devem ser tratados como decisões já aprovadas.
