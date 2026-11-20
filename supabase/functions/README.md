# Edge Functions

Diretório reservado para ações privilegiadas futuras. Nenhum endpoint publicado
nesta etapa. Não há adaptadores que simulem liveness, assinatura ou push.

As próximas entregas devem validar JWT, identidade ativa, papéis/entitlements e
consentimento no servidor, com rate limiting e auditoria. Segredos ficam no
ambiente das funções, nunca em variáveis EXPO_PUBLIC_ ou NEXT_PUBLIC_.
