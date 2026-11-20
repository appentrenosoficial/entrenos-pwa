import {
  forwardRef,
  useRef,
  useState,
  type ComponentProps,
  type ComponentRef,
  type ReactNode,
} from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { artwork } from "./artwork";

type Props = {
  email: string;
  password: string;
  busy: boolean;
  disabled: boolean;
  error: string | null;
  notice: string | null;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onLogin: () => void;
};

export function DesktopSignup(props: Props) {
  const { height, width } = useWindowDimensions();
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [showPassword, setShowPassword] = useState(false);
  const compact = width < 1120;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#080511", "#13091f", "#0b0712"]}
        locations={[0, 0.52, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.layout,
            {
              maxWidth: compact ? 1080 : 1240,
              paddingHorizontal: compact ? 36 : 64,
              gap: compact ? 48 : 92,
            },
          ]}
        >
          <View style={styles.intro}>
            <View style={styles.brand}>
              <Image
                source={artwork.symbol}
                accessibilityLabel="Símbolo EntreNós"
                resizeMode="contain"
                style={styles.symbol}
              />
              <Image
                source={artwork.wordmark}
                accessibilityLabel="EntreNós"
                resizeMode="contain"
                style={styles.wordmark}
              />
            </View>
            <View style={styles.agePill}>
              <Text style={styles.ageText}>18+</Text>
              <View style={styles.ageDivider} />
              <Text style={styles.ageCaption}>REDE SOCIAL PARA ADULTOS</Text>
            </View>
            <Text accessibilityRole="header" style={styles.headline}>
              Um novo jeito de
              {"\n"}
              <Text style={styles.headlineAccent}>se conectar.</Text>
            </Text>
            <Text style={styles.description}>
              Crie sua conta para conhecer pessoas em um espaço baseado em
              respeito, privacidade e consentimento.
            </Text>
            <View style={styles.promiseList}>
              <TrustPoint icon="shield-checkmark-outline" label="Sua privacidade importa" />
              <TrustPoint icon="heart-outline" label="Respeito em cada conexão" />
              <TrustPoint icon="people-outline" label="Um ambiente exclusivo para adultos" />
            </View>
            <Text style={styles.brandFooter}>
              EntreNós · conexões reais, com respeito e consentimento.
            </Text>
          </View>

          <View style={styles.formColumn}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardEyebrow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.eyebrowText}>COMECE POR AQUI</Text>
                </View>
                <Text accessibilityRole="header" style={styles.cardTitle}>
                  Crie sua conta
                </Text>
                <Text style={styles.cardDescription}>
                  Leva só alguns instantes para começar.
                </Text>
              </View>

              <View style={styles.fields}>
                <Field
                  icon="mail-outline"
                  label="E-mail"
                  value={props.email}
                  onChangeText={props.onEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  editable={!props.busy}
                />
                <Field
                  ref={passwordRef}
                  icon="lock-closed-outline"
                  label="Senha"
                  value={props.password}
                  onChangeText={props.onPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="go"
                  onSubmitEditing={props.onSubmit}
                  editable={!props.busy}
                  trailing={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onPress={() => setShowPassword((visible) => !visible)}
                      style={styles.visibilityButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#c7b8d4"
                      />
                    </Pressable>
                  }
                />
              </View>
              <Text style={styles.passwordHint}>Use uma senha com pelo menos 12 caracteres.</Text>

              {(props.error || props.notice) && (
                <View
                  accessibilityRole={props.error ? "alert" : "status"}
                  style={[styles.notice, props.error ? styles.errorNotice : styles.successNotice]}
                >
                  <Ionicons
                    name={props.error ? "alert-circle-outline" : "checkmark-circle-outline"}
                    size={19}
                    color={props.error ? "#ff8aae" : "#9de5c0"}
                  />
                  <Text style={styles.noticeText}>{props.error || props.notice}</Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: props.disabled || props.busy, busy: props.busy }}
                disabled={props.disabled || props.busy}
                onPress={props.onSubmit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (props.disabled || props.busy) && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
              >
                <LinearGradient
                  colors={["#d500d7", "#fb1686"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.primaryGradient}
                >
                  <Text style={styles.primaryLabel}>
                    {props.busy ? "Aguarde…" : "Criar conta"}
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={props.onResend}
                disabled={props.busy || props.disabled}
                style={styles.resendButton}
              >
                <Text style={styles.resendText}>Reenviar confirmação de e-mail</Text>
              </Pressable>

              <View style={styles.cardDivider} />
              <View style={styles.loginRow}>
                <Text style={styles.signupPrompt}>Já tem uma conta?</Text>
                <Pressable
                  accessibilityRole="link"
                  onPress={props.onLogin}
                  disabled={props.busy}
                  hitSlop={8}
                >
                  <Text style={styles.signupLink}>Entrar</Text>
                </Pressable>
              </View>
              <View style={styles.safetyNote}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#bf9aff" />
                <Text style={styles.safetyText}>
                  Exclusivo para maiores de 18 anos.
                </Text>
              </View>
            </View>
            <Text style={styles.privacyNote}>
              Nome civil e data de nascimento são solicitados depois da confirmação do e-mail.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TrustPoint({ icon, label }: { icon: ComponentProps<typeof Ionicons>["name"]; label: string }) {
  return (
    <View style={styles.promise}>
      <View style={styles.promiseIcon}>
        <Ionicons name={icon} size={20} color="#e25ad5" />
      </View>
      <Text style={styles.promiseLabel}>{label}</Text>
    </View>
  );
}

type FieldProps = ComponentProps<typeof TextInput> & {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  trailing?: ReactNode;
};

const Field = forwardRef<ComponentRef<typeof TextInput>, FieldProps>(
  function SignupField({ icon, label, trailing, ...inputProps }, ref) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.inputShell}>
          <Ionicons name={icon} size={20} color="#bda9ce" />
          <TextInput
            {...inputProps}
            ref={ref}
            accessibilityLabel={label}
            placeholder={label}
            placeholderTextColor="#92849e"
            selectionColor="#ec33c2"
            style={styles.input}
          />
          {trailing}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#090511" },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 48 },
  glowTop: {
    position: "absolute", top: -280, left: -220, width: 760, height: 760,
    borderRadius: 380, backgroundColor: "rgba(180, 0, 220, 0.10)",
    shadowColor: "#d000d5", shadowOpacity: 0.55, shadowRadius: 120,
  },
  glowBottom: {
    position: "absolute", right: -240, bottom: -380, width: 820, height: 820,
    borderRadius: 410, backgroundColor: "rgba(218, 0, 120, 0.09)",
    shadowColor: "#f500a6", shadowOpacity: 0.5, shadowRadius: 130,
  },
  layout: {
    width: "100%", alignSelf: "center", flexGrow: 1, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
  },
  intro: { flex: 1, maxWidth: 620, paddingVertical: 28 },
  brand: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 36 },
  symbol: { width: 72, height: 64 },
  wordmark: { width: 220, height: 54 },
  agePill: {
    alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 13,
    borderWidth: 1, borderColor: "rgba(225, 74, 219, 0.42)", borderRadius: 24,
    backgroundColor: "rgba(28, 15, 39, 0.8)", paddingHorizontal: 14,
    paddingVertical: 9, marginBottom: 28,
  },
  ageText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 0.8 },
  ageDivider: { width: 1, height: 17, backgroundColor: "#6e587c" },
  ageCaption: { color: "#c8b8d3", fontSize: 11, fontWeight: "700", letterSpacing: 1.7 },
  headline: { color: "#fff", fontSize: 54, lineHeight: 63, fontWeight: "800", letterSpacing: -1.6 },
  headlineAccent: { color: "#ec45bf" },
  description: { color: "#bcaec8", fontSize: 19, lineHeight: 30, marginTop: 20, maxWidth: 510 },
  promiseList: { gap: 14, marginTop: 35 },
  promise: { flexDirection: "row", alignItems: "center", gap: 14 },
  promiseIcon: {
    width: 38, height: 38, alignItems: "center", justifyContent: "center",
    borderRadius: 13, borderWidth: 1, borderColor: "rgba(207, 94, 223, 0.26)",
    backgroundColor: "rgba(130, 38, 151, 0.13)",
  },
  promiseLabel: { color: "#d0c5d8", fontSize: 14, letterSpacing: 0.1 },
  brandFooter: { color: "#786983", fontSize: 12, marginTop: 42, letterSpacing: 0.3 },
  formColumn: { width: 480, flexShrink: 0 },
  card: {
    width: "100%", borderWidth: 1, borderColor: "rgba(206, 97, 217, 0.33)",
    borderRadius: 26, padding: 36, backgroundColor: "rgba(20, 13, 29, 0.94)",
    shadowColor: "#d200c9", shadowOpacity: 0.17, shadowRadius: 42,
    shadowOffset: { width: 0, height: 18 }, gap: 22,
  },
  cardHeader: { gap: 9 },
  cardEyebrow: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#ec45bf" },
  eyebrowText: { color: "#d884e8", fontSize: 10, fontWeight: "800", letterSpacing: 2.1 },
  cardTitle: { color: "#fff", fontSize: 28, fontWeight: "700", letterSpacing: -0.6 },
  cardDescription: { color: "#a99bb4", fontSize: 14, lineHeight: 21 },
  fields: { gap: 17 },
  fieldGroup: { gap: 8 },
  fieldLabel: { color: "#e4ddeb", fontSize: 13, fontWeight: "600" },
  inputShell: {
    height: 54, flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 1, borderColor: "#493752", borderRadius: 13,
    backgroundColor: "#1a1223", paddingHorizontal: 15,
  },
  input: { flex: 1, minWidth: 0, height: "100%", padding: 0, color: "#fff", fontSize: 15 },
  visibilityButton: { padding: 5, marginRight: -5 },
  passwordHint: { color: "#94869e", fontSize: 11, marginTop: -14 },
  notice: { flexDirection: "row", gap: 9, alignItems: "flex-start", borderRadius: 12, padding: 12 },
  errorNotice: { backgroundColor: "rgba(130, 34, 74, 0.23)", borderWidth: 1, borderColor: "rgba(255, 102, 158, 0.25)" },
  successNotice: { backgroundColor: "rgba(36, 100, 73, 0.2)", borderWidth: 1, borderColor: "rgba(116, 217, 165, 0.23)" },
  noticeText: { color: "#e5d8ea", fontSize: 12, lineHeight: 18, flex: 1 },
  primaryButton: { borderRadius: 13, overflow: "hidden", marginTop: 1 },
  primaryGradient: { minHeight: 54, alignItems: "center", justifyContent: "center" },
  primaryLabel: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  buttonDisabled: { opacity: 0.48 },
  buttonPressed: { opacity: 0.84 },
  resendButton: { alignSelf: "center", paddingVertical: 3 },
  resendText: { color: "#e586d5", fontSize: 12, fontWeight: "600" },
  cardDivider: { height: 1, backgroundColor: "#312438", marginVertical: -4 },
  loginRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  signupPrompt: { color: "#b3a7bd", fontSize: 12 },
  signupLink: { color: "#f04ac4", fontSize: 12, fontWeight: "800" },
  safetyNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  safetyText: { color: "#94869e", fontSize: 11 },
  privacyNote: { color: "#786983", fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 14, paddingHorizontal: 14 },
});
