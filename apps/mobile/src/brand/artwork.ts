/* eslint-disable @typescript-eslint/no-require-imports -- Metro exige referências estáticas para os PNGs. */
export const artwork = {
  loading: require("../../assets/brand/loading-background.png"),
  login: require("../../assets/brand/login-background.png"),
  symbol: require("../../assets/brand/brand-symbol.png"),
  wordmark: require("../../assets/brand/brand-wordmark.png"),
} as const;
export const REFERENCE_WIDTH = 941;
export const REFERENCE_HEIGHT = 1672;
// A faixa de hora/bateria da referência é substituída pela barra real do sistema.
export const REFERENCE_STATUS_HEIGHT = 80;
