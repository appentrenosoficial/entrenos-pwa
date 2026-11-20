import { createSessionStorage, type SecureKeyValue } from "./secure-storage";
// A preferência só altera a persistência da sessão. Verifiers PKCE permanecem
// seguros em disco para permitir o retorno do e-mail/navegador no mesmo aparelho.
export function createRememberedSessionStorage(
  secure: SecureKeyValue,
  sessionKey: string,
) {
  const durable = createSessionStorage(secure);
  const preferenceKey = sessionKey + ".remember";
  let preference: Promise<boolean> | undefined;
  const memory = new Map<string, string>();
  const isSession = (key: string) =>
    key === sessionKey || key === sessionKey + "-user";
  const getRemember = () =>
    (preference ??= (async () =>
      (await secure.getItemAsync(preferenceKey)) !== "0")());
  const storage = {
    async getItem(key: string) {
      if (isSession(key) && !(await getRemember()))
        return memory.get(key) ?? null;
      return durable.getItem(key);
    },
    async setItem(key: string, value: string) {
      if (isSession(key) && !(await getRemember())) {
        memory.set(key, value);
        await durable.removeItem(key);
        return;
      }
      await durable.setItem(key, value);
    },
    async removeItem(key: string) {
      if (isSession(key)) memory.delete(key);
      await durable.removeItem(key);
    },
  };
  const setRemember = async (value: boolean) => {
    const previous = await getRemember();
    if (value === previous) return;
    for (const key of [sessionKey, sessionKey + "-user"]) {
      if (!value) {
        const stored = await durable.getItem(key);
        if (stored !== null) memory.set(key, stored);
        await durable.removeItem(key);
      } else {
        const stored = memory.get(key);
        if (stored !== undefined) await durable.setItem(key, stored);
      }
    }
    await secure.setItemAsync(preferenceKey, value ? "1" : "0");
    preference = Promise.resolve(value);
  };
  return { storage, getRemember, setRemember };
}
