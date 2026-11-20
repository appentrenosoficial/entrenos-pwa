import { it, expect } from "vitest";
import { createSessionStorage } from "./secure-storage";
it("preserva sessão longa Unicode e remove todos os fragmentos ao sair", async () => {
  const values = new Map<string, string>();
  const store = createSessionStorage({
    getItemAsync: async (k) => values.get(k) ?? null,
    setItemAsync: async (k, v) => {
      expect(new TextEncoder().encode(v).length).toBeLessThan(2048);
      values.set(k, v);
    },
    deleteItemAsync: async (k) => {
      values.delete(k);
    },
  });
  const session = "🔒á".repeat(2000);
  await store.setItem("session", session);
  expect(await store.getItem("session")).toBe(session);
  await store.setItem("session", "new");
  expect(await store.getItem("session")).toBe("new");
  expect(values.size).toBe(2);
  await store.removeItem("session");
  expect(values.size).toBe(0);
});
it("mantém a geração anterior se uma gravação parcial falhar", async () => {
  const values = new Map<string, string>();
  let fail = false;
  const store = createSessionStorage({
    getItemAsync: async (k) => values.get(k) ?? null,
    setItemAsync: async (k, v) => {
      if (fail && k.endsWith(".1")) throw Error("disco indisponível");
      values.set(k, v);
    },
    deleteItemAsync: async (k) => {
      values.delete(k);
    },
  });
  await store.setItem("session", "original");
  fail = true;
  await expect(store.setItem("session", "x".repeat(900))).rejects.toThrow();
  expect(await store.getItem("session")).toBe("original");
});
