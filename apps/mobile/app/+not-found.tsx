import { Link } from "expo-router";
import { Heading, Screen } from "../src/components/primitives";
import { theme } from "@entrenos/ui";
export default function NotFound() {
  return (
    <Screen>
      <Heading eyebrow="EntreNós" title="Página não encontrada" />
      <Link style={{ color: theme.colors.primary }} href="/">
        Voltar ao início
      </Link>
    </Screen>
  );
}
