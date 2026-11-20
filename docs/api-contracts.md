# Contratos — contas e perfis

Tipos gerados: `packages/shared/src/database.types.ts`.
Autenticação via Supabase Auth; RPCs abaixo exigem JWT autenticado e verificam
`auth.uid()` internamente. A chave publicável sozinha não autoriza acesso.
Nenhum `user_id` arbitrário é aceito para escrever em outra conta.

| RPC                         | Comportamento                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `complete_onboarding`       | Valida e-mail confirmado, consentimento 18+ e aniversário no servidor. Grava dados civis privados, perfil individual, biografia, preferências, vínculo e contexto numa transação. |
| `set_active_profile`        | Aceita somente ID de perfil pertencente à conta atual.                                                                                                                            |
| `update_profile`            | Edita dados públicos e visibilidade somente do perfil ativo autorizado.                                                                                                           |
| `get_profile`               | Leitura direta por UUID respeita audiência; oculto das buscas continua acessível por link direto.                                                                                 |
| `invite_couple`             | Remetente consente ao enviar. Procura destinatário por username individual, verifica ausência de vínculo atual, limita convites e registra proposta.                              |
| `invitation_partners`       | Somente as duas partes podem consultar os usernames individuais e a cidade/UF iniciais associados à proposta.                                                                     |
| `respond_couple_invitation` | Somente destinatário aceita/recusa convite pendente e válido. Aceite cria exatamente dois vínculos. Locks e índices impedem casais duplicados.                                    |
| `cancel_couple_invitation`  | Somente remetente cancela convite pendente.                                                                                                                                       |
| `leave_couple`              | Retira consentimento e encerra o perfil compartilhado. Restaura contexto individual; não acessa chats pessoais.                                                                   |
| `set_profile_avatar`        | Vincula arquivo já enviado ao bucket privado, verificando pasta e identidade ativa.                                                                                               |

## Tabelas e leitura

- `users_private`: SELECT da própria conta, sem escrita direta pelo cliente.
- `profiles`: RLS aplica audiência pelo tipo de identidade ativa. Perfil próprio
  sempre legível. `hidden` não aparece em listagem bruta; `get_profile` permite
  acesso direto a cadastrados. Ocultar não apaga a conta.
- `profile_members`, `profile_visibility`: somente membros daquele perfil.
- `account_context`: somente a conta titular; mutação pela RPC.
- `couple_invitations`: somente remetente/destinatário.
- `connections`: somente identidade ativa envolvida; criação ainda indisponível.
- `conversations`, `conversation_members`, `messages`: SELECT somente quando
  `account_context.active_profile_id` participa. Nenhum grant de escrita ao cliente.

## Limites técnicos iniciais

Username: 3–30 letras ASCII minúsculas, números e `_`; nickname: 2–60;
biografia: até 500; cidade: 2–100; UF brasileira; até 20 interesses de 1–40
caracteres; preferências entre amizade, relacionamento, individuais e casais.
São validações operacionais desta entrega, versionadas e revisáveis.
Convite expira em 7 dias; até 5 envios bem-sucedidos por conta/dia.
Atualização de perfil: até 30 por hora. Auth possui rate limiting próprio.
Tentativas SQL que falham revertem também o registro transacional do limitador;
proteção contra abuso de tentativas inválidas exige camada de gateway futura.

## Sessão e callback

`entrenos://auth/callback` e `entrenos://auth/callback?flow=recovery` são os
redirects permitidos. Apenas `code` PKCE é trocado por sessão. Fragmentos com
tokens e URLs de outros hosts/esquemas são rejeitados. Abra os e-mails no mesmo
aparelho que iniciou o fluxo e use o link mais recente. O verifier permanece no
SecureStore, inclusive após reiniciar o app. Um código já processado não é
consumido duas vezes pelo browser e pela rota.

`readPublicSupabaseConfig` informa apenas validade de formato; não equivale a
sessão nem à disponibilidade das migrations. Erro de schema ausente tem estado
próprio, sem sessão ou perfil fabricado.
