import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/triagem")({
  head: () => ({
    meta: [
      { title: "Triagem IA — Urgimed Mindelo" },
      { name: "description", content: "Triagem de urgência por IA para turistas em Mindelo." },
    ],
  }),
  component: TriagemPage,
});

type Result = { specialty: string; priority: "VIP" | "Urgência" | "Normal"; reasoning: string };

function analyze(symptoms: string): Result {
  const s = symptoms.toLowerCase();
  if (/dente|dent|gengiv/.test(s)) return { specialty: "Odontologia", priority: "VIP", reasoning: "Sintomas dentários agudos detectados. Encaminhamento prioritário para dentista parceiro." };
  if (/peito|cardia|coração|falta de ar/.test(s)) return { specialty: "Cardiologia", priority: "Urgência", reasoning: "Sinais cardiovasculares — avaliação imediata recomendada." };
  if (/pele|alerg|coceira|erupção/.test(s)) return { specialty: "Dermatologia", priority: "Normal", reasoning: "Manifestação dermatológica leve. Consulta agendada nas próximas 24h." };
  if (/febre|náusea|vômito|abdom/.test(s)) return { specialty: "Clínica Geral", priority: "VIP", reasoning: "Quadro infeccioso/digestivo. Triagem VIP para hóspedes de hotel." };
  return { specialty: "Clínica Geral", priority: "Normal", reasoning: "Avaliação geral recomendada." };
}

function TriagemPage() {
  const [hotel, setHotel] = useState("Urgimed Hospitality Guest");
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

  const priorityColor = result?.priority === "VIP" ? "bg-primary text-primary-foreground" : result?.priority === "Urgência" ? "bg-warning/20 text-warning border border-warning/40" : "bg-muted text-muted-foreground";

  return (
    <DashboardLayout title="Triagem IA para Turistas" subtitle="Recepção · Mindelo">
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl">
        <form onSubmit={submit} className="rounded-xl bg-card border p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div>
            <h3 className="font-semibold">Novo Paciente</h3>
            <p className="text-xs text-muted-foreground">Recepção do hotel ou paciente direto via QR code</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Hotel Origem</label>
            <input value={hotel} onChange={e => setHotel(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Nome do Turista</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ex: Marie Dubois" required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Descreva os sintomas</label>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} required rows={5} placeholder="ex: dor de dente intensa há 2 dias, dificuldade para mastigar..." className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Analisando..." : "Analisar com IA"}
          </button>
        </form>

        <div className="rounded-xl border p-6 bg-gradient-to-br from-accent/40 to-card" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
            <Sparkles className="size-4" /> Resultado da IA
          </div>
          {!result && !loading && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <AlertTriangle className="size-10 mx-auto text-muted-foreground/40" />
              <p className="mt-3">Submeta os sintomas para receber sugestão de especialidade e prioridade.</p>
            </div>
          )}
          {loading && <div className="mt-8 text-center text-sm text-muted-foreground"><Loader2 className="size-8 mx-auto animate-spin text-primary" /><p className="mt-3">Analisando sintomas...</p></div>}
          {result && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-6 text-success" />
                <span className="text-sm font-medium">Análise concluída</span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Especialidade Sugerida</div>
                <div className="mt-1 text-2xl font-bold">{result.specialty}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Prioridade</div>
                <span className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${priorityColor}`}>{result.priority}</span>
              </div>
              <div className="rounded-lg bg-card border p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Justificativa IA</div>
                <p className="mt-2 text-sm">{result.reasoning}</p>
              </div>
              <button className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90">
                Encaminhar para Agendamento
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}