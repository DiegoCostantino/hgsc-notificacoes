import { useEffect, useState, type CSSProperties } from "react";
import { supabase } from "./supabaseClient";
import type { Database } from "./database.types";

type Setor = Pick<Database["public"]["Tables"]["setor"]["Row"], "id" | "nome" | "codigo">;
type Classificacao = Database["public"]["Enums"]["classificacao_evento"];

const CLASSIFICACOES: { valor: Classificacao; rotulo: string }[] = [
  { valor: "sem_dano", rotulo: "Sem dano" },
  { valor: "circunstancia_risco", rotulo: "Circunstância de risco" },
  { valor: "nao_conformidade", rotulo: "Não conformidade" },
  { valor: "dano_leve", rotulo: "Com dano leve" },
  { valor: "dano_moderado", rotulo: "Com dano moderado" },
  { valor: "dano_grave", rotulo: "Com dano grave" },
];

export default function PortalNotificacao() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);

  const [descricao, setDescricao] = useState("");
  const [setorId, setSetorId] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [classificacao, setClassificacao] = useState<Classificacao | "">("");
  const [envolveuPaciente, setEnvolveuPaciente] = useState(false);
  const [dataEvento, setDataEvento] = useState("");

  useEffect(() => {
    supabase
      .from("setor")
      .select("id, nome, codigo")
      .eq("ativo", true)
      .order("nome")
      .then(({ data, error }) => {
        if (error) setErro("Não foi possível carregar os setores.");
        else setSetores(data ?? []);
      });
  }, []);

  async function enviar() {
    setErro(null);
    if (descricao.trim().length < 5) {
      setErro("Descreva o evento com pelo menos 5 caracteres.");
      return;
    }
    setEnviando(true);
    const { data, error } = await supabase.rpc("registrar_notificacao", {
      p_descricao: descricao,
      p_setor_id: setorId || undefined,
      p_tipo_evento: tipoEvento || undefined,
      p_categoria: categoria || undefined,
      p_classificacao: classificacao || undefined,
      p_envolveu_paciente: envolveuPaciente,
      p_data_evento: dataEvento || undefined,
    });
    setEnviando(false);
    if (error) setErro("Erro ao registrar. Tente novamente.");
    else setProtocolo(data as string);
  }

  if (protocolo) {
    return (
      <div style={S.wrap}>
        <div style={S.card}>
          <div style={S.check}>✓</div>
          <h1 style={S.h1}>Notificação registrada</h1>
          <p style={S.sub}>Guarde o número de protocolo para acompanhamento:</p>
          <div style={S.protocolo}>{protocolo}</div>
          <p style={S.anon}>
            Seu registro é <strong>anônimo</strong>. Nenhum dado de identificação foi
            coletado e não é possível rastrear quem notificou.
          </p>
          <button
            style={S.btnSecundario}
            onClick={() => {
              setProtocolo(null);
              setDescricao("");
              setSetorId("");
              setTipoEvento("");
              setCategoria("");
              setClassificacao("");
              setEnvolveuPaciente(false);
              setDataEvento("");
            }}
          >
            Registrar outra notificação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <h1 style={S.h1}>Notificar evento de segurança</h1>
        <p style={S.sub}>
          Núcleo de Qualidade e Segurança do Paciente. Preenchimento rápido e
          anônimo — você não precisa se identificar.
        </p>

        <label style={S.label}>
          Descrição do evento <span style={S.req}>*</span>
          <textarea
            style={{ ...S.input, minHeight: 110, resize: "vertical" }}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="O que aconteceu? Descreva os fatos, sem citar nomes de pessoas."
          />
        </label>

        <label style={S.label}>
          Setor envolvido
          <select style={S.input} value={setorId} onChange={(e) => setSetorId(e.target.value)}>
            <option value="">Selecione…</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}{s.codigo ? ` (${s.codigo})` : ""}
              </option>
            ))}
          </select>
        </label>

        <div style={S.linha}>
          <label style={{ ...S.label, flex: 1 }}>
            Tipo de evento
            <input
              style={S.input}
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value)}
              placeholder="Ex.: queda, medicação, identificação"
            />
          </label>
          <label style={{ ...S.label, flex: 1 }}>
            Data do evento
            <input
              style={S.input}
              type="date"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
            />
          </label>
        </div>

        <label style={S.label}>
          Classificação
          <select
            style={S.input}
            value={classificacao}
            onChange={(e) => setClassificacao(e.target.value as Classificacao)}
          >
            <option value="">Selecione…</option>
            {CLASSIFICACOES.map((c) => (
              <option key={c.valor} value={c.valor}>{c.rotulo}</option>
            ))}
          </select>
        </label>

        <label style={S.label}>
          Categoria do evento
          <input
            style={S.input}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex.: assistencial, estrutura, processo"
          />
        </label>

        <label style={{ ...S.label, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={envolveuPaciente}
            onChange={(e) => setEnvolveuPaciente(e.target.checked)}
          />
          O evento envolveu um paciente
        </label>

        {erro && <div style={S.erro}>{erro}</div>}

        <button style={S.btn} onClick={enviar} disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar notificação"}
        </button>
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
    maxWidth: 560,
    borderRadius: 14,
    padding: 28,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.05)",
  },
  h1: { fontSize: 22, fontWeight: 600, margin: "0 0 6px" },
  sub: { fontSize: 14, color: "#5f6b76", margin: "0 0 22px", lineHeight: 1.5 },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 16 },
  req: { color: "#c0392b" },
  input: {
    fontSize: 15,
    padding: "10px 12px",
    border: "1px solid #d4dae0",
    borderRadius: 8,
    fontFamily: "inherit",
    fontWeight: 400,
    background: "#fff",
  },
  linha: { display: "flex", gap: 14 },
  btn: {
    width: "100%",
    marginTop: 8,
    padding: "13px",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background: "#0f6e56",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnSecundario: {
    marginTop: 18,
    padding: "11px 18px",
    fontSize: 14,
    fontWeight: 500,
    color: "#0f6e56",
    background: "#e1f5ee",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  erro: {
    background: "#fceaea",
    color: "#a32d2d",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 14,
  },
  check: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#e1f5ee",
    color: "#0f6e56",
    fontSize: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  protocolo: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#0f6e56",
    background: "#f4f6f8",
    borderRadius: 8,
    padding: "14px",
    textAlign: "center",
    margin: "4px 0 18px",
  },
  anon: { fontSize: 13, color: "#5f6b76", lineHeight: 1.55, margin: 0 },
};
