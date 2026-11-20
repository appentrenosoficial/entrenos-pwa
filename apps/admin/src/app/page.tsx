import { getBackendStatus } from "../lib/environment";
import Link from "next/link";
export const dynamic = "force-dynamic";
// Esta página pública contém somente o aviso de instalação.
// Nenhuma consulta ou operação administrativa existe antes do controle server-side.
export default function AdminPage() {
  const status = getBackendStatus();
  return (
    <div className="shell">
      <aside>
        <Link className="brand" href="/" aria-label="EntreNós, início">
          <span aria-hidden="true">∞</span> EntreNós
        </Link>
        <p className="eyebrow">Administração</p>
        <p>Um espaço de cuidado para conexões reais.</p>
        <div className="modules" aria-label="Módulos planejados">
          {[
            "Dashboard",
            "Verificações",
            "Denúncias",
            "Usuários",
            "Grupos e eventos",
            "Financeiro",
            "Papéis e auditoria",
          ].map((label) => (
            <div key={label}>
              <span>{label}</span>
              <small>Pendente</small>
            </div>
          ))}
        </div>
        <p className="footnote">ESTRUTURA INICIAL · ETAPA 1</p>
      </aside>
      <main>
        <header>
          <span className="eyebrow">Painel administrativo</span>
          <span className="badge">Acesso indisponível</span>
        </header>
        <section className="hero">
          <p className="eyebrow">Respeito em cada conexão</p>
          <h1>
            Confiança começa
            <br />
            com cuidado.
          </h1>
          <p>
            Base do painel EntreNós preparada para receber os fluxos de
            administração, moderação e auditoria.
          </p>
        </section>
        <section className="card" aria-labelledby="access-title">
          <div className="symbol" aria-hidden="true">
            ↗
          </div>
          <h2 id="access-title">Autorização ainda não configurada</h2>
          <p>
            O painel não disponibiliza dados ou operações administrativas nesta
            etapa. O acesso será habilitado após autenticação e validação de
            papéis no servidor.
          </p>
          <button disabled>Entrada administrativa indisponível</button>
          <p className="note">
            Configurar o Supabase não concede acesso administrativo.
          </p>
        </section>
        <div className="grid">
          <section className="card">
            <h2>Ambiente</h2>
            <p>
              {status === "ready"
                ? "Variáveis públicas válidas. Conectividade não verificada."
                : status === "invalid"
                  ? "Configuração inválida. Revise as variáveis de ambiente."
                  : "Supabase não configurado."}
            </p>
          </section>
          <section className="card">
            <h2>Verificação manual</h2>
            <p>
              A análise de selfie exigirá administrador com permissão específica
              e trilha de auditoria. Esse fluxo ainda não foi implementado.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
