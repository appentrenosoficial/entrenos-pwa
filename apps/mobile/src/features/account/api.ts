import type { Tables } from "@entrenos/shared";
import { supabase } from "../../lib/supabase";
export type Profile = Tables<"profiles">;
export type Invitation = Tables<"couple_invitations"> & {
  partners: {
    inviter_username: string;
    invitee_username: string;
    city: string;
    state: string;
  };
};
export type Account = {
  profiles: Profile[];
  activeId: string | null;
  invitations: Invitation[];
  audience: string;
  onboarded: boolean;
};
export function accountError(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    ["PGRST202", "PGRST205", "42P01"].includes(String(error.code))
  )
    return "O banco deste ambiente ainda precisa receber as migrações da Etapa 2. Nenhum cadastro de perfil foi salvo.";
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray(error.issues)
  )
    return String(error.issues[0]?.message ?? "Confira os campos informados.");
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "23505"
  )
    return "Este username já está em uso ou o vínculo já existe.";
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error)
    return String(error.message);
  return "Não foi possível concluir. Confira sua conexão e tente novamente.";
}
export async function loadAccount(): Promise<Account> {
  if (!supabase) throw Error("Supabase não configurado.");
  const result = await supabase
    .from("users_private")
    .select("user_id")
    .maybeSingle();
  if (result.error) throw result.error;
  if (!result.data)
    return {
      profiles: [],
      activeId: null,
      invitations: [],
      audience: "registered",
      onboarded: false,
    };
  const [members, context, invitations] = await Promise.all([
    supabase.from("profile_members").select("profile_id"),
    supabase.from("account_context").select("active_profile_id").single(),
    supabase
      .from("couple_invitations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);
  for (const r of [members, context, invitations]) if (r.error) throw r.error;
  const ids = [...new Set(members.data!.map((m) => m.profile_id))];
  const profiles = await supabase.from("profiles").select("*").in("id", ids);
  if (profiles.error) throw profiles.error;
  const visibility = await supabase
    .from("profile_visibility")
    .select("audience")
    .eq("profile_id", context.data!.active_profile_id!)
    .maybeSingle();
  if (visibility.error) throw visibility.error;
  const enriched = await Promise.all(
    invitations.data!.map(async (inv) => {
      const { data, error } = await supabase!
        .rpc("invitation_partners", { p_invitation_id: inv.id })
        .single();
      if (error) throw error;
      return { ...inv, partners: data };
    }),
  );
  return {
    profiles: profiles.data,
    activeId: context.data!.active_profile_id,
    invitations: enriched,
    audience: visibility.data?.audience ?? "registered",
    onboarded: true,
  };
}
