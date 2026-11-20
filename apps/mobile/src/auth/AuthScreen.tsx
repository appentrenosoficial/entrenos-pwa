import { ReferenceLogin } from "../brand/ReferenceLogin";
import { useState, useEffect } from "react";
import { Platform, Text, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { DesktopSignup } from "../brand/DesktopSignup";
import { passwordSchema, emailSchema } from "@entrenos/shared";
import {
  supabase,
  backend,
  getRememberSession,
  setRememberSession,
} from "../lib/supabase";
import { Screen, Heading, Card, styles } from "../components/primitives";
import { Action, Field, Notice } from "../components/forms";
import { AUTH_CALLBACK, handleAuthCallback } from "./callback";
import { useAuth } from "./AuthProvider";
import { accountError } from "../features/account/api";
WebBrowser.maybeCompleteAuthSession();
type Mode = "login" | "signup" | "forgot";
export function AuthScreen() {
  const { width } = useWindowDimensions();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  useEffect(() => {
    let live = true;
    getRememberSession()
      .then((value) => {
        if (live) setRemember(value);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  const router = useRouter();
  const { error: sessionError } = useAuth();
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    if (backend.status !== "ready") {
      setGoogleAvailable(false);
      return;
    }
    const controller = new AbortController();
    let live = true;
    const timer = setTimeout(() => controller.abort(), 10000);
    fetch(backend.config.url + "/auth/v1/settings", {
      headers: { apikey: backend.config.publishableKey },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw Error();
        const data = await response.json();
        if (live) setGoogleAvailable(data.external?.google === true);
      })
      .catch(() => {
        if (live) setGoogleAvailable(false);
      })
      .finally(() => clearTimeout(timer));
    return () => {
      live = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, []);
  const run = async (task: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await task();
    } catch (e) {
      setError(accountError(e));
    } finally {
      setBusy(false);
    }
  };
  const submit = () =>
    run(async () => {
      if (!supabase) throw Error("Configure o Supabase antes de entrar.");
      const address = emailSchema.parse(email.trim());
      if (mode === "forgot") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(
          address,
          { redirectTo: AUTH_CALLBACK + "?flow=recovery" },
        );
        if (err) throw err;
        setNotice(
          "Se houver uma conta com esse e-mail, você receberá um link. Abra-o neste mesmo aparelho.",
        );
        return;
      }
      if (mode === "signup") {
        passwordSchema.parse(password);
        const { error: err } = await supabase.auth.signUp({
          email: address,
          password,
          options: { emailRedirectTo: AUTH_CALLBACK },
        });
        if (err) throw err;
        setPassword("");
        setNotice(
          "Enviamos um link de confirmação para seu e-mail. Confira a caixa de entrada e também a pasta Spam. Abra o link neste aparelho; depois entre para concluir o cadastro 18+.",
        );
      } else {
        if (!password) throw Error("Informe sua senha.");
        await setRememberSession(remember);
        const { error: err } = await supabase.auth.signInWithPassword({
          email: address,
          password,
        });
        if (err)
          throw Error(
            err.code === "email_not_confirmed"
              ? "Confirme o e-mail antes de entrar. Confira também a pasta Spam."
              : "Não foi possível entrar. Confira os dados, a confirmação do e-mail e sua conexão.",
          );
        setPassword("");
        router.replace("/");
      }
    });
  const google = () =>
    run(async () => {
      if (!supabase) throw Error("Configure o Supabase.");
      if (googleAvailable !== true)
        throw Error(
          "O acesso com Google ainda não está disponível. Use seu e-mail.",
        );
      await setRememberSession(remember);
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: AUTH_CALLBACK, skipBrowserRedirect: true },
      });
      if (err || !data.url)
        throw Error(
          "Google indisponível. Configure o provedor no Supabase ou entre por e-mail.",
        );
      const response = await WebBrowser.openAuthSessionAsync(
        data.url,
        AUTH_CALLBACK,
      );
      if (response.type === "success") {
        await handleAuthCallback(response.url);
        router.replace("/");
      }
    });
  const change = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
    setPassword("");
  };
  const resend = () =>
    run(async () => {
      if (!supabase) throw Error("Autenticação indisponível neste ambiente.");
      const address = emailSchema.parse(email.trim());
      const { error: err } = await supabase.auth.resend({
        type: "signup",
        email: address,
        options: { emailRedirectTo: AUTH_CALLBACK },
      });
      if (err) throw err;
      setNotice(
        "Se o cadastro estiver aguardando confirmação, enviaremos outro e-mail. Confira a caixa de entrada e a pasta Spam.",
      );
    });
  if (mode === "login")
    return (
      <ReferenceLogin
        email={email}
        password={password}
        remember={remember}
        busy={busy}
        disabled={!supabase}
        error={error || sessionError}
        notice={notice}
        onEmail={setEmail}
        onPassword={setPassword}
        onRemember={() => setRemember((v) => !v)}
        onLogin={submit}
        onGoogle={google}
        onForgot={() => change("forgot")}
        onSignup={() => change("signup")}
        onResend={resend}
      />
    );
  if (mode === "signup" && Platform.OS === "web" && width >= 960)
    return (
      <DesktopSignup
        email={email}
        password={password}
        busy={busy}
        disabled={!supabase}
        error={error}
        notice={notice}
        onEmail={setEmail}
        onPassword={setPassword}
        onSubmit={submit}
        onResend={resend}
        onLogin={() => change("login")}
      />
    );
  return (
    <Screen>
      <Heading
        eyebrow="EntreNós · 18+"
        title={mode === "signup" ? "Crie sua conta" : "Recupere o acesso"}
        description="Respeito, privacidade e consentimento em cada encontro."
      />
      <Card>
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!busy}
        />
        {mode === "signup" && (
          <Field
            label="Senha · mínimo 12 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            editable={!busy}
          />
        )}
        <Notice text={error} error />
        <Notice text={notice} />
        <Action
          label={
            mode === "signup" ? "Criar conta" : "Enviar link de recuperação"
          }
          onPress={submit}
          busy={busy}
          disabled={!supabase}
        />
        {mode === "signup" && (
          <Action
            secondary
            label="Cadastrar com Google"
            onPress={google}
            busy={busy}
            disabled={!supabase}
          />
        )}
        <Action
          secondary
          label="Voltar para entrar"
          onPress={() => change("login")}
          disabled={busy}
        />
        {mode === "signup" && (
          <Action
            secondary
            label="Reenviar confirmação de e-mail"
            onPress={resend}
            disabled={busy || !supabase}
          />
        )}
      </Card>
      <Text style={styles.caption}>
        Apenas maiores de 18 anos. Nome civil e nascimento serão privados. A
        confirmação de maioridade não equivale a verificação robusta de idade.
      </Text>
    </Screen>
  );
}
