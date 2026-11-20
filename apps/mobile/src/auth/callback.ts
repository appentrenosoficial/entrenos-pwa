import { parseAuthCallback } from "@entrenos/shared";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";
const inFlight = new Map<string, Promise<boolean>>();
const processed = new Set<string>();
export const AUTH_CALLBACK =
  Platform.OS === "web" && typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "entrenos://auth/callback";
// Browser e Linking podem entregar o mesmo retorno. Troca única evita corrida PKCE.
export async function handleAuthCallback(url: string): Promise<boolean> {
  const callback = parseAuthCallback(url);
  if (!supabase) throw new Error("Supabase não configurado.");
  if (!callback)
    throw new Error(
      "A autenticação não foi concluída. Solicite um novo link ou entre por e-mail.",
    );
  if (processed.has(callback.code)) return callback.recovery;
  const existing = inFlight.get(callback.code);
  if (existing) return existing;
  const task = (async () => {
    const { error } = await supabase!.auth.exchangeCodeForSession(
      callback.code,
    );
    if (error)
      throw new Error(
        "Não foi possível validar o link. Solicite um novo no mesmo aparelho.",
      );
    processed.add(callback.code);
    if (processed.size > 20) processed.delete(processed.values().next().value!);
    return callback.recovery;
  })();
  inFlight.set(callback.code, task);
  try {
    return await task;
  } finally {
    inFlight.delete(callback.code);
  }
}
