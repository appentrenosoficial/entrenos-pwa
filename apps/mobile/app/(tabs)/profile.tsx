import { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { profileInputSchema, type ProfileInput } from "@entrenos/shared";
import { theme } from "@entrenos/ui";
import { useAccount } from "../../src/features/account/AccountProvider";
import { useAuth } from "../../src/auth/AuthProvider";
import {
  ProfileFields,
  initialProfile,
} from "../../src/features/account/ProfileFields";
import { supabase } from "../../src/lib/supabase";
import { Screen, Heading, Card, styles } from "../../src/components/primitives";
import { Action, Notice } from "../../src/components/forms";
import { accountError } from "../../src/features/account/api";
export default function ProfileScreen() {
  const { account, refresh } = useAccount();
  const { session, signOut } = useAuth();
  const profile = account?.profiles.find((p) => p.id === account.activeId);
  const [value, setValue] = useState<ProfileInput>(initialProfile);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (!profile) return;
    setValue({
      nickname: profile.nickname,
      bio: profile.bio,
      city: profile.city,
      state: profile.state as ProfileInput["state"],
      interests: profile.interests,
      preferences:
        profile.connection_preferences as ProfileInput["preferences"],
      audience: (account?.audience ?? "registered") as ProfileInput["audience"],
    });
    let live = true;
    setPhoto(null);
    if (profile.avatar_path)
      supabase!.storage
        .from("profile-avatars")
        .createSignedUrl(profile.avatar_path, 60)
        .then(({ data }) => {
          if (live) setPhoto(data?.signedUrl ?? null);
        });
    return () => {
      live = false;
    };
  }, [profile, account?.audience]);
  const save = async () => {
    if (!profile) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const v = profileInputSchema.parse({
        ...value,
        interests: value.interests.filter(Boolean),
      });
      const { error: err } = await supabase!.rpc("update_profile", {
        p_profile_id: profile.id,
        p_nickname: v.nickname,
        p_bio: v.bio,
        p_city: v.city,
        p_state: v.state,
        p_interests: v.interests,
        p_preferences: v.preferences,
        p_audience: v.audience,
      });
      if (err) throw err;
      await refresh();
      setNotice("Perfil salvo.");
    } catch (e) {
      setError(accountError(e));
    } finally {
      setBusy(false);
    }
  };
  const pickPhoto = async () => {
    if (!profile) return;
    setBusy(true);
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024)
        throw Error("Escolha uma imagem de até 5 MB.");
      const mime = asset.mimeType ?? "image/jpeg";
      if (!["image/jpeg", "image/png", "image/webp"].includes(mime))
        throw Error("Use JPG, PNG ou WebP.");
      const bytes = await (await fetch(asset.uri)).arrayBuffer();
      if (bytes.byteLength > 5 * 1024 * 1024)
        throw Error("Escolha uma imagem de até 5 MB.");
      const path = `${profile.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg"}`;
      const { error: uploadError } = await supabase!.storage
        .from("profile-avatars")
        .upload(path, bytes, { contentType: mime, upsert: false });
      if (uploadError) throw uploadError;
      const { error: err } = await supabase!.rpc("set_profile_avatar", {
        p_profile_id: profile.id,
        p_path: path,
      });
      if (err) {
        await supabase!.storage.from("profile-avatars").remove([path]);
        throw err;
      }
      if (profile.avatar_path)
        await supabase!.storage
          .from("profile-avatars")
          .remove([profile.avatar_path]);
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
        eyebrow={
          profile?.type === "couple" ? "Identidade de casal" : "Sua identidade"
        }
        title={profile?.nickname ?? "Perfil"}
        description={profile ? "@" + profile.username : undefined}
      />
      <Card>
        {photo && (
          <Image
            source={{ uri: photo }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
            accessibilityLabel="Foto do perfil ativo"
          />
        )}
        <Action
          secondary
          label={photo ? "Trocar foto" : "Adicionar foto"}
          onPress={pickPhoto}
          disabled={busy}
        />
        <Notice text={error} error />
        <Notice text={notice} />
        <ProfileFields value={value} onChange={setValue} privacy />
        <Action
          label="Salvar perfil e privacidade"
          onPress={save}
          busy={busy}
        />
      </Card>
      <Card>
        <Link
          style={{ color: theme.colors.primary, paddingVertical: 14 }}
          href={{ pathname: "/[section]", params: { section: "identidade" } }}
        >
          Alternar perfil e gerenciar casal ↗
        </Link>
        <Text style={styles.caption}>
          Conta: {session?.user.email}. Nome civil e nascimento não aparecem no
          perfil público.
        </Text>
        <Text style={styles.caption}>
          Verificação por selfie ainda não está disponível. Nenhum selo de
          autenticidade foi concedido.
        </Text>
        <Action
          secondary
          label="Sair da conta neste aparelho"
          disabled={busy}
          onPress={() => {
            void signOut().catch((e) => setError(accountError(e)));
          }}
        />
      </Card>
    </Screen>
  );
}
