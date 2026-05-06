import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, Users, TrendingUp, Bed, Scissors } from "lucide-react";
import clinicImg from "@/assets/urgimed-clinic.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urgimed Health & Hospitality — Dashboard" },
      { name: "description", content: "Sistema de triagem e gestão para Clínica Urgimed e Urgimed Health Hospitality em Mindelo." },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Triagens (Urgência 24h)", value: "47", trend: "+12%", icon: Activity },
  { label: "Ocupação (Suítes)", value: "12/14", trend: "85%", icon: Bed },
  { label: "Cirurgias (Laparoscopia)", value: "8", trend: "+2", icon: Scissors },
  { label: "Consultas Ambulatório", value: "145", trend: "+8%", icon: Calendar },
];

const queue = [
  { name: "Marie Dubois", hotel: "Foya Branca Resort", symptom: "Dor abdominal aguda", priority: "Emergência", specialty: "Cirurgia Geral", time: "há 4 min" },
  { name: "James Carter", hotel: "Residente", symptom: "Check-up Cardíaco", priority: "Normal", specialty: "Cardiologia", time: "há 9 min" },
  { name: "Sofia Rossi", hotel: "Oasis Atlântico", symptom: "Febre alta", priority: "Urgência", specialty: "Pediatria", time: "há 17 min" },
];

const priorityStyle: Record<string, string> = {
  Emergência: "bg-destructive text-destructive-foreground animate-pulse",
  Urgência: "bg-warning/15 text-warning border border-warning/30",
  Normal: "bg-muted text-muted-foreground",
  VIP: "bg-primary text-primary-foreground",
};

function Index() {
  return (
    <DashboardLayout title="Recepção Urgimed" subtitle="Mindelo · São Vicente · Cabo Verde">
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl p-6 lg:p-10 text-primary-foreground min-h-[340px] flex items-end ring-1 ring-border/50" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <img src={clinicImg} alt="Urgimed Health & Hospitality, Mindelo" className="absolute inset-0 size-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.2_0.02_20/0.85)] via-primary/55 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_0%,oklch(0.2_0.02_20/0.4)_100%)]" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md border border-primary-foreground/20">
              <span className="size-1.5 rounded-full bg-success animate-pulse" /> Sistema operacional · Health & Hospitality
            </div>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight leading-[1.05]">Ecosistema integrado<br/><span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/60 bg-clip-text text-transparent">de saúde &amp; hospitalidade</span></h2>
            <p className="mt-3 text-primary-foreground/85 text-sm lg:text-base max-w-xl">
              Gestão centralizada para a Clínica Sede (Ambulatório e Diagnóstico) e Urgimed Health Hospitality (Cirurgias, Internamento e Urgências 24h).
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/triagem" className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-primary px-4 py-2.5 text-sm font-semibold hover:translate-y-[-1px] hover:shadow-lg transition-all">
                <Activity className="size-4" /> Triagem Manchester
              </Link>
              <Link to="/agendamentos" className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 backdrop-blur-md text-primary-foreground px-4 py-2.5 text-sm font-semibold border border-primary-foreground/25 hover:bg-primary-foreground/20 transition-colors">
                <Calendar className="size-4" /> Novo agendamento
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, trend, icon: Icon }) => (
            <div key={label} className="group relative rounded-xl bg-card border border-border/60 p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</span>
                <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[28px] font-bold tracking-tight tabular-nums">{value}</span>
                <span className="inline-flex items-center text-[11px] text-success font-semibold gap-0.5 bg-success/10 px-1.5 py-0.5 rounded">
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
                <h3 className="font-semibold">Fila de Triagem (Urgência 24h)</h3>
                <p className="text-xs text-muted-foreground">Pacientes encaminhados para a unidade Health Hospitality</p>
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
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${priorityStyle[q.priority] || priorityStyle['Normal']}`}>{q.priority}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{q.hotel ? q.hotel + ' · ' : ''}{q.symptom}</div>
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
                  <Building2 className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Status das Unidades</h4>
                  <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Clínica Sede (08h-22h)</span>
                      <span className="text-success font-medium">Aberto</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Health Hospitality (24h)</span>
                      <span className="text-success font-medium">Operante</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Bloco Operatório</span>
                      <span className="text-warning font-medium">1 Cirurgia em curso</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border p-5 bg-gradient-to-br from-accent to-card" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Users className="size-4" /> Parcerias e Seguros
              </div>
              <h4 className="mt-2 font-semibold">Validação Instantânea</h4>
              <p className="text-xs text-muted-foreground mt-1">Garantia Seguros, IMPAR, BS Care e INPS com integração automática no agendamento.</p>
              <Link to="/parcerias" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
                Gerir protocolos →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Index;
