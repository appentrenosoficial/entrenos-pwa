import "server-only";
import { readPublicSupabaseConfig } from "@entrenos/shared";
export function getBackendStatus() {
  return readPublicSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ).status;
}
