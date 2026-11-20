import { useState } from "react";
import { Text } from "react-native";
import {
  isAdult,
  parseBrazilianDate,
  profileInputSchema,
  usernameSchema,
} from "@entrenos/shared";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../auth/AuthProvider";
import { Screen, Heading, Card, styles } from "../../components/primitives";
import { Action, Field, Check, Notice } from "../../components/forms";
import { ProfileFields, initialProfile } from "./ProfileFields";
import { useAccount } from "./AccountProvider";
import { accountError } from "./api";
export function Onboarding() {
  const { signOut } = useAuth();
  const { refresh } = useAccount();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [adult, setAdult] = useState(false);
  const [username, setUsername] = useState("");
  const [value, setValue] = useState(initialProfile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const iso = parseBrazilianDate(birth);
      const today = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Sao_Paulo",
      }).format(new Date());
      if (!iso || !isAdult(iso, today) || !adult)
        throw Error(
          "Informe uma data válida e confirme que você tem 18 anos ou mais.",
        );
      if (name.trim().length < 2 || name.trim().length > 120)
        throw Error("Informe seu nome civil.");
      const data = profileInputSchema.parse({
        ...value,
        interests: value.interests.filter(Boolean),
      });
      const handle = usernameSchema.parse(username);
      const { error: err } = await supabase!.rpc("complete_onboarding", {
        p_legal_name: name.trim(),
        p_birth_date: iso,
        p_adult_confirmed: adult,
        p_nickname: data.nickname,
        p_username: handle,
        p_city: data.city,
        p_state: data.state,
        p_interests: data.interests,
        p_preferences: data.preferences,
        p_bio: data.bio,
      });
      if (err) throw err;
      setName("");
      setBirth("");
      await refresh();
    } catch (e) {
      setError(accountError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <Heading
        eyebrow="Boas-vindas · 18+"
        title="Seu primeiro perfil"
        description="Nome civil e nascimento são privados. Seu apelido e username serão públicos."
      />
      <Card>
        <Field
          label="Nome civil · privado"
          value={name}
          onChangeText={setName}
          maxLength={120}
          autoComplete="name"
        />
        <Field
          label="Nascimento · DD/MM/AAAA · privado"
          value={birth}
          onChangeText={setBirth}
          keyboardType="numbers-and-punctuation"
          placeholder="DD/MM/AAAA"
          maxLength={10}
        />
        <Check
          label="Confirmo que tenho 18 anos ou mais"
          value={adult}
          onChange={() => setAdult((v) => !v)}
        />
        <Text style={styles.caption}>
          A autodeclaração não equivale à verificação robusta de idade. A
          maioridade também é validada pelo servidor.
        </Text>
        <Field
          label="@username · único"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={30}
        />
        <ProfileFields value={value} onChange={setValue} />
        <Notice text={error} error />
        <Action label="Concluir cadastro" onPress={save} busy={busy} />
        <Action
          secondary
          label="Sair desta conta"
          disabled={busy}
          onPress={() => {
            void signOut().catch((e) => setError(accountError(e)));
          }}
        />
      </Card>
    </Screen>
  );
}
