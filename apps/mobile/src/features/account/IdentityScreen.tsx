import { useState } from "react";
import { Text } from "react-native";
import { useAccount } from "./AccountProvider";
import { useAuth } from "../../auth/AuthProvider";
import { supabase } from "../../lib/supabase";
import { Screen, Heading, Card, styles } from "../../components/primitives";
import { Action, Field, Check, Notice } from "../../components/forms";
import { usernameSchema } from "@entrenos/shared";
import { accountError } from "./api";
export function IdentityScreen() {
  const { account, refresh, clear } = useAccount();
  const { session } = useAuth();
  const [partner, setPartner] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [consent, setConsent] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (task: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await task();
      clear();
      await refresh();
    } catch (e) {
      setError(accountError(e));
    } finally {
      setBusy(false);
    }
  };
  const couple = account?.profiles.find((p) => p.type === "couple");
  return (
    <Screen>
      <Heading
        eyebrow="Uma conta, suas identidades"
        title="Perfil ativo"
        description="Conversas pessoais e compartilhadas permanecem separadas."
      />
      <Notice text={error} error />
      {account?.profiles.map((profile) => (
        <Card key={profile.id}>
          <Text style={styles.cardTitle}>{profile.nickname}</Text>
          <Text style={styles.body}>
            @{profile.username} ·{" "}
            {profile.type === "couple" ? "Casal" : "Individual"}
          </Text>
          <Action
            label={
              profile.id === account.activeId
                ? "Perfil ativo"
                : "Usar este perfil"
            }
            disabled={busy || profile.id === account.activeId}
            onPress={() =>
              run(async () => {
                const { error: err } = await supabase!.rpc(
                  "set_active_profile",
                  { p_profile_id: profile.id },
                );
                if (err) throw err;
              })
            }
          />
        </Card>
      ))}
      {!couple && (
        <Card>
          <Text style={styles.cardTitle}>Convidar para um perfil de casal</Text>
          <Text style={styles.body}>
            A outra pessoa deve ter cadastro concluído. O vínculo só será criado
            quando ela aceitar. O convite expira em 7 dias.
          </Text>
          <Field
            label="@username individual do parceiro"
            value={partner}
            onChangeText={setPartner}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field
            label="Apelido público do casal"
            value={name}
            onChangeText={setName}
            maxLength={60}
          />
          <Field
            label="@username do casal"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Check
            label="Consinto em criar este perfil de casal com a pessoa indicada"
            value={consent}
            onChange={() => setConsent((v) => !v)}
          />
          <Text style={styles.caption}>
            Cidade e estado iniciais serão os do perfil de quem convida. Ambos
            poderão editar o perfil compartilhado.
          </Text>
          <Action
            label="Enviar convite"
            busy={busy}
            disabled={!consent}
            onPress={() =>
              run(async () => {
                if (!consent) throw Error("Seu consentimento é necessário.");
                if (name.trim().length < 2)
                  throw Error("Informe o apelido do casal.");
                const { error: err } = await supabase!.rpc("invite_couple", {
                  p_partner_username: usernameSchema.parse(
                    partner.replace(/^@/, ""),
                  ),
                  p_nickname: name.trim(),
                  p_username: usernameSchema.parse(username),
                });
                if (err) throw err;
              })
            }
          />
        </Card>
      )}
      {account?.invitations
        .filter((inv) => new Date(inv.expires_at) > new Date())
        .map((inv) => (
          <Card key={inv.id}>
            <Text style={styles.cardTitle}>{inv.nickname}</Text>
            <Text style={styles.body}>
              @{inv.username} ·{" "}
              {inv.invitee_id === session?.user.id
                ? "Convite recebido"
                : "Aguardando aceite da outra pessoa"}
            </Text>
            <Text style={styles.body}>
              De @{inv.partners.inviter_username} para @
              {inv.partners.invitee_username}
            </Text>
            <Text style={styles.caption}>
              Localização inicial: {inv.partners.city}/{inv.partners.state}.
            </Text>
            <Text style={styles.caption}>
              Expira em {new Date(inv.expires_at).toLocaleDateString("pt-BR")}.
              Nome civil, nascimento e chats pessoais não serão compartilhados.
            </Text>
            {inv.invitee_id === session?.user.id ? (
              <>
                <Action
                  disabled={busy}
                  label="Aceitar vínculo de casal"
                  onPress={() =>
                    run(async () => {
                      const { error: err } = await supabase!.rpc(
                        "respond_couple_invitation",
                        { p_invitation_id: inv.id, p_accept: true },
                      );
                      if (err) throw err;
                    })
                  }
                />
                <Action
                  secondary
                  disabled={busy}
                  label="Recusar convite"
                  onPress={() =>
                    run(async () => {
                      const { error: err } = await supabase!.rpc(
                        "respond_couple_invitation",
                        { p_invitation_id: inv.id, p_accept: false },
                      );
                      if (err) throw err;
                    })
                  }
                />
              </>
            ) : (
              <Action
                secondary
                disabled={busy}
                label="Cancelar convite"
                onPress={() =>
                  run(async () => {
                    const { error: err } = await supabase!.rpc(
                      "cancel_couple_invitation",
                      { p_invitation_id: inv.id },
                    );
                    if (err) throw err;
                  })
                }
              />
            )}
          </Card>
        ))}
      {couple && (
        <Card>
          <Text style={styles.cardTitle}>Encerrar vínculo</Text>
          <Text style={styles.body}>
            Retirar seu consentimento exclui o perfil compartilhado para ambos.
            Os perfis individuais permanecem.
          </Text>
          <Check
            label="Entendo que o perfil de casal será excluído para ambos"
            value={leaving}
            onChange={() => setLeaving((v) => !v)}
          />
          <Action
            secondary
            label="Encerrar perfil de casal"
            disabled={!leaving || busy}
            onPress={() =>
              run(async () => {
                const { error: err } = await supabase!.rpc("leave_couple", {
                  p_profile_id: couple.id,
                });
                if (err) throw err;
              })
            }
          />
        </Card>
      )}
    </Screen>
  );
}
