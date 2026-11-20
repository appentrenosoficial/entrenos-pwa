// Integração real SOMENTE contra Supabase local. Credenciais nunca são impressas.
import { execFileSync } from "node:child_process";
import { randomBytes, createHash } from "node:crypto";
import assert from "node:assert/strict";
const status = JSON.parse(
  execFileSync("npx", ["supabase", "status", "--output", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }),
);
const base = "http://127.0.0.1:54321";
const mailBase = "http://127.0.0.1:54324";
assert.equal(
  new URL(status.API_URL).hostname,
  "127.0.0.1",
  "Teste proibido fora do ambiente local.",
);
const publicKey = status.PUBLISHABLE_KEY || status.ANON_KEY;
const adminKey = status.SERVICE_ROLE_KEY;
const email = `stage2-auth-${Date.now()}@example.test`;
const password = "TestOnly!Password2026";
let userId;
let avatarPath;
let passed = 0;
const check = (condition, label) => {
  assert.ok(condition, label);
  passed++;
  console.log("PASS:", label);
};
async function auth(
  path,
  { method = "GET", body, token, admin = false, redirect = "follow" } = {},
) {
  const response = await fetch(base + "/auth/v1" + path, {
    method,
    headers: {
      apikey: admin ? adminKey : publicKey,
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(admin ? { Authorization: "Bearer " + adminKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect,
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }
  return { response, data };
}
const pkce = () => {
  const verifier = randomBytes(32).toString("hex");
  return {
    verifier,
    challenge: createHash("sha256").update(verifier).digest("base64url"),
  };
};
async function mailLink(needle) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const { messages = [] } = await (
      await fetch(mailBase + "/api/v1/messages")
    ).json();
    for (const message of messages) {
      if (!message.To?.some((to) => to.Address === email)) continue;
      const detail = await (
        await fetch(mailBase + "/api/v1/message/" + message.ID)
      ).json();
      const contents = (detail.Text || "") + " " + (detail.HTML || "");
      const match = contents
        .replaceAll("&amp;", "&")
        .match(/https?:\/\/[^\s"<>]+\/auth\/v1\/verify\?[^\s"<>]+/g)
        ?.find((link) => link.includes(needle));
      if (match) return match;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw Error("E-mail de teste não chegou ao Mailpit.");
}
async function exchange(link, verifier) {
  assert.equal(
    new URL(link).hostname,
    "127.0.0.1",
    "Recusado link fora do Supabase local.",
  );
  const response = await fetch(link, { redirect: "manual" });
  const location = response.headers.get("location");
  assert.ok(
    location?.startsWith("entrenos://auth/callback"),
    "Redirect mobile não configurado.",
  );
  const code = new URL(location).searchParams.get("code");
  assert.ok(code, "Callback não retornou código PKCE.");
  return auth("/token?grant_type=pkce", {
    method: "POST",
    body: { auth_code: code, code_verifier: verifier },
  });
}
try {
  const signupFlow = pkce();
  let result = await auth(
    "/signup?redirect_to=" + encodeURIComponent("entrenos://auth/callback"),
    {
      method: "POST",
      body: {
        email,
        password,
        code_challenge: signupFlow.challenge,
        code_challenge_method: "s256",
      },
    },
  );
  userId = result.data.user?.id || result.data.id;
  check(
    result.response.ok && userId && !result.data.access_token,
    "cadastro real aguarda confirmação de e-mail",
  );
  result = await auth("/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  check(!result.response.ok, "login bloqueado antes de confirmar e-mail");
  result = await exchange(await mailLink("type=signup"), signupFlow.verifier);
  check(
    result.response.ok && result.data.access_token,
    "e-mail confirmado e código PKCE trocado por sessão",
  );
  const accessToken = result.data.access_token;
  const onboarding = await fetch(base + "/rest/v1/rpc/complete_onboarding", {
    method: "POST",
    headers: {
      apikey: publicKey,
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_legal_name: "Pessoa de Teste Local",
      p_birth_date: "2000-01-01",
      p_adult_confirmed: true,
      p_nickname: "Teste Local",
      p_username: "local_" + Date.now(),
      p_city: "São Paulo",
      p_state: "SP",
      p_bio: "Perfil de integração local",
    }),
  });
  check(onboarding.ok, "onboarding real via PostgREST autenticado");
  const profileId = await onboarding.json();
  avatarPath = profileId + "/integration.png";
  const authHeaders = {
    apikey: publicKey,
    Authorization: "Bearer " + accessToken,
  };
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6n8sAAAAASUVORK5CYII=",
    "base64",
  );
  let response = await fetch(
    base + "/storage/v1/object/profile-avatars/" + avatarPath,
    {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "image/png" },
      body: png,
    },
  );
  check(response.ok, "upload real de avatar com sessão autenticada");
  response = await fetch(base + "/rest/v1/rpc/set_profile_avatar", {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ p_profile_id: profileId, p_path: avatarPath }),
  });
  check(response.ok, "avatar vinculado somente ao próprio perfil ativo");
  response = await fetch(
    base + "/storage/v1/object/public/profile-avatars/" + avatarPath,
    { headers: { apikey: publicKey } },
  );
  check(!response.ok, "avatar não disponível em endpoint público");
  response = await fetch(
    base + "/storage/v1/object/sign/profile-avatars/" + avatarPath,
    {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 60 }),
    },
  );
  const signed = await response.json();
  check(
    response.ok && signed.signedURL?.startsWith("/object/sign/"),
    "URL assinada gerada para leitor autorizado",
  );
  response = await fetch(base + "/storage/v1" + signed.signedURL);
  check(response.ok, "mídia privada carregada pela URL assinada");
  const recoveryFlow = pkce();
  result = await auth(
    "/recover?redirect_to=" +
      encodeURIComponent("entrenos://auth/callback?flow=recovery"),
    {
      method: "POST",
      body: {
        email,
        code_challenge: recoveryFlow.challenge,
        code_challenge_method: "s256",
      },
    },
  );
  check(result.response.ok, "solicitação de recuperação enviada pelo Auth");
  result = await exchange(
    await mailLink("type=recovery"),
    recoveryFlow.verifier,
  );
  check(
    result.response.ok && result.data.access_token,
    "link de recuperação retorna sessão PKCE",
  );
  result = await auth("/user", {
    method: "PUT",
    token: result.data.access_token,
    body: { password: password + "New!" },
  });
  check(result.response.ok, "nova senha salva no Auth");
  result = await auth("/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  check(!result.response.ok, "senha anterior rejeitada");
  result = await auth("/token?grant_type=password", {
    method: "POST",
    body: { email, password: password + "New!" },
  });
  check(
    result.response.ok && result.data.access_token,
    "login com nova senha funciona",
  );
  result = await auth("/token?grant_type=refresh_token", {
    method: "POST",
    body: { refresh_token: result.data.refresh_token },
  });
  check(
    result.response.ok && result.data.access_token,
    "renovação real de sessão funciona",
  );
  const refreshToken = result.data.refresh_token;
  const logout = await auth("/logout?scope=local", {
    method: "POST",
    token: result.data.access_token,
  });
  check(logout.response.ok, "sessão encerrada no servidor");
  result = await auth("/token?grant_type=refresh_token", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  check(!result.response.ok, "refresh token revogado após sair");
  console.log(`${passed} verificações de integração passaram.`);
} finally {
  if (avatarPath)
    await fetch(base + "/storage/v1/object/profile-avatars", {
      method: "DELETE",
      headers: {
        apikey: adminKey,
        Authorization: "Bearer " + adminKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: [avatarPath] }),
    });
  if (userId) {
    const { response } = await auth("/admin/users/" + userId, {
      method: "DELETE",
      admin: true,
    });
    if (!response.ok) throw Error("Falha ao limpar conta de teste local.");
  }
}
