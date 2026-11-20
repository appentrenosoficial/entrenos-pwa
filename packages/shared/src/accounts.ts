import { z } from "zod";
export const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;
export const visibilityOptions = [
  { value: "registered", label: "Todos os cadastrados" },
  { value: "individuals", label: "Apenas individuais" },
  { value: "couples", label: "Apenas casais" },
  { value: "connections", label: "Apenas conexões aceitas" },
  { value: "hidden", label: "Oculto das buscas" },
] as const;
export const preferenceOptions = [
  { value: "friendship", label: "Amizades" },
  { value: "relationship", label: "Relacionamentos" },
  { value: "individuals", label: "Perfis individuais" },
  { value: "couples", label: "Perfis de casal" },
] as const;
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9_]{3,30}$/,
    "Username: 3 a 30 letras minúsculas, números ou _.",
  );
export const emailSchema = z.email({ error: "Informe um e-mail válido." });
export const passwordSchema = z
  .string()
  .min(12, "Use pelo menos 12 caracteres.")
  .max(128, "Use no máximo 128 caracteres.");
export function parseBrazilianDate(input: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input);
  if (!m) return null;
  const iso = `${m[3]}-${m[2]}-${m[1]}`;
  const date = new Date(iso + "T12:00:00Z");
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso
    ? iso
    : null;
}
export function isAdult(birth: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || !/^\d{4}-\d{2}-\d{2}$/.test(today))
    return false;
  const b = new Date(birth + "T12:00:00Z");
  if (Number.isNaN(b.getTime()) || b.toISOString().slice(0, 10) !== birth)
    return false;
  // Mesmo critério de aniversário do PostgreSQL para 29/02 em anos não bissextos.
  const year = Number(birth.slice(0, 4)) + 18;
  const lastDay = new Date(
    Date.UTC(year, Number(birth.slice(5, 7)), 0),
  ).getUTCDate();
  const anniversary = `${year}-${birth.slice(5, 7)}-${String(Math.min(Number(birth.slice(8)), lastDay)).padStart(2, "0")}`;
  return anniversary <= today;
}
export const profileInputSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "Informe um apelido com pelo menos 2 caracteres.")
    .max(60),
  bio: z.string().max(500),
  city: z.string().trim().min(2, "Informe sua cidade.").max(100),
  state: z.enum(states, { error: "Selecione a UF." }),
  interests: z.array(z.string().trim().min(1).max(40)).max(20),
  preferences: z
    .array(z.enum(["friendship", "relationship", "individuals", "couples"]))
    .max(4),
  audience: z.enum([
    "registered",
    "individuals",
    "couples",
    "connections",
    "hidden",
  ]),
});
export type ProfileInput = z.infer<typeof profileInputSchema>;
// Somente esses callbacks são processados. Tokens em fragmentos não são aceitos:
// a sessão usa PKCE, sem receber access_token de um deep link arbitrário.
export function parseAuthCallback(
  raw: string,
): { code: string; recovery: boolean } | null {
  try {
    const url = new URL(raw);
    if (
      url.protocol !== "entrenos:" ||
      url.hostname !== "auth" ||
      url.pathname !== "/callback"
    )
      return null;
    if (url.searchParams.has("error")) throw new Error("callback_error");
    const code = url.searchParams.get("code");
    if (!code || code.length > 2048) return null;
    return { code, recovery: url.searchParams.get("flow") === "recovery" };
  } catch {
    return null;
  }
}
