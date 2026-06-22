import { useEffect, useState, type CSSProperties } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import type { Database } from "./database.types";

type Classificacao = Database["public"]["Enums"]["classificacao_evento"];
type Status = Database["public"]["Enums"]["status_notificacao"];

type LinhaNotificacao = {
  id: string;
  protocolo: string;
  data_notificacao: string;
  tipo_evento: string | null;
  classificacao: Classificacao | null;
  status: Status;
  setor: { nome: string } | null;
};

const ROTULO_CLASSIFICACAO: Record<Classificacao, string> = {
  sem_dano: "Sem dano",
  circunstancia_risco: "Circunstância de risco",
  nao_conformidade: "Não conformidade",
  dano_leve: "Com dano leve",
  dano_moderado: "Com dano moderado",
  dano_grave: "Com dano grave",
};

const ROTULO_STATUS: Record<Status, string> = {
  nova: "Nova",
  em_triagem: "Em triagem",
  em_investigacao: "Em investigação",
  em_analise: "Em análise",
  plano_acao: "Plano de ação",
  avaliacao_efetividade: "Avaliação de efetividade",
  concluida: "Concluída",
};

export default function PortalGestao() {
  const [session, setSession] = useState<Session | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCarregandoSessao(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (carregandoSessao) {
    return <div style={S.wrap}><div style={S.card}>Carregando…</div></div>;
  }

  return session ? <Painel session={session} /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function entrar() {
    setErro(null);
    setEntrando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setEntrando(false);
    if (error) setErro("E-mail ou senha inválidos.");
  }

  return (
    <div style={S.wrap}>
      <div style={{ ...S.card, maxWidth: 380 }}>
        <h1 style={S.h1}>Portal de Gestão</h1>
        <p style={S.sub}>Acesso restrito — Qualidade e Segurança do Paciente.</p>

        <label style={S.label}>
          E-mail
          <input
            style={S.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
          />
        </label>
        <label style={S.label}>
          Senha
          <input
            style={S.input}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
          />
        </label>

        {erro && <div style={S.erro}>{erro}</div>}

        <button style={S.btn} onClick={entrar} disabled={entrando}>
          {entrando ? "Entrando…" : "Entrar"}
        </button>
      </div>
    </div>
  );
}

function Painel({ session }: { session: Session }) {
  const [linhas, setLinhas] = useState<LinhaNotificacao[]>([]);
  const [perfil, setPerfil] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      const { data: u } = await supabase
        .from("usuario")
        .select("nome, perfil")
        .eq("id", session.user.id)
        .maybeSingle();
      if (u) setPerfil(u.perfil === "admin_nsp" ? "Administrador / NSP" : "Gestor");

      const { data, error } = await supabase
        .from("notificacao")
        .select("id, protocolo, data_notificacao, tipo_evento, classificacao, status, setor:setor_id ( nome )")
        .order("criado_em", { ascending: false });

      if (error) setErro("Não foi possível carregar as notificações.");
      else setLinhas((data ?? []) as unknown as LinhaNotificacao[]);
      setCarregando(false);
    })();
  }, [session.user.id]);

  return (
    <div style={{ ...S.wrap, alignItems: "stretch" }}>
      <div style={{ width: "100%", maxWidth: 920 }}>
        <header style={S.header}>
          <div>
            <h1 style={{ ...S.h1, marginBottom: 2 }}>Portal de Gestão</h1>
            <span style={S.meta}>{session.user.email} · {perfil}</span>
          </div>
          <button style={S.btnSecundario} onClick={() => supabase.auth.signOut()}>
            Sair
          </button>
        </header>

        <div style={S.card}>
          <h2 style={S.h2}>
            Notificações {linhas.length > 0 && <span style={S.contador}>{linhas.length}</span>}
          </h2>

          {erro && <div style={S.erro}>{erro}</div>}
          {carregando && <p style={S.sub}>Carregando…</p>}
          {!carregando && linhas.length === 0 && !erro && (
            <p style={S.sub}>Nenhuma notificação nos seus setores ainda.</p>
          )}

          {linhas.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={S.tabela}>
                <thead>
                  <tr>
                    <th style={S.th}>Protocolo</th>
                    <th style={S.th}>Setor</th>
                    <th style={S.th}>Classificação</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((n) => (
                    <tr key={n.id}>
                      <td style={S.td}><strong>{n.protocolo}</strong></td>
                      <td style={S.td}>{n.setor?.nome ?? "—"}</td>
                      <td style={S.td}>{n.classificacao ? ROTULO_CLASSIFICACAO[n.classificacao] : "—"}</td>
                      <td style={S.td}><span style={S.badge}>{ROTULO_STATUS[n.status]}</span></td>
                      <td style={S.td}>{new Date(n.data_notificacao).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const S: Record<string, CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "32px 16px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    color: "#1f2933",
  },
  card: {
    background: "#fff",
    width: "100%",
    borderRadius: 14,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  h1: { fontSize: 22, fontWeight: 600, margin: 0 },
  h2: { fontSize: 17, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 },
  sub: { fontSize: 14, color: "#5f6b76", margin: "0 0 18px", lineHeight: 1.5 },
  meta: { fontSize: 13, color: "#5f6b76" },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 16 },
  input: {
    fontSize: 15,
    padding: "10px 12px",
    border: "1px solid #d4dae0",
    borderRadius: 8,
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    padding: "12px",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background: "#0f6e56",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnSecundario: {
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 500,
    color: "#0f6e56",
    background: "#e1f5ee",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  erro: {
    background: "#fceaea",
    color: "#a32d2d",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 14,
  },
  contador: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f6e56",
    background: "#e1f5ee",
    borderRadius: 20,
    padding: "2px 10px",
  },
  tabela: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "2px solid #eef1f4",
    color: "#5f6b76",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  td: { padding: "11px 12px", borderBottom: "1px solid #f0f2f5", verticalAlign: "top" },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    background: "#eef1f4",
    color: "#3d4852",
    borderRadius: 6,
    padding: "3px 8px",
    whiteSpace: "nowrap",
  },
};
