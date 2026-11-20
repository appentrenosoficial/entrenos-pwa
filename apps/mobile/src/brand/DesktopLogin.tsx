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
  type ImageStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { artwork } from "./artwork";
import type { ReferenceLoginProps } from "./ReferenceLoginMobile";

export function DesktopLogin(props: ReferenceLoginProps) {
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

            <View style={styles.message}>
              <Text accessibilityRole="header" style={styles.headline}>
                Conexões reais
                {"\n"}
                <Text style={styles.headlineAccent}>começam aqui.</Text>
              </Text>
              <Text style={styles.description}>
                Um espaço para conhecer pessoas com respeito, privacidade e
                consentimento em cada encontro.
              </Text>
            </View>

            <View style={styles.promiseList}>
              <TrustPoint
                icon="shield-checkmark-outline"
                label="Privacidade desde o primeiro acesso"
              />
              <TrustPoint
                icon="heart-outline"
                label="Conexões conduzidas com consentimento"
              />
              <TrustPoint
                icon="people-outline"
                label="Perfis individuais e de casal"
              />
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
                  <Text style={styles.eyebrowText}>ÁREA DO MEMBRO</Text>
                </View>
                <Text accessibilityRole="header" style={styles.cardTitle}>
                  Boas-vindas de volta
                </Text>
                <Text style={styles.cardDescription}>
                  Entre na sua conta para continuar.
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
                  textContentType="username"
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
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={props.onLogin}
                  editable={!props.busy}
                  trailing={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
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

              <View style={styles.optionsRow}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel="Manter conectado"
                  accessibilityState={{ checked: props.remember }}
                  onPress={props.onRemember}
                  disabled={props.busy}
                  style={styles.rememberButton}
                >
                  <View
                    style={[
                      styles.checkbox,
                      props.remember && styles.checkboxChecked,
                    ]}
                  >
                    {props.remember && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.optionText}>Manter conectado</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="link"
                  onPress={props.onForgot}
                  disabled={props.busy}
                  hitSlop={8}
                >
                  <Text style={styles.forgotText}>Esqueci minha senha</Text>
                </Pressable>
              </View>

              {(props.error || props.notice) && (
                <View
                  accessibilityRole={props.error ? "alert" : "status"}
                  style={[
                    styles.notice,
                    props.error ? styles.errorNotice : styles.successNotice,
                  ]}
                >
                  <Ionicons
                    name={
                      props.error ? "alert-circle-outline" : "checkmark-circle-outline"
                    }
                    size={19}
                    color={props.error ? "#ff8aae" : "#9de5c0"}
                  />
                  <Text style={styles.noticeText}>
                    {props.error || props.notice}
                  </Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: props.disabled, busy: props.busy }}
                disabled={props.disabled || props.busy}
                onPress={props.onLogin}
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
                  {props.busy ? (
                    <Text style={styles.primaryLabel}>Aguarde…</Text>
                  ) : (
                    <Text style={styles.primaryLabel}>Entrar</Text>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>ou continue com</Text>
                <View style={styles.separatorLine} />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: props.disabled || props.busy }}
                disabled={props.disabled || props.busy}
                onPress={props.onGoogle}
                style={({ pressed }) => [
                  styles.googleButton,
                  pressed && styles.googlePressed,
                  (props.disabled || props.busy) && styles.buttonDisabled,
                ]}
              >
                <Ionicons name="logo-google" size={21} color="#4285f4" />
                <Text style={styles.googleLabel}>Continuar com o Google</Text>
              </Pressable>

              <View style={styles.signupRow}>
                <Text style={styles.signupPrompt}>Ainda não tem conta?</Text>
                <Pressable
                  accessibilityRole="link"
                  onPress={props.onSignup}
                  disabled={props.busy}
                  hitSlop={8}
                >
                  <Text style={styles.signupLink}>Cadastre-se</Text>
                </Pressable>
              </View>

              <View style={styles.cardDivider} />
              <View style={styles.safetyNote}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#bf9aff" />
                <Text style={styles.safetyText}>
                  Acesso exclusivo para maiores de 18 anos.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TrustPoint({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.promise}>
      <View style={styles.promiseIcon}>
        <Ionicons name={icon as never} size={20} color="#e25ad5" />
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
  function DesktopField({ icon, label, trailing, ...inputProps }, ref) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.inputShell}>
          <Ionicons name={icon as never} size={20} color="#bda9ce" />
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 48,
  },
  glowTop: {
    position: "absolute",
    top: -280,
    left: -220,
    width: 760,
    height: 760,
    borderRadius: 380,
    backgroundColor: "rgba(180, 0, 220, 0.10)",
    shadowColor: "#d000d5",
    shadowOpacity: 0.55,
    shadowRadius: 120,
  },
  glowBottom: {
    position: "absolute",
    right: -240,
    bottom: -380,
    width: 820,
    height: 820,
    borderRadius: 410,
    backgroundColor: "rgba(218, 0, 120, 0.09)",
    shadowColor: "#f500a6",
    shadowOpacity: 0.5,
    shadowRadius: 130,
  },
  layout: {
    width: "100%",
    alignSelf: "center",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  intro: { flex: 1, maxWidth: 620, paddingVertical: 28 },
  brand: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 36 },
  symbol: { width: 72, height: 64 } as ImageStyle,
  wordmark: { width: 220, height: 54 } as ImageStyle,
  agePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderWidth: 1,
    borderColor: "rgba(225, 74, 219, 0.42)",
    borderRadius: 24,
    backgroundColor: "rgba(28, 15, 39, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 28,
  },
  ageText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 0.8 },
  ageDivider: { width: 1, height: 17, backgroundColor: "#6e587c" },
  ageCaption: { color: "#c8b8d3", fontSize: 11, fontWeight: "700", letterSpacing: 1.7 },
  message: { maxWidth: 590 },
  headline: { color: "#fff", fontSize: 54, lineHeight: 63, fontWeight: "800", letterSpacing: -1.6 },
  headlineAccent: { color: "#ec45bf" },
  description: { color: "#bcaec8", fontSize: 19, lineHeight: 30, marginTop: 20, maxWidth: 510 },
  promiseList: { gap: 14, marginTop: 35 },
  promise: { flexDirection: "row", alignItems: "center", gap: 14 },
  promiseIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(207, 94, 223, 0.26)",
    backgroundColor: "rgba(130, 38, 151, 0.13)",
  },
  promiseLabel: { color: "#d0c5d8", fontSize: 14, letterSpacing: 0.1 },
  brandFooter: { color: "#786983", fontSize: 12, marginTop: 42, letterSpacing: 0.3 },
  formColumn: { width: 480, flexShrink: 0 },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(206, 97, 217, 0.33)",
    borderRadius: 26,
    padding: 36,
    backgroundColor: "rgba(20, 13, 29, 0.94)",
    shadowColor: "#d200c9",
    shadowOpacity: 0.17,
    shadowRadius: 42,
    shadowOffset: { width: 0, height: 18 },
    gap: 23,
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
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#493752",
    borderRadius: 13,
    backgroundColor: "#1a1223",
    paddingHorizontal: 15,
  },
  input: { flex: 1, minWidth: 0, height: "100%", padding: 0, color: "#fff", fontSize: 15, outlineStyle: "none" } as never,
  visibilityButton: { padding: 5, marginRight: -5 },
  optionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: -3 },
  rememberButton: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 32 },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#796584",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { borderColor: "#df20c1", backgroundColor: "#d80fba" },
  optionText: { color: "#c2b5cd", fontSize: 12 },
  forgotText: { color: "#e586d5", fontSize: 12, fontWeight: "600" },
  notice: { flexDirection: "row", gap: 9, alignItems: "flex-start", borderRadius: 12, padding: 12 },
  errorNotice: { backgroundColor: "rgba(130, 34, 74, 0.23)", borderWidth: 1, borderColor: "rgba(255, 102, 158, 0.25)" },
  successNotice: { backgroundColor: "rgba(36, 100, 73, 0.2)", borderWidth: 1, borderColor: "rgba(116, 217, 165, 0.23)" },
  noticeText: { color: "#e5d8ea", fontSize: 12, lineHeight: 18, flex: 1 },
  primaryButton: { borderRadius: 13, overflow: "hidden", marginTop: 1 },
  primaryGradient: { minHeight: 54, alignItems: "center", justifyContent: "center" },
  primaryLabel: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  buttonDisabled: { opacity: 0.48 },
  buttonPressed: { opacity: 0.84 },
  separator: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: -2 },
  separatorLine: { height: 1, flex: 1, backgroundColor: "#372b40" },
  separatorText: { color: "#82758d", fontSize: 11 },
  googleButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
    borderRadius: 13,
    backgroundColor: "#f7f6fa",
    borderWidth: 1,
    borderColor: "#e5e1e9",
  },
  googlePressed: { backgroundColor: "#e8e5ed" },
  googleLabel: { color: "#18141d", fontSize: 13, fontWeight: "700" },
  signupRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 1 },
  signupPrompt: { color: "#b3a7bd", fontSize: 12 },
  signupLink: { color: "#f04ac4", fontSize: 12, fontWeight: "800" },
  cardDivider: { height: 1, backgroundColor: "#312438", marginVertical: -8 },
  safetyNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  safetyText: { color: "#94869e", fontSize: 11 },
});
