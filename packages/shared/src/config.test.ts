import { describe, expect, it } from "vitest";
import { readPublicSupabaseConfig } from "./index";
const anon = `e30.${btoa(JSON.stringify({ role: "anon" }))}.signature`;
const secret = `e30.${btoa(JSON.stringify({ role: "service_role" }))}.signature`;
describe("configuração pública Supabase", () => {
  it("permite iniciar sem credenciais, sem fingir conexão", () => {
    expect(readPublicSupabaseConfig()).toEqual({ status: "missing" });
    expect(readPublicSupabaseConfig("https://example.supabase.co", "")).toEqual(
      { status: "missing" },
    );
  });
  it("aceita chave publicável e anon legado", () => {
    for (const key of ["sb_publishable_test", anon]) {
      expect(
        readPublicSupabaseConfig("https://example.supabase.co", key).status,
      ).toBe("ready");
    }
  });
  it("rejeita service role, segredo, JWT quebrado e URL inválida", () => {
    for (const key of [
      secret,
      "sb_secret_test",
      "e30.invalid.signature",
      "qualquer-chave",
    ]) {
      expect(
        readPublicSupabaseConfig("https://example.supabase.co", key).status,
      ).toBe("invalid");
    }
    for (const url of ["not-url", "ftp://localhost", "http://example.com"]) {
      expect(readPublicSupabaseConfig(url, anon).status).toBe("invalid");
    }
  });
  it("aceita desenvolvimento local, inclusive emulador Android", () => {
    expect(readPublicSupabaseConfig("http://10.0.2.2:54321", anon).status).toBe(
      "ready",
    );
  });
});
