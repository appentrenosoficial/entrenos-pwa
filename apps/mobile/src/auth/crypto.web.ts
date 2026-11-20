import "fast-text-encoding";

// O navegador usa Web Crypto nativo. O deploy é HTTPS, condição necessária
// para o PKCE operar com getRandomValues e SHA-256 de forma segura.
if (
  typeof globalThis.crypto === "undefined" ||
  typeof globalThis.crypto.getRandomValues !== "function" ||
  typeof globalThis.crypto.subtle?.digest !== "function"
)
  throw new Error("Este navegador precisa oferecer Web Crypto em HTTPS.");
