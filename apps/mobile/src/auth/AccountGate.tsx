import { LoadingScreen } from "../brand/LoadingScreen";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useAccount } from "../features/account/AccountProvider";
import { AuthScreen } from "./AuthScreen";
import { PasswordRecovery } from "./PasswordRecovery";
import { Onboarding } from "../features/account/Onboarding";
import { Screen, EmptyState } from "../components/primitives";
import { Action, Notice } from "../components/forms";
export function AccountGate({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const state = useAccount();
  if (auth.loading) return <LoadingScreen />;
  if (!auth.session)
    return (
      <>
        <AuthScreen />
      </>
    );
  if (auth.recovery) return <PasswordRecovery />;
  if (state.error)
    return (
      <Screen>
        <EmptyState
          kind="error"
          icon="cloud-offline-outline"
          title="Não foi possível carregar sua conta"
          description={state.error}
        />
        <Action
          label="Tentar novamente"
          onPress={() => {
            void state.refresh();
          }}
        />
        <Action
          secondary
          label="Sair"
          onPress={() => {
            void auth.signOut().catch(() => {});
          }}
        />
      </Screen>
    );
  if (state.loading || !state.account)
    return (
      <Screen>
        <EmptyState
          kind="loading"
          icon="person-outline"
          title="Carregando sua identidade"
          description="Buscando os perfis autorizados para esta conta."
        />
        <Notice text={auth.error} error />
      </Screen>
    );
  if (!state.account.onboarded) return <Onboarding />;
  return children;
}
