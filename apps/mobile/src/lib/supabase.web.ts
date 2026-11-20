import "../auth/crypto";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import {
  readPublicSupabaseConfig,
  createRememberedSessionStorage,
  type Database,
} from "@entrenos/shared";

// Browser storage is used only on web; native builds keep credentials in the
// platform Keychain/Android Keystore through supabase.ts and expo-secure-store.
const browserStorage = {
  async getItemAsync(key: string) {
    return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
  },
  async setItemAsync(key: string, value: string) {
    if (typeof localStorage === "undefined")
      throw new Error("Armazenamento local indisponível neste navegador.");
    localStorage.setItem(key, value);
  },
  async deleteItemAsync(key: string) {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  },
};

export const backend = readPublicSupabaseConfig(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
const sessionKey =
  backend.status === "ready"
    ? `sb-${new URL(backend.config.url).hostname.split(".")[0]}-auth-token`
    : "entrenos-auth-token";
const remembered = createRememberedSessionStorage(browserStorage, sessionKey);
export const getRememberSession = remembered.getRemember;
export const setRememberSession = remembered.setRemember;
export const supabase =
  backend.status === "ready"
    ? createClient<Database>(
        backend.config.url,
        backend.config.publishableKey,
        {
          auth: {
            storage: remembered.storage,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            flowType: "pkce",
          },
        },
      )
    : null;
