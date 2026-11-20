import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@entrenos/ui";
import { LinearGradient } from "expo-linear-gradient";

type IconName = ComponentProps<typeof Ionicons>["name"];
export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <View style={styles.heading}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {description && <Text style={styles.body}>{description}</Text>}
    </View>
  );
}
export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
export function EmptyState({
  icon,
  title,
  description,
  kind = "empty",
}: {
  icon: IconName;
  title: string;
  description: string;
  kind?: "empty" | "loading" | "error" | "permission";
}) {
  return (
    <Card>
      <View accessibilityElementsHidden style={styles.iconCircle}>
        {kind === "loading" ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Ionicons name={icon} color={theme.colors.primary} size={26} />
        )}
      </View>
      <Text accessibilityRole="header" style={styles.cardTitle}>
        {title}
      </Text>
      <Text
        accessibilityRole={kind === "error" ? "alert" : undefined}
        style={styles.body}
      >
        {description}
      </Text>
    </Card>
  );
}
export function PendingAction({
  label,
  reason,
}: {
  label: string;
  reason: string;
}) {
  return (
    <View style={styles.actionGroup}>
      <Pressable
        disabled
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        accessibilityHint={reason}
      >
        <LinearGradient colors={["#573C7C", "#69334F"]} style={styles.button}>
          <Text style={styles.buttonLabel}>{label}</Text>
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color={theme.colors.muted}
          />
        </LinearGradient>
      </Pressable>
      <Text style={styles.caption}>{reason}</Text>
    </View>
  );
}
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 24,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  heading: { gap: 10 },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
  },
  body: { color: theme.colors.muted, fontSize: 15, lineHeight: 24 },
  caption: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "600" },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: theme.colors.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  actionGroup: { gap: 10 },
  button: {
    padding: 18,
    minHeight: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonLabel: { color: theme.colors.muted, fontSize: 15, fontWeight: "600" },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
