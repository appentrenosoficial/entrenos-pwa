# PROMPT PARA CODEX — CONSTRUIR O ENTRENÓS

Você é o engenheiro principal responsável por implementar **EntreNós**, rede social 18+ para perfis individuais e de casal, com Android primeiro e iOS depois. **Leia integralmente `01_ESPECIFICACAO_TECNICA_ENTRENOS.md` antes de escrever código.** Ela é a fonte de verdade de regras funcionais e critérios de aceite. Se existir um arquivo de referência visual no projeto, inspecione-o e preserve a identidade dark roxo/magenta. Não invente funcionalidades incompatíveis com a especificação.

## Objetivo
Construir um monorepo real, executável e testável, com:
- `apps/mobile`: React Native + Expo Router + TypeScript, **Expo development build**, não depender de Expo Go para recursos nativos.
- `apps/admin`: Next.js + TypeScript, painel administrativo responsivo e protegido.
- `packages/shared`: tipos, schemas Zod, regras de domínio e contratos.
- `supabase/migrations`: schema PostgreSQL, constraints, índices, funções e políticas RLS.
- `supabase/functions`: endpoints privilegiados, webhook de assinatura, mídia efêmera e rotinas de moderação.
- Testes unitários, integração e E2E para fluxos críticos, instruções de execução e `.env.example` sem segredos.

## Instruções obrigatórias
1. **Trabalhe em fases.** Antes de cada fase, apresente arquivos afetados, migrações, critérios de aceite e riscos; implemente; execute lint/typecheck/testes; reporte o que passou e o que depende de credenciais externas. Não alegue testes não executados.
2. **Comece pela Fase 0 e Fase 1.** Não implemente tudo de uma vez. Ao final de cada fase entregue uma versão navegável e um checklist objetivo.
3. **Segurança no backend:** RLS em toda tabela exposta, storage privado para mídias sensíveis, validação de entitlements Premium no servidor, rate limiting, auditoria, proteção contra IDOR e acesso cruzado entre perfis. Nunca inclua `service_role` no mobile ou frontend do admin.
4. **Perfis de casal:** consentimento de ambos; mensagens pessoais isoladas; aprovação conjunta para interesses quando o modo conjunto estiver ativo; selo verificado somente após selfie aprovada individualmente para ambos.
5. **Selfie:** status inicial `em_analise`; aprovação apenas por administrador com permissão específica no painel; nunca autoaprovar. Criar interfaces para análise manual e trilha de auditoria; serviço de liveness poderá ser um adaptador até contratação de fornecedor.
6. **Galerias privadas:** todos criam; apenas Premium solicita acesso a galerias de terceiros; proprietário autoriza, recusa ou propõe reciprocidade; ambos os membros aprovam concessões de casal; revogação recíproca remove ambos os acessos; nunca ignorar bloqueios e privacidade.
7. **Match e mensagens:** Match recíproco libera chat, conexão opcional; solicitações de mensagens respeitam consentimento. Premium pode iniciar solicitação sem Match, nunca impor conversa. Mídia de visualização única deve ser consumida de forma atômica no servidor; mensagens temporárias são configuradas por remetente.
8. **Capturas:** implementar proteção Android via módulo nativo/`FLAG_SECURE`, testar em development build; documentar limites Android/iOS e não prometer bloqueio absoluto.
9. **UI:** design premium profissional, fundo escuro, roxo/magenta, contraste e acessibilidade; cinco abas: Início, Explorar, Criar, Chat, Perfil. Criar estados vazios, carregamento, erros e bloqueios por permissão.
10. **Sem falsos recursos:** se dependência externa (liveness, pagamento, push, vídeo, músicas) ainda não estiver configurada, usar interface/adaptador explicitamente identificado como pendente, sem simular verificação aprovada ou cobrança real.

## Sequência sugerida
### Fase 0 — Estrutura
Inicializar workspace, configuração Expo/Next/Supabase, design tokens, navegação base, autenticação de ambiente, CI, lint, TypeScript strict, README e scripts. Entregar telas com componentes reais e dados de desenvolvimento claramente identificados.

### Fase 1 — Auth e perfis
Google OAuth + e-mail/senha, confirmação de e-mail, 18+, perfil individual, convites/consentimento para casal, alternância de perfil ativo, privacidade e RLS. Testar isolamento de dados entre usuários.

### Fase 2 — Explorar e Match
Grade, filtros de idade/localidade/verificados, swipe, seguir, conexão, reciprocidade, Match, regras modo livre/conjunto de casais.

### Fase 3 — Chat e galerias
Chat Realtime, solicitações, anexos, áudio, reações, mensagens temporárias por remetente, mídia de visualização única, galerias privadas, álbuns, autorização e reciprocidade.

### Fase 4 — Social
Feed, Stories 24h, destaques, enquetes, grupos públicos/privados/secretos, eventos, notificações e privacidade por conteúdo.

### Fase 5 — Premium e administração
Entitlements, compras/restauração, painel Next.js, verificação de selfie em análise e aprovação manual, denúncias, auditoria e métricas.

### Fase 6 — Hardening e publicação
E2E, acessibilidade, proteção de screenshots Android, revisão LGPD, revisão de políticas das lojas, build Android e preparação iOS.

## Primeiro comando de trabalho
1. Leia o documento técnico e examine a estrutura atual do repositório.
2. Mostre um plano curto de execução da Fase 0 e Fase 1.
3. Implemente a Fase 0 e inicie a Fase 1, sem pedir confirmação para escolhas técnicas reversíveis; registre decisões no `docs/decisions.md`.
4. Crie migrations SQL reais com RLS, testes de autorização e documentação de configuração.
5. Execute os comandos disponíveis e relate resultados e pendências.

**Critério de sucesso:** projeto que compila e pode ser testado de forma incremental, com privacidade e autorização implementadas no servidor, sem interfaces que fingem ter segurança ou integrações não configuradas.
