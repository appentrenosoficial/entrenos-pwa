import { z } from "zod";

export const APP_NAME = "EntreNós";
export const APP_TAGLINE = "Conexões reais começam aqui.";
export const MINIMUM_AGE = 18;
export const profileTypeSchema = z.enum(["individual", "couple"]);
export type ProfileType = z.infer<typeof profileTypeSchema>;
export const verificationStatusSchema = z.enum([
  "em_analise",
  "aprovado",
  "reprovado",
  "novo_envio",
]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

// A validação protege a configuração; não substitui autenticação ou RLS.
const publicKeySchema = z
  .string()
  .trim()
  .min(1)
  .refine((key) => {
    if (key.startsWith("sb_publishable_")) return true;
    // Suporte a anon JWT legado. Segredos/JWT service_role são rejeitados.
    if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key))
      return false;
    try {
      const payload = JSON.parse(
        atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      ) as { role?: string };
      return payload.role === "anon";
    } catch {
      return false;
    }
  }, "Use apenas uma chave publicável ou anon.");
const publicConfigSchema = z.object({
  url: z.url().refine((value) => {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" ||
        (url.protocol === "http:" &&
          ["localhost", "127.0.0.1", "10.0.2.2"].includes(url.hostname))
      );
    } catch {
      return false;
    }
  }, "Use HTTPS ou endereço de desenvolvimento local."),
  publishableKey: publicKeySchema,
});
export type PublicSupabaseConfig = z.infer<typeof publicConfigSchema>;
export type BackendConfiguration =
  | { status: "ready"; config: PublicSupabaseConfig }
  | { status: "missing" | "invalid" };
export function readPublicSupabaseConfig(
  url?: string,
  publishableKey?: string,
): BackendConfiguration {
  if (!url?.trim() || !publishableKey?.trim()) return { status: "missing" };
  const result = publicConfigSchema.safeParse({ url, publishableKey });
  return result.success
    ? { status: "ready", config: result.data }
    : { status: "invalid" };
}
export * from "./accounts";
export type { Database, Tables } from "./database.types";
export { createSessionStorage } from "./secure-storage";
export { createRememberedSessionStorage } from "./remembered-session";
