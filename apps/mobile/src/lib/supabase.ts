import "../auth/crypto";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import {
  readPublicSupabaseConfig,
  createRememberedSessionStorage,
  type Database,
} from "@entrenos/shared";

export const backend = readPublicSupabaseConfig(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
const sessionKey =
  backend.status === "ready"
    ? `sb-${new URL(backend.config.url).hostname.split(".")[0]}-auth-token`
    : "entrenos-auth-token";
const remembered = createRememberedSessionStorage(SecureStore, sessionKey);
export const getRememberSession = remembered.getRemember;
export const setRememberSession = remembered.setRemember;
const storage = remembered.storage;
export const supabase =
  backend.status === "ready"
    ? createClient<Database>(
        backend.config.url,
        backend.config.publishableKey,
        {
          auth: {
            storage,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            flowType: "pkce",
          },
        },
      )
    : null;
