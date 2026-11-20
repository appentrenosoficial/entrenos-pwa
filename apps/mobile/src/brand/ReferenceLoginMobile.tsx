import { useEffect, useRef, useState, type ComponentRef } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { artwork } from "./artwork";
import { ReferenceScene, type ReferenceLayout } from "./ReferenceScene";
export type ReferenceLoginProps = {
  email: string;
  password: string;
  remember: boolean;
  busy: boolean;
  disabled: boolean;
  error: string | null;
  notice: string | null;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onRemember: () => void;
  onLogin: () => void;
  onGoogle: () => void;
  onForgot: () => void;
  onSignup: () => void;
  onResend: () => void;
};
export function ReferenceLogin(props: ReferenceLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusY, setFocusY] = useState<number | null>(null);
  const [messageVisible, setMessageVisible] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  useEffect(() => {
    if (!props.busy && (props.error || props.notice)) setMessageVisible(true);
  }, [props.error, props.notice, props.busy]);
  const content = (layout: ReferenceLayout) => {
    const { box, scale } = layout;
    const target = (
      key: string,
      label: string,
      rect: [number, number, number, number],
      onPress: () => void,
      disabled = props.busy,
      role: "button" | "link" = "button",
    ) => (
      <Pressable
        key={key}
        accessibilityRole={role}
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        hitSlop={4}
        style={({ pressed }) => [
          box(...rect),
          {
            borderRadius: 28 * scale,
            backgroundColor: pressed ? "rgba(255,255,255,.12)" : "transparent",
          },
        ]}
      />
    );
    const field = (
      kind: "email" | "password",
      value: string,
      onChangeText: (v: string) => void,
      rect: [number, number, number, number],
      extra: TextInputProps,
    ) => (
      <View style={box(...rect)}>
        {/* A arte fornece o placeholder exato. Quando digitado, o fundo interno
       cobre apenas o placeholder; bordas, ícones e restante da referência ficam intactos. */}
        {value.length > 0 && (
          <LinearGradient
            pointerEvents="none"
            colors={
              kind === "email" ? ["#2b1e38", "#1c1229"] : ["#291b36", "#1b1127"]
            }
            style={StyleSheet.absoluteFill}
          />
        )}
        <TextInput
          {...extra}
          ref={kind === "password" ? passwordRef : undefined}
          value={value}
          onChangeText={onChangeText}
          editable={!props.busy}
          accessibilityLabel={kind === "email" ? "E-mail" : "Senha"}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          selectionColor="#ff00a8"
          placeholder=""
          onFocus={() => setFocusY(rect[1])}
          onBlur={() => setFocusY(null)}
          style={{
            flex: 1,
            color: "#faf8ff",
            fontSize: 33 * scale,
            padding: 0,
            includeFontPadding: false,
            textAlignVertical: "center",
          }}
        />
      </View>
    );
    return (
      <>
        <Image
          source={artwork.symbol}
          accessible={false}
          resizeMode="contain"
          style={box(338, 145, 265, 171)}
        />
        <Image
          source={artwork.wordmark}
          accessible={false}
          resizeMode="contain"
          style={box(195, 332, 550, 101)}
        />
        <View
          pointerEvents="none"
          accessible
          accessibilityRole="header"
          accessibilityLabel="EntreNós. Rede social para adultos, 18 anos ou mais. Conexões reais e discretas. Respeito, privacidade e consentimento em cada encontro."
          style={box(45, 110, 850, 625)}
        />
        {field("email", props.email, props.onEmail, [210, 827, 528, 70], {
          keyboardType: "email-address",
          autoComplete: "email",
          textContentType: "username",
          returnKeyType: "next",
          onSubmitEditing: () => passwordRef.current?.focus(),
        })}
        {field(
          "password",
          props.password,
          props.onPassword,
          [210, 948, 520, 70],
          {
            secureTextEntry: !showPassword,
            autoComplete: "current-password",
            textContentType: "password",
            returnKeyType: "go",
            onSubmitEditing: props.onLogin,
          },
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
          accessibilityState={{ disabled: props.busy }}
          disabled={props.busy}
          onPress={() => setShowPassword((v) => !v)}
          hitSlop={5}
          style={box(755, 944, 75, 75)}
        >
          {showPassword && (
            <View
              style={{
                flex: 1,
                backgroundColor: "#1c1229",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="eye-outline" size={45 * scale} color="#fff" />
            </View>
          )}
        </Pressable>
        {!props.remember && (
          <View
            pointerEvents="none"
            style={[
              box(94, 1054, 44, 44),
              {
                backgroundColor: "#160c21",
                borderRadius: 8 * scale,
                borderWidth: 2 * scale,
                borderColor: "#bc40de",
              },
            ]}
          />
        )}
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Manter conectado"
          accessibilityState={{ checked: props.remember, disabled: props.busy }}
          disabled={props.busy}
          onPress={props.onRemember}
          style={box(91, 1040, 405, 76)}
        />
        {target(
          "forgot",
          "Esqueci minha senha",
          [572, 1040, 285, 76],
          props.onForgot,
          props.busy,
          "link",
        )}
        {target(
          "login",
          "Entrar",
          [90, 1136, 761, 100],
          props.onLogin,
          props.busy || props.disabled,
        )}
        {props.busy && (
          <ActivityIndicator
            pointerEvents="none"
            color="#fff"
            size="small"
            style={box(342, 1166, 37, 40)}
          />
        )}
        {target(
          "google",
          "Continuar com Google",
          [90, 1329, 761, 98],
          props.onGoogle,
          props.busy || props.disabled,
        )}
        {target(
          "signup",
          "Cadastre-se",
          [553, 1450, 251, 64],
          props.onSignup,
          props.busy,
          "link",
        )}
        <Modal
          transparent
          visible={messageVisible && Boolean(props.error || props.notice)}
          animationType="fade"
          onRequestClose={() => setMessageVisible(false)}
        >
          <View style={loginStyles.modal}>
            <View style={loginStyles.message}>
              <Text
                accessibilityRole={props.error ? "alert" : "header"}
                style={loginStyles.messageText}
              >
                {props.error || props.notice}
              </Text>
              {props.error?.includes("Confirme o e-mail") && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setMessageVisible(false);
                    props.onResend();
                  }}
                  style={loginStyles.modalButton}
                >
                  <Text style={loginStyles.buttonText}>
                    Reenviar confirmação
                  </Text>
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => setMessageVisible(false)}
                style={loginStyles.modalButton}
              >
                <Text style={loginStyles.buttonText}>Entendi</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </>
    );
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ReferenceScene source={artwork.login} focusY={focusY}>
        {content}
      </ReferenceScene>
    </KeyboardAvoidingView>
  );
}
const loginStyles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  message: {
    width: "100%",
    maxWidth: 430,
    borderWidth: 1,
    borderColor: "#bd32d6",
    borderRadius: 22,
    padding: 24,
    gap: 18,
    backgroundColor: "#170b24",
  },
  messageText: { color: "#fff", fontSize: 16, lineHeight: 25 },
  modalButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#a900a5",
    padding: 14,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
