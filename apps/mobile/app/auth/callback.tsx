import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, Heading } from "../../src/components/primitives";
import { Action, Notice } from "../../src/components/forms";
import { handleAuthCallback, AUTH_CALLBACK } from "../../src/auth/callback";
import { useAuth } from "../../src/auth/AuthProvider";
import { accountError } from "../../src/features/account/api";
export default function Callback() {
  const params = useLocalSearchParams<{
    code?: string;
    flow?: string;
    error_description?: string;
  }>();
  const [error, setError] = useState<string | null>(null);
  const { setRecovery } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!params.code) {
      setError("Link inválido ou expirado. Solicite outro no mesmo aparelho.");
      return;
    }
    const url =
      AUTH_CALLBACK +
      "?code=" +
      encodeURIComponent(params.code) +
      (params.flow === "recovery" ? "&flow=recovery" : "");
    handleAuthCallback(url)
      .then((recovery) => {
        if (recovery) setRecovery(true);
        router.replace("/");
      })
      .catch((e) => setError(accountError(e)));
  }, [params.code, params.flow, router, setRecovery]);
  return (
    <Screen>
      <Heading
        eyebrow="Acesso seguro"
        title={error ? "Não foi possível continuar" : "Validando seu link…"}
      />
      <Notice text={error} error />
      {error && (
        <Action label="Voltar ao início" onPress={() => router.replace("/")} />
      )}
    </Screen>
  );
}
