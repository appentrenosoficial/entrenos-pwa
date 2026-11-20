import { useState } from "react";
import { passwordSchema } from "@entrenos/shared";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";
import { Screen, Heading, Card } from "../components/primitives";
import { Field, Action, Notice } from "../components/forms";
import { accountError } from "../features/account/api";
export function PasswordRecovery() {
  const { setRecovery, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      passwordSchema.parse(password);
      if (password !== again) throw Error("As senhas precisam ser iguais.");
      const { error: err } = await supabase!.auth.updateUser({ password });
      if (err) throw err;
      setPassword("");
      setAgain("");
      setRecovery(false);
    } catch (e) {
      setError(accountError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <Heading eyebrow="Recuperação de acesso" title="Defina sua nova senha" />
      <Card>
        <Field
          label="Nova senha · mínimo 12 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Field
          label="Repita a nova senha"
          value={again}
          onChangeText={setAgain}
          secureTextEntry
          autoCapitalize="none"
        />
        <Notice text={error} error />
        <Action label="Salvar senha" onPress={save} busy={busy} />
        <Action
          secondary
          label="Cancelar e sair"
          disabled={busy}
          onPress={() => {
            void signOut().catch((e) => setError(accountError(e)));
          }}
        />
      </Card>
    </Screen>
  );
}
