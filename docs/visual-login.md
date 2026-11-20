# Identidade visual e acesso

As telas de carregamento e login usam as referências fornecidas pelo usuário,
com o símbolo e o nome extraídos de `logoentre.jpeg`. Os arquivos originais
permanecem intactos. A marca também é usada no ícone e no splash nativo.

O login mantém margem acima do símbolo e separação entre símbolo, nome e selo
18+. A arte escala proporcionalmente à largura; telas mais altas recebem espaço
extra nas faixas decorativas. Relógio, bateria e navegação são os do Android.

Para preservar os detalhes das referências, fundos, textos fixos e ornamentos
usam assets raster. Os campos de texto, botões, checkbox e mensagens são controles
nativos acessíveis sobre a arte. Cadastro e recuperação mantêm seus formulários
existentes. O fundo não deve conter a marca antiga: as versões preparadas em
`apps/mobile/assets/brand` removem essa marca antes de sobrepor o logo fornecido.

O carregamento gira com Animated no thread nativo. A entrada espera a preparação
dos assets, restauração da sessão e carregamento da conta; não exibe porcentagens
simuladas. O primeiro ciclo da animação faz parte da abertura da identidade visual.

"Manter conectado" controla o armazenamento real da sessão. Desmarcado, tokens
da sessão ficam somente em memória; o verificador PKCE continua no SecureStore
para permitir callbacks de confirmação e recuperação. Marcado, a sessão usa o
adaptador seguro existente. Dois testes cobrem persistência e sessão temporária.

Google continua dependendo da configuração real do provedor no Supabase. Nenhum
login é simulado quando o provedor está indisponível.

## Verificação em 18/11/2026

- ESLint, TypeScript dos quatro workspaces e 12 testes unitários passaram.
- Exportação Android passou; APK arm64 compilado em 6m14s e instalado via ADB.
- Login conferido em captura do aparelho: marca correta e margem superior.
  Toque em Entrar com e-mail vazio mostrou a validação real. Gravação da abertura
  confirmou a rotação do indicador e a transição para o login.
- Expo Doctor: 19/20. Única pendência: versões recomendadas mais recentes de
  expo, expo-dev-client, expo-router e expo-web-browser. As versões instaladas
  foram mantidas nesta alteração visual.
