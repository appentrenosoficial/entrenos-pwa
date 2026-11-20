import { describe, it, expect } from "vitest";
import {
  isAdult,
  parseBrazilianDate,
  parseAuthCallback,
  usernameSchema,
} from "./accounts";
describe("maioridade e validações de perfil", () => {
  it("respeita o dia exato do aniversário", () => {
    expect(isAdult("2008-11-15", "2026-11-15")).toBe(true);
    expect(isAdult("2008-11-16", "2026-11-15")).toBe(false);
    expect(isAdult("2027-01-01", "2026-11-15")).toBe(false);
  });
  it("trata 29/02 como o PostgreSQL e rejeita datas inexistentes", () => {
    expect(isAdult("2008-02-29", "2026-02-28")).toBe(true);
    expect(parseBrazilianDate("29/02/2008")).toBe("2008-02-29");
    expect(parseBrazilianDate("31/02/2008")).toBeNull();
    expect(isAdult("2008-02-31", "2026-11-15")).toBe(false);
  });
  it("normaliza username e rejeita identificadores inválidos", () => {
    expect(usernameSchema.parse(" Pessoa_A ")).toBe("pessoa_a");
    expect(usernameSchema.safeParse("ab").success).toBe(false);
    expect(usernameSchema.safeParse("nome com espaço").success).toBe(false);
  });
});
describe("callback de autenticação", () => {
  it("aceita apenas esquema e rota configurados", () => {
    expect(parseAuthCallback("entrenos://auth/callback?code=abc")).toEqual({
      code: "abc",
      recovery: false,
    });
    expect(
      parseAuthCallback("entrenos://auth/callback?flow=recovery&code=abc")
        ?.recovery,
    ).toBe(true);
    for (const value of [
      "https://evil.test/auth/callback?code=abc",
      "entrenos://other/callback?code=abc",
      "entrenos://auth/other?code=abc",
      "entrenos://auth/callback#access_token=secret",
      "entrenos://auth/callback?error=denied",
    ])
      expect(parseAuthCallback(value)).toBeNull();
  });
});
