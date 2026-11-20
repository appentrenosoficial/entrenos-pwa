import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AppState, Platform } from "react-native";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type State = {
  session: Session | null;
  loading: boolean;
  recovery: boolean;
  setRecovery: (value: boolean) => void;
  error: string | null;
  signOut: () => Promise<void>;
};
const Context = createContext<State | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;
    let revision = 0;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      revision++;
      if (!alive) return;
      setSession(next);
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") {
        setRecovery(false);
        setError(null);
      }
    });
    const initialRevision = revision;
    supabase.auth
      .getSession()
      .then(({ data, error: err }) => {
        if (alive && revision === initialRevision) {
          setSession(data.session);
          setError(
            err
              ? "Não foi possível recuperar a sessão. Entre novamente."
              : null,
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setError("Falha ao ler a sessão segura.");
          setLoading(false);
        }
      });
    let listener: ReturnType<typeof AppState.addEventListener> | undefined;
    if (Platform.OS === "web") {
      supabase.auth.startAutoRefresh();
    } else {
      const refresh = (state: string | null | undefined) => {
        if (state === "active") supabase!.auth.startAutoRefresh();
        else supabase!.auth.stopAutoRefresh();
      };
      refresh(AppState.currentState);
      listener = AppState.addEventListener("change", refresh);
    }
    return () => {
      alive = false;
      subscription.unsubscribe();
      listener?.remove();
      supabase!.auth.stopAutoRefresh();
    };
  }, []);
  const signOut = async () => {
    if (!supabase) return;
    const { error: err } = await supabase.auth.signOut({ scope: "local" });
    if (err)
      throw new Error("Não foi possível encerrar a sessão. Tente novamente.");
    setSession(null);
    setRecovery(false);
  };
  return (
    <Context.Provider
      value={{ session, loading, recovery, setRecovery, error, signOut }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(Context);
  if (!ctx) throw Error("AuthProvider ausente");
  return ctx;
}
