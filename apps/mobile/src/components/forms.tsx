import {
  Pressable,
  Text,
  TextInput,
  StyleSheet,
  View,
  type TextInputProps,
  ActivityIndicator,
} from "react-native";
import { theme } from "@entrenos/ui";
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.muted}
        style={[
          formStyles.input,
          props.multiline && { minHeight: 100, textAlignVertical: "top" },
          props.style,
        ]}
      />
    </View>
  );
}
export function Action({
  label,
  onPress,
  disabled = false,
  busy = false,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy, busy }}
      style={({ pressed }) => [
        formStyles.action,
        {
          backgroundColor: secondary
            ? theme.colors.elevated
            : theme.colors.primary,
          opacity: disabled || busy ? 0.5 : pressed ? 0.75 : 1,
        },
      ]}
    >
      {busy && (
        <ActivityIndicator
          color={secondary ? theme.colors.text : theme.colors.background}
        />
      )}
      <Text
        style={{
          color: secondary ? theme.colors.text : theme.colors.background,
          fontWeight: "700",
          fontSize: 15,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function Check({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      style={formStyles.check}
    >
      <Text style={{ color: theme.colors.primary, fontSize: 22 }}>
        {value ? "☑" : "☐"}
      </Text>
      <Text style={[formStyles.label, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}
export function Notice({
  text,
  error = false,
}: {
  text: string | null;
  error?: boolean;
}) {
  return text ? (
    <Text
      accessibilityRole={error ? "alert" : undefined}
      style={{
        color: error ? theme.colors.accent : theme.colors.muted,
        fontSize: 14,
        lineHeight: 22,
      }}
    >
      {text}
    </Text>
  ) : null;
}
export const formStyles = StyleSheet.create({
  label: { color: theme.colors.text, fontSize: 14, lineHeight: 22 },
  input: {
    color: theme.colors.text,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  action: {
    borderRadius: 14,
    minHeight: 52,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  check: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 },
});
