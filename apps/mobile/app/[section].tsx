import { AccountGate } from "../src/auth/AccountGate";
import { IdentityScreen } from "../src/features/account/IdentityScreen";
import { useLocalSearchParams } from "expo-router";
import { EmptyState, Heading, Screen } from "../src/components/primitives";
const sections: Record<string, { title: string; description: string }> = {
  notificacoes: {
    title: "Notificações",
    description:
      "Notificações internas e push ainda não estão implementadas. Nenhuma permissão será solicitada nesta etapa.",
  },
  grupos: {
    title: "Grupos",
    description:
      "As comunidades serão implementadas na etapa social, com visibilidade pública, privada ou secreta.",
  },
  eventos: {
    title: "Eventos",
    description:
      "Os eventos serão implementados na etapa social. Endereços exatos ficarão restritos aos participantes aprovados.",
  },
  identidade: {
    title: "Perfil ativo",
    description:
      "Nenhum perfil autenticado. A alternância entre individual e casal será habilitada após contas e consentimento de vínculo.",
  },
};
export default function SectionScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const content = sections[section];
  if (section === "identidade")
    return (
      <AccountGate>
        <IdentityScreen />
      </AccountGate>
    );
  return (
    <AccountGate>
      <Screen>
        <Heading
          eyebrow="EntreNós"
          title={content?.title ?? "Página não encontrada"}
        />
        <EmptyState
          icon="lock-closed-outline"
          kind="permission"
          title={
            content ? "Disponível em uma próxima etapa" : "Caminho indisponível"
          }
          description={
            content?.description ??
            "Use o botão voltar para retornar à navegação."
          }
        />
      </Screen>
    </AccountGate>
  );
}
