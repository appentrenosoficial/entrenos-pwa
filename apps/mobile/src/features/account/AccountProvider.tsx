import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState, Platform } from "react-native";
import { useAuth } from "../../auth/AuthProvider";
import { loadAccount, accountError, type Account } from "./api";
type State = {
  account: Account | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clear: () => void;
};
const Context = createContext<State | null>(null);
export function AccountProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const [owner, setOwner] = useState<string | undefined>(undefined);
  const clear = useCallback(() => {
    generation.current++;
    setAccount(null);
    setError(null);
  }, []);
  const refresh = useCallback(async () => {
    const revision = ++generation.current;
    if (!userId) {
      setAccount(null);
      setLoading(false);
      setError(null);
      return;
    }
    // Limpa a identidade anterior antes de cada transição/refresh.
    setOwner(userId);
    setAccount(null);
    setLoading(true);
    setError(null);
    try {
      const data = await loadAccount();
      if (revision === generation.current) setAccount(data);
    } catch (err) {
      if (revision === generation.current) setError(accountError(err));
    } finally {
      if (revision === generation.current) setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    void refresh();
    return () => {
      generation.current++;
    };
  }, [refresh]);
  useEffect(() => {
    if (Platform.OS === "web") {
      const onVisibilityChange = () => {
        if (document.visibilityState === "visible") void refresh();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      return () =>
        document.removeEventListener("visibilitychange", onVisibilityChange);
    }
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") void refresh();
    });
    return () => sub.remove();
  }, [refresh]);
  return (
    <Context.Provider
      value={{
        account: owner === userId ? account : null,
        loading: loading || Boolean(userId && owner !== userId),
        error: owner === userId ? error : null,
        refresh,
        clear,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAccount() {
  const value = useContext(Context);
  if (!value) throw Error("AccountProvider ausente");
  return value;
}
