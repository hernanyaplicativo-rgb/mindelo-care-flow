import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, Users, TrendingUp, AlertCircle, Sparkles, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urgimed Health & Hospitality — Dashboard Mindelo" },
      { name: "description", content: "Plataforma de triagem IA, parcerias clínicas e agendamento VIP para turistas em Mindelo, Cabo Verde." },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Triagens Hoje", value: "47", trend: "+12%", icon: Activity },
  { label: "Pacientes VIP", value: "18", trend: "+5", icon: Sparkles },
  { label: "Hotéis Parceiros", value: "23", trend: "+2", icon: Building2 },
  { label: "Consultas Agendadas", value: "62", trend: "+8%", icon: Calendar },
];

const queue = [
  { name: "Marie Dubois", hotel: "Foya Branca Resort", symptom: "Febre + dor abdominal", priority: "VIP", specialty: "Clínica Geral", time: "há 4 min" },
  { name: "James Carter", hotel: "Oasis Atlântico", symptom: "Dor dental aguda", priority: "Urgência", specialty: "Odontologia", time: "há 9 min" },
  { name: "Sofia Rossi", hotel: "Urgimed Hospitality Guest", symptom: "Reação alérgica leve", priority: "Normal", specialty: "Dermatologia", time: "há 17 min" },
];

const priorityStyle: Record<string, string> = {
  VIP: "bg-primary text-primary-foreground",
  "Urgência": "bg-warning/15 text-warning border border-warning/30",
  Normal: "bg-muted text-muted-foreground",
};

function Index() {
  return (
    <DashboardLayout title="Recepção Urgimed" subtitle="Mindelo · São Vicente · Cabo Verde">
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl p-6 lg:p-8 text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Stethoscope className="size-3.5" /> Health & Hospitality Mindelo
            </div>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight">Triagem IA para Turistas</h2>
            <p className="mt-2 text-primary-foreground/85 text-sm lg:text-base">
              Recepção virtual operando 24/7. Hotéis enviam pacientes via QR code, a IA atribui especialidade e prioridade, e o sistema bloqueia agendamentos duplicados.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/triagem" className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-primary px-4 py-2.5 text-sm font-semibold hover:opacity-95">
                <Activity className="size-4" /> Iniciar Triagem
              </Link>
              <Link to="/agendamentos" className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/15 backdrop-blur text-primary-foreground px-4 py-2.5 text-sm font-semibold border border-primary-foreground/20 hover:bg-primary-foreground/20">
                AGENDAR CONSULTA VIP DENTISTA
              </Link>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 size-72 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="absolute right-10 top-6 size-32 rounded-full bg-primary-foreground/5" />
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, trend, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                <Icon className="size-4 text-primary" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                <span className="inline-flex items-center text-xs text-success font-medium gap-0.5">
                  <TrendingUp className="size-3" /> {trend}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Queue + Side panel */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Fila de Triagem em Tempo Real</h3>
                <p className="text-xs text-muted-foreground">Pacientes recebidos via QR code dos hotéis parceiros</p>
              </div>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-success animate-pulse" /> ao vivo
              </span>
            </div>
            <ul className="divide-y">
              {queue.map((q) => (
                <li key={q.name} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/40 transition">
                  <div className="size-10 rounded-full bg-accent grid place-items-center text-accent-foreground font-semibold text-sm">
                    {q.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{q.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${priorityStyle[q.priority]}`}>{q.priority}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{q.hotel} · {q.symptom}</div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium">{q.specialty}</div>
                    <div className="text-xs text-muted-foreground">{q.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-accent grid place-items-center">
                  <AlertCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Sistema de Bloqueio Ativo</h4>
                  <p className="text-xs text-muted-foreground mt-1">Trigger SQL impede que dois turistas reservem o mesmo horário. 0 conflitos hoje.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-5 bg-gradient-to-br from-accent to-card" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Users className="size-4" /> Parceria Destaque
              </div>
              <h4 className="mt-2 font-semibold">Medicentro Clínico de Especialidades</h4>
              <p className="text-xs text-muted-foreground">Rua Alberto Leite · 14 pacientes encaminhados esta semana</p>
              <Link to="/parcerias" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
                Ver relatórios de comissão →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
