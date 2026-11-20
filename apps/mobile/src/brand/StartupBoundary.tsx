import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Platform, View } from "react-native";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../auth/AuthProvider";
import { useAccount } from "../features/account/AccountProvider";
import { artwork } from "./artwork";
import { LoadingScreen } from "./LoadingScreen";
// O splash nativo permanece até a primeira pintura da arte de carregamento.
void SplashScreen.preventAutoHideAsync().catch(() => {});
export function StartupBoundary({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const account = useAccount();
  const [introComplete, setIntroComplete] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [artworkVisible, setArtworkVisible] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preload = useCallback(() => {
    setError(null);
    void Asset.loadAsync([
      artwork.loading,
      artwork.login,
      artwork.symbol,
      artwork.wordmark,
    ])
      .then(() => {
        setAssetsReady(true);
        if (Platform.OS === "web") setArtworkVisible(true);
      })
      .catch(() => {
        setError(
          "Não foi possível preparar as imagens. Confira a conexão com o servidor.",
        );
        void SplashScreen.hideAsync().catch(() => {});
      });
  }, []);
  useEffect(preload, [preload]);
  useEffect(() => {
    if (Platform.OS !== "web" || introComplete) return;
    const timer = setTimeout(() => setIntroComplete(true), 1400);
    return () => clearTimeout(timer);
  }, [introComplete]);
  const introFinished = useCallback(() => setIntroComplete(true), []);
  const painted = useCallback(() => {
    setArtworkVisible(true);
    void SplashScreen.hideAsync().catch(() => {});
  }, []);
  useEffect(() => {
    const accountReady =
      !auth.session ||
      auth.recovery ||
      (!account.loading &&
        (account.account !== null || account.error !== null));
    if (
      introComplete &&
      assetsReady &&
      artworkVisible &&
      !auth.loading &&
      accountReady
    )
      setComplete(true);
  }, [
    introComplete,
    assetsReady,
    artworkVisible,
    auth.loading,
    auth.session,
    auth.recovery,
    account.loading,
    account.account,
    account.error,
  ]);
  return (
    <View style={{ flex: 1 }}>
      {children}
      {!complete && (
        <LoadingScreen
          onFirstCycle={introFinished}
          onArtworkLoad={painted}
          error={error}
          onRetry={preload}
        />
      )}
    </View>
  );
}
