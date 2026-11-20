export type SecureKeyValue = {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};
// JWTs podem exceder o limite de um item nativo. Todos os fragmentos permanecem
// no SecureStore; o índice só é trocado depois de gravar a nova geração inteira.
export function createSessionStorage(secure: SecureKeyValue) {
  type Index = { version: string; count: number };
  const readIndex = (raw: string | null): Index | null => {
    try {
      const v = JSON.parse(raw ?? "null");
      return v &&
        typeof v.version === "string" &&
        /^[a-z0-9]+$/.test(v.version) &&
        Number.isInteger(v.count) &&
        v.count > 0 &&
        v.count <= 256
        ? v
        : null;
    } catch {
      return null;
    }
  };
  const part = (key: string, index: Index, n: number) =>
    `${key}.part.${index.version}.${n}`;
  const cleanup = async (key: string, index: Index | null) => {
    if (index)
      await Promise.all(
        Array.from({ length: index.count }, (_, n) =>
          secure.deleteItemAsync(part(key, index, n)),
        ),
      );
  };
  return {
    async getItem(key: string) {
      const raw = await secure.getItemAsync(key);
      const index = readIndex(raw);
      if (!index) return raw;
      const parts = await Promise.all(
        Array.from({ length: index.count }, (_, n) =>
          secure.getItemAsync(part(key, index, n)),
        ),
      );
      return parts.some((p) => p === null) ? null : parts.join("");
    },
    async setItem(key: string, value: string) {
      const previous = readIndex(await secure.getItemAsync(key));
      const chars = Array.from(value);
      const chunks: string[] = [];
      for (let i = 0; i < chars.length; i += 400)
        chunks.push(chars.slice(i, i + 400).join(""));
      if (!chunks.length) chunks.push("");
      if (chunks.length > 256)
        throw new Error("Sessão excede o limite de armazenamento seguro.");
      const index = {
        version:
          Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
        count: chunks.length,
      };
      try {
        const writes = await Promise.allSettled(
          chunks.map((v, n) => secure.setItemAsync(part(key, index, n), v)),
        );
        const failed = writes.find((result) => result.status === "rejected");
        if (failed?.status === "rejected") throw failed.reason;
        await secure.setItemAsync(key, JSON.stringify(index));
      } catch (error) {
        await cleanup(key, index).catch(() => {});
        throw error;
      }
      await cleanup(key, previous).catch(() => {});
    },
    async removeItem(key: string) {
      const index = readIndex(await secure.getItemAsync(key));
      await secure.deleteItemAsync(key);
      await cleanup(key, index);
    },
  };
}
