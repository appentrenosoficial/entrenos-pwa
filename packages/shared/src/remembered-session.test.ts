import { it, expect } from "vitest";
import { createRememberedSessionStorage } from "./remembered-session";
const fixture = () => {
  const data = new Map<string, string>();
  return {
    data,
    secure: {
      getItemAsync: async (k: string) => data.get(k) ?? null,
      setItemAsync: async (k: string, v: string) => {
        data.set(k, v);
      },
      deleteItemAsync: async (k: string) => {
        data.delete(k);
      },
    },
  };
};
it("mantém a sessão entre inicializações quando a opção está marcada", async () => {
  const { secure } = fixture();
  const first = createRememberedSessionStorage(secure, "auth");
  expect(await first.getRemember()).toBe(true);
  await first.storage.setItem("auth", "token");
  const reopened = createRememberedSessionStorage(secure, "auth");
  expect(await reopened.storage.getItem("auth")).toBe("token");
});
it("desmarcar remove persistência da sessão e conserva somente PKCE seguro", async () => {
  const { secure, data } = fixture();
  const first = createRememberedSessionStorage(secure, "auth");
  await first.storage.setItem("auth", "old");
  await first.setRemember(false);
  await first.storage.setItem("auth", "new");
  await first.storage.setItem("auth-code-verifier", "verifier");
  expect(await first.storage.getItem("auth")).toBe("new");
  expect([...data.values()].some((v) => v === "new" || v === "old")).toBe(
    false,
  );
  const reopened = createRememberedSessionStorage(secure, "auth");
  expect(await reopened.getRemember()).toBe(false);
  expect(await reopened.storage.getItem("auth")).toBeNull();
  expect(await reopened.storage.getItem("auth-code-verifier")).toBe("verifier");
  await first.storage.removeItem("auth");
  expect(await first.storage.getItem("auth")).toBeNull();
});
