import "fast-text-encoding";
import * as NativeCrypto from "expo-crypto";

// Ponte real para as duas operações usadas pelo PKCE do Supabase. Não é uma
// implementação geral de WebCrypto (importKey/verify etc. não são oferecidos).
// Impede os fallbacks Math.random e challenge plain no runtime nativo.
const provider =
  typeof globalThis.crypto === "undefined" ? {} : globalThis.crypto;
if (
  !("getRandomValues" in provider) ||
  typeof provider.getRandomValues !== "function"
) {
  Object.defineProperty(provider, "getRandomValues", {
    value: NativeCrypto.getRandomValues,
    configurable: true,
  });
}
const subtle: object =
  "subtle" in provider && provider.subtle && typeof provider.subtle === "object"
    ? provider.subtle
    : {};
if (!("digest" in subtle) || typeof subtle.digest !== "function") {
  Object.defineProperty(subtle, "digest", {
    value: async (
      algorithm: AlgorithmIdentifier,
      data: BufferSource,
    ): Promise<ArrayBuffer> => {
      const name = typeof algorithm === "string" ? algorithm : algorithm.name;
      if (name.toUpperCase() !== "SHA-256")
        throw Error("Algoritmo não suportado pela ponte PKCE.");
      const bytes = ArrayBuffer.isView(data)
        ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
        : new Uint8Array(data);
      return NativeCrypto.digest(
        NativeCrypto.CryptoDigestAlgorithm.SHA256,
        new Uint8Array(bytes),
      );
    },
    configurable: true,
  });
  Object.defineProperty(provider, "subtle", {
    value: subtle,
    configurable: true,
  });
}
if (typeof globalThis.crypto === "undefined")
  Object.defineProperty(globalThis, "crypto", {
    value: provider,
    configurable: true,
  });
