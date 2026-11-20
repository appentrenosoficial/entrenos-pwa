import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { APP_TAGLINE } from "@entrenos/shared";
import { theme } from "@entrenos/ui";
import {
  Card,
  EmptyState,
  Screen,
  styles,
} from "../../src/components/primitives";
import { backend } from "../../src/lib/supabase";
export default function HomeScreen() {
  return (
    <Screen>
      <View style={[styles.row, local.brandRow]}>
        <View style={styles.row}>
          <Text style={local.mark} accessibilityLabel="Símbolo infinito">
            ∞
          </Text>
          <Text style={local.brand}>EntreNós</Text>
        </View>
        <Link
          href={{ pathname: "/[section]", params: { section: "notificacoes" } }}
          accessibilityLabel="Notificações"
          style={local.bell}
        >
          <Ionicons
            name="notifications-outline"
            size={23}
            color={theme.colors.text}
          />
        </Link>
      </View>
      <LinearGradient
        colors={["#322046", "#251426", "#191321"]}
        style={local.hero}
      >
        <Text style={styles.eyebrow}>O começo de algo real</Text>
        <Text accessibilityRole="header" style={local.heroTitle}>
          {APP_TAGLINE}
        </Text>
        <Text style={styles.body}>
          Um espaço para encontrar afinidades e viver conexões no seu ritmo.
        </Text>
        <View style={styles.row}>
          <View style={styles.chip}>
            <Text style={styles.caption}>18 anos ou mais</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.caption}>Respeito e consentimento</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.row}>
        {[
          ["grupos", "Grupos"],
          ["eventos", "Eventos"],
          ["identidade", "Perfil ativo"],
        ].map(([section, label]) => (
          <Link
            key={section}
            href={{ pathname: "/[section]", params: { section } }}
            style={local.shortcut}
          >
            {label} ↗
          </Link>
        ))}
      </View>
      <EmptyState
        icon="sparkles-outline"
        title="Seu espaço começa aqui"
        description="Seu perfil está pronto. O feed será conectado na etapa social; ainda não há publicações nesta versão."
      />
      <Card>
        <Text style={styles.eyebrow}>Contas e perfis · Etapa 2</Text>
        <Text style={styles.body}>
          Conta autenticada. Feed, descoberta, publicações e mensagens serão
          conectados nas próximas etapas.
        </Text>
        <Text
          accessibilityRole={backend.status === "invalid" ? "alert" : undefined}
          style={styles.caption}
        >
          {backend.status === "ready"
            ? "Configuração do backend válida. Conectividade ainda não verificada."
            : backend.status === "invalid"
              ? "Configuração do Supabase inválida. Revise as variáveis de ambiente."
              : "Supabase não configurado. Nenhum dado pessoal é enviado."}
        </Text>
      </Card>
    </Screen>
  );
}
const local = StyleSheet.create({
  brandRow: { justifyContent: "space-between" },
  brand: {
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -1,
  },
  mark: { color: theme.colors.accent, fontSize: 44, lineHeight: 48 },
  bell: { padding: 12, minHeight: 48, minWidth: 48 },
  hero: {
    borderRadius: 28,
    padding: 26,
    gap: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
    letterSpacing: -1.2,
  },
  shortcut: {
    color: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    padding: 15,
    minHeight: 48,
    borderRadius: 14,
    overflow: "hidden",
    fontSize: 14,
  },
});
