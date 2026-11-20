import { View, Text } from "react-native";
import {
  preferenceOptions,
  visibilityOptions,
  states,
  type ProfileInput,
} from "@entrenos/shared";
import { Action, Check, Field } from "../../components/forms";
import { styles } from "../../components/primitives";
type Props = {
  value: ProfileInput;
  onChange: (value: ProfileInput) => void;
  privacy?: boolean;
};
export const initialProfile: ProfileInput = {
  nickname: "",
  bio: "",
  city: "",
  state: "SP",
  interests: [],
  preferences: [],
  audience: "registered",
};
export function ProfileFields({ value, onChange, privacy = false }: Props) {
  const set = <K extends keyof ProfileInput>(key: K, next: ProfileInput[K]) =>
    onChange({ ...value, [key]: next });
  return (
    <>
      <Field
        label="Apelido público"
        value={value.nickname}
        onChangeText={(v) => set("nickname", v)}
        maxLength={60}
      />
      <Field
        label="Biografia"
        value={value.bio}
        onChangeText={(v) => set("bio", v)}
        maxLength={500}
        multiline
      />
      <Field
        label="Cidade · localização aproximada"
        value={value.city}
        onChangeText={(v) => set("city", v)}
        maxLength={100}
      />
      <Text style={styles.body}>Estado: {value.state}</Text>
      <View style={styles.row}>
        {states.map((state) => (
          <Action
            key={state}
            label={state}
            secondary={value.state !== state}
            onPress={() => set("state", state)}
          />
        ))}
      </View>
      <Field
        label="Interesses · separados por vírgula"
        value={value.interests.join(",")}
        onChangeText={(v) =>
          set(
            "interests",
            v.split(",").map((i) => i.trim()),
          )
        }
        placeholder="Música, viagens, cinema"
      />
      <Text style={styles.cardTitle}>Preferências de conexão</Text>
      {preferenceOptions.map((option) => (
        <Check
          key={option.value}
          label={option.label}
          value={value.preferences.includes(option.value)}
          onChange={() =>
            set(
              "preferences",
              value.preferences.includes(option.value)
                ? value.preferences.filter((v) => v !== option.value)
                : [...value.preferences, option.value],
            )
          }
        />
      ))}
      {privacy && (
        <>
          <Text style={styles.cardTitle}>Quem pode ver este perfil?</Text>
          {visibilityOptions.map((option) => (
            <Check
              key={option.value}
              label={option.label}
              value={value.audience === option.value}
              onChange={() => set("audience", option.value)}
            />
          ))}
          <Text style={styles.caption}>
            Ocultar das buscas não apaga o perfil. Um link direto ainda pode
            permitir acesso a cadastrados. Conexões aceitas serão implementadas
            na próxima etapa.
          </Text>
        </>
      )}
    </>
  );
}
