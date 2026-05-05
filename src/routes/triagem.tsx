import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/triagem")({
  head: () => ({
    meta: [
      { title: "Triagem Inteligente — Urgimed" },
      { name: "description", content: "Sistema de triagem Manchester para a Urgimed." },
    ],
  }),
  component: TriagemPage,
});

type PriorityLevel = "Vermelho (Emergência)" | "Laranja (Muito Urgente)" | "Amarelo (Urgente)" | "Verde (Pouco Urgente)" | "Azul (Não Urgente)";

type Result = { 
  specialty: string; 
  priority: PriorityLevel; 
  unit: "Health Hospitality (Urgência 24h)" | "Clínica Sede (Ambulatório)";
  reasoning: string;
};

function analyze(symptoms: string): Result {
  const s = symptoms.toLowerCase();
  
  if (/peito|falta de ar|inconsciente|hemorragia grave|parada/.test(s)) {
    return { specialty: "Cardiologia / Reanimação", priority: "Vermelho (Emergência)", unit: "Health Hospitality (Urgência 24h)", reasoning: "Risco imediato de vida. Requer atendimento no bloco de reanimação (0 min)." };
  }
  if (/dor aguda|fratura|sangramento|febre alta/.test(s)) {
    return { specialty: "Cirurgia Geral / Ortopedia", priority: "Laranja (Muito Urgente)", unit: "Health Hospitality (Urgência 24h)", reasoning: "Quadro agudo com risco. Atendimento alvo em 10 minutos." };
  }
  if (/dor moderada|vômito|cólica|tontura/.test(s)) {
    return { specialty: "Clínica Geral", priority: "Amarelo (Urgente)", unit: "Health Hospitality (Urgência 24h)", reasoning: "Necessidade de avaliação urgente mas sem risco de vida imediato (60 min)." };
  }
  if (/gripe|dor leve|alergia leve|curativo/.test(s)) {
    return { specialty: "Clínica Geral / Enfermagem", priority: "Verde (Pouco Urgente)", unit: "Clínica Sede (Ambulatório)", reasoning: "Caso não urgente. Encaminhamento para a Clínica Sede (120 min)." };
  }
  if (/check-up|rotina|receita|atestado/.test(s)) {
    return { specialty: "Clínica Geral", priority: "Azul (Não Urgente)", unit: "Clínica Sede (Ambulatório)", reasoning: "Atendimento eletivo. Pode ser agendado por marcação." };
  }
  
  return { specialty: "Clínica Geral", priority: "Verde (Pouco Urgente)", unit: "Clínica Sede (Ambulatório)", reasoning: "Avaliação ambulatorial padrão recomendada." };
}

function TriagemPage() {
  const [method, setMethod] = useState("Presencial");
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyze(symptoms));
      setLoading(false);
    }, 900);
  };

  const priorityColor = (priority?: PriorityLevel) => {
    switch (priority) {
      case "Vermelho (Emergência)": return "bg-destructive text-destructive-foreground animate-pulse";
      case "Laranja (Muito Urgente)": return "bg-orange-500 text-white";
      case "Amarelo (Urgente)": return "bg-yellow-400 text-black";
      case "Verde (Pouco Urgente)": return "bg-green-500 text-white";
      case "Azul (Não Urgente)": return "bg-blue-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout title="Triagem Manchester" subtitle="Quiosque e Admissão">
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl">
        <form onSubmit={submit} className="rounded-xl bg-card border p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div>
            <h3 className="font-semibold">Avaliação Inicial do Paciente</h3>
            <p className="text-xs text-muted-foreground">Insira as queixas principais para determinar a prioridade</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Método de Chegada</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Presencial (Urgência)</option>
              <option>Encaminhamento de Hotel</option>
              <option>Ambulância</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Nome do Paciente</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ex: João Silva" required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Queixa Principal / Sintomas</label>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} required rows={5} placeholder="ex: dor forte no peito e suor frio..." className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Processando Protocolo..." : "Aplicar Protocolo Manchester"}
          </button>
        </form>

        <div className="rounded-xl border p-6 bg-gradient-to-br from-accent/40 to-card" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
            <Sparkles className="size-4" /> Decisão Clínica IA
          </div>
          {!result && !loading && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <AlertTriangle className="size-10 mx-auto text-muted-foreground/40" />
              <p className="mt-3">Aguardando dados para classificação de risco.</p>
            </div>
          )}
          {loading && <div className="mt-8 text-center text-sm text-muted-foreground"><Loader2 className="size-8 mx-auto animate-spin text-primary" /><p className="mt-3">Avaliando critérios...</p></div>}
          {result && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-6 text-success" />
                <span className="text-sm font-medium">Classificação concluída</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Prioridade / Risco</div>
                  <span className={`mt-1 inline-block px-3 py-1 rounded-md text-xs font-bold ${priorityColor(result.priority)}`}>
                    {result.priority}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Unidade Recomendada</div>
                  <div className="mt-1 text-sm font-semibold">{result.unit}</div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Especialidade Alvo</div>
                <div className="mt-1 text-xl font-bold">{result.specialty}</div>
              </div>

              <div className="rounded-lg bg-card border p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diretriz</div>
                <p className="mt-2 text-sm">{result.reasoning}</p>
              </div>
              
              <button className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90">
                Emitir Senha e Registrar
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TriagemPage;