import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, Users, TrendingUp, Bed, Scissors, Loader2 } from "lucide-react";
import clinicImg from "@/assets/medicentro-clinic.jpg";
import logoImg from "@/assets/medicentro-logo.jpg";
import { useRole } from "@/hooks/useRole";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medicentro Health Hub — Dashboard" },
      { name: "description", content: "Sistema de triagem e gestão para a Clínica Privada Medicentro — Mindelo, Cabo Verde." },
    ],
  }),
  component: Index,
});

const priorityStyle: Record<string, string> = {
  Emergência: "bg-destructive text-destructive-foreground animate-pulse",
  Urgência: "bg-warning/15 text-warning border border-warning/30",
  Normal: "bg-muted text-muted-foreground",
  VIP: "bg-primary text-primary-foreground",
};

function Index() {
  const { currentUnit } = useRole();
  const [loading, setLoading] = useState(false);

  // Re-simulate loading when unit changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [currentUnit]);

  // Simulated Database filtered by Unit
  const isSede = currentUnit.includes("Madeiralzinho");

  const stats = isSede ? [
    { label: "Triagens (Urgência 24h)", value: "47", trend: "+12%", icon: Activity },
    { label: "Ocupação (Suítes)", value: "12/14", trend: "85%", icon: Bed },
    { label: "Cirurgias (Laparoscopia)", value: "8", trend: "+2", icon: Scissors },
    { label: "Consultas Ambulatório", value: "145", trend: "+8%", icon: Calendar },
  ] : [
    { label: "Triagens Locais", value: "12", trend: "-5%", icon: Activity },
    { label: "Salas de Observação", value: "2/4", trend: "50%", icon: Bed },
    { label: "Pequenas Cirurgias", value: "3", trend: "Estável", icon: Scissors },
    { label: "Consultas Especialidade", value: "45", trend: "+15%", icon: Calendar },
  ];

  const queue = isSede ? [
    { name: "Maria Évora", hotel: "INPS · Madeiralzinho", symptom: "Dor abdominal aguda", priority: "Emergência", specialty: "Cirurgia Geral", time: "há 4 min" },
    { name: "João Silva", hotel: "Garantia · Particular", symptom: "Check-up Cardíaco", priority: "Normal", specialty: "Cardiologia", time: "há 9 min" },
    { name: "Ana Tavares", hotel: "IMPAR · Monte Sossego", symptom: "Febre alta pediátrica", priority: "Urgência", specialty: "Pediatria", time: "há 17 min" },
  ] : [
    { name: "Carlos Fonseca", hotel: "Particular", symptom: "Corte na mão", priority: "Urgência", specialty: "Enfermagem", time: "há 2 min" },
    { name: "Sónia Fortes", hotel: "INPS", symptom: "Gripe forte", priority: "Normal", specialty: "Clínica Geral", time: "há 12 min" },
  ];

  return (
    <DashboardLayout title="Recepção Medicentro" subtitle={currentUnit}>
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl p-6 lg:p-10 text-primary-foreground min-h-[340px] flex items-end ring-1 ring-border/50" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <img src={clinicImg} alt="Clínica Privada Medicentro, Mindelo" className="absolute inset-0 size-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.22_0.02_240/0.88)] via-primary/55 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_0%,oklch(0.22_0.02_240/0.4)_100%)]" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md border border-primary-foreground/20">
              <img src={logoImg} alt="Medicentro 20 anos" className="size-4 rounded-full object-cover" />
              <span>Medicentro · 20 anos a cuidar de si</span>
            </div>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              {isSede ? "Clínica Privada" : "Unidade Descentralizada"}<br/>
              <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/60 bg-clip-text text-transparent">
                {isSede ? "Medicentro Mindelo" : "Monte Sossego"}
              </span>
            </h2>
            <p className="mt-3 text-primary-foreground/85 text-sm lg:text-base max-w-xl">
              {isSede 
                ? "Gestão centralizada da Clínica Sede (Madeiralzinho) — ambulatório, diagnóstico, cirurgia e urgência."
                : "Gestão da Unidade Monte Sossego — atendimento de proximidade, análises e especialidades locais."}
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
        <section className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {stats.map(({ label, value, trend, icon: Icon }) => (
            <div key={label} className="group relative rounded-xl bg-card border border-border/60 p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</span>
                <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                {loading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-[28px] font-bold tracking-tight tabular-nums">{value}</span>
                    <span className="inline-flex items-center text-[11px] text-success font-semibold gap-0.5 bg-success/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="size-3" /> {trend}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Queue + Side panel */}
        <section className={`grid lg:grid-cols-3 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="lg:col-span-2 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Fila de Triagem ({currentUnit})</h3>
                <p className="text-xs text-muted-foreground">Pacientes aguardando chamada na unidade local</p>
              </div>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                {loading ? <Loader2 className="size-3 animate-spin" /> : <span className="size-2 rounded-full bg-success animate-pulse" />} 
                {loading ? 'A sincronizar...' : 'Ao vivo'}
              </span>
            </div>
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground/30" /></div>
            ) : (
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
                {queue.length === 0 && (
                  <li className="px-5 py-8 text-center text-muted-foreground text-sm">Sem pacientes na fila de espera.</li>
                )}
              </ul>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-accent grid place-items-center">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Status das Unidades</h4>
                  <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span className={isSede ? 'font-bold text-foreground' : ''}>Clínica Sede · Madeiralzinho</span>
                      <span className="text-success font-medium">Aberto</span>
                    </li>
                    <li className="flex justify-between">
                      <span className={!isSede ? 'font-bold text-foreground' : ''}>Unidade Monte Sossego</span>
                      <span className="text-success font-medium">Operante</span>
                    </li>
                    <li className="flex justify-between opacity-50">
                      <span>Bloco Operatório</span>
                      <span className="text-warning font-medium">1 Cirurgia</span>
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
