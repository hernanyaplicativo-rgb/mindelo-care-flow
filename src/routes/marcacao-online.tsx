import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useMemo, useState } from "react";
import {
  Stethoscope, HeartPulse, Baby, Bone, Brain, Eye, Microscope,
  Calendar, Clock, Check, ChevronLeft, ChevronRight, Smartphone,
  ShieldCheck, Sparkles, MapPin, User
} from "lucide-react";

export const Route = createFileRoute("/marcacao-online")({
  head: () => ({
    meta: [
      { title: "Marcação Online — Medicentro" },
      { name: "description", content: "Marque a sua consulta na Medicentro em 4 passos simples — sem chamadas, sem espera." },
    ],
  }),
  component: MarcacaoOnlinePage,
});

type Specialty = { id: string; name: string; icon: any; desc: string };

const specialties: Specialty[] = [
  { id: "clinica", name: "Clínica Geral", icon: Stethoscope, desc: "Consulta de rotina ou queixas gerais" },
  { id: "cardio", name: "Cardiologia", icon: HeartPulse, desc: "Coração, tensão, check-up" },
  { id: "pediatria", name: "Pediatria", icon: Baby, desc: "Crianças e bebés" },
  { id: "ortopedia", name: "Ortopedia", icon: Bone, desc: "Ossos, articulações, lesões" },
  { id: "gineco", name: "Ginecologia", icon: User, desc: "Saúde da mulher" },
  { id: "neuro", name: "Neurologia", icon: Brain, desc: "Cabeça, enxaquecas, sono" },
  { id: "oftalmo", name: "Oftalmologia", icon: Eye, desc: "Visão e olhos" },
  { id: "exames", name: "Exames", icon: Microscope, desc: "Análises, ecografia, raio-X" },
];

const doctorsBySpec: Record<string, { name: string; sub: string }[]> = {
  clinica: [{ name: "Dr. Júlio Wahnon", sub: "Clínica Geral · 20 anos" }, { name: "Dra. Alicia Wahnon", sub: "Clínica Geral · Família" }],
  cardio: [{ name: "Dr. Fernando Lopes", sub: "Cardiologia · Prova de esforço" }],
  pediatria: [{ name: "Dra. Carlina da Luz Santos", sub: "Pediatria · Neonatologia" }],
  ortopedia: [{ name: "Dr. Paulo Semedo Freire", sub: "Ortopedia · Trauma" }],
  gineco: [{ name: "Dra. Mª Teresa Martins", sub: "Ginecologia / Obstetrícia" }],
  neuro: [{ name: "Dr. Lucien Attier", sub: "Neurologia geral" }],
  oftalmo: [{ name: "Dra. Inês Brito", sub: "Oftalmologia clínica" }],
  exames: [{ name: "Sala de Imagem", sub: "Ecografia · Raio-X · Endoscopia" }],
};

function getNextDays(n: number) {
  const days: { key: string; weekday: string; day: string; month: string; date: Date }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("pt-PT", { weekday: "short" }).replace(".", ""),
      day: d.getDate().toString().padStart(2, "0"),
      month: d.toLocaleDateString("pt-PT", { month: "short" }).replace(".", ""),
      date: d,
    });
  }
  return days;
}

const allTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "17:00", "18:30", "20:00"];

function MarcacaoOnlinePage() {
  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState<"sede" | "monte">("sede");
  const [spec, setSpec] = useState<Specialty | null>(null);
  const [doctor, setDoctor] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [insurance, setInsurance] = useState("Particular");
  const [done, setDone] = useState(false);

  const days = useMemo(() => getNextDays(10), []);
  const availableTimes = useMemo(
    () => allTimes.map((t) => ({ t, free: Math.random() > 0.35 })),
    [day, doctor]
  );

  const canNext =
    (step === 1 && !!spec) ||
    (step === 2 && !!doctor && !!day && !!time) ||
    (step === 3 && name.trim().length > 2 && phone.trim().length >= 7);

  const reset = () => {
    setStep(1); setSpec(null); setDoctor(null); setDay(null);
    setTime(null); setName(""); setPhone(""); setInsurance("Particular"); setDone(false);
  };

  return (
    <DashboardLayout title="Marcação Online" subtitle="Pré-visualização da experiência do paciente · 4 passos">
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-6xl">
        {/* Phone preview / fluxo do paciente */}
        <div className="rounded-2xl border bg-gradient-to-br from-muted/30 to-card p-6 lg:p-10 flex justify-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="w-full max-w-[420px] rounded-[2.2rem] border-[10px] border-foreground bg-background overflow-hidden shadow-2xl flex flex-col" style={{ minHeight: 720 }}>
            {/* Status bar */}
            <div className="h-7 bg-foreground text-background flex items-center justify-between px-5 text-[10px] font-semibold">
              <span>09:41</span>
              <span className="flex items-center gap-1"><Smartphone className="size-3" /> medicentro.cv</span>
              <span>100%</span>
            </div>

            {/* Header */}
            <div className="px-5 py-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-[var(--primary-glow)] grid place-items-center">
                  <HeartPulse className="size-4 text-primary-foreground" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">Medicentro</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Marcar consulta</div>
                </div>
              </div>
              {!done && (
                <span className="text-[10px] font-semibold text-muted-foreground">Passo {step}/4</span>
              )}
            </div>

            {/* Progress bar */}
            {!done && (
              <div className="h-1 bg-muted">
                <div className="h-full bg-gradient-to-r from-primary to-[var(--primary-glow)] transition-all" style={{ width: `${step * 25}%` }} />
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {done ? (
                <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in">
                  <div className="size-20 rounded-full bg-success/15 grid place-items-center mb-4">
                    <Check className="size-10 text-success" />
                  </div>
                  <h3 className="text-xl font-bold">Consulta marcada!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Enviámos a confirmação por SMS para <strong>{phone}</strong>.</p>
                  <div className="mt-6 w-full rounded-xl border bg-muted/30 p-4 text-left text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Especialidade</span><span className="font-semibold">{spec?.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Profissional</span><span className="font-semibold">{doctor}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Data</span><span className="font-semibold">{day} · {time}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Unidade</span><span className="font-semibold">{unit === "sede" ? "Sede (Madeiralzinho)" : "Monte Sossego"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Convénio</span><span className="font-semibold">{insurance}</span></div>
                  </div>
                  <button onClick={reset} className="mt-6 text-sm font-semibold text-primary hover:underline">Marcar outra consulta</button>
                </div>
              ) : step === 1 ? (
                <>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">Olá 👋 O que precisa hoje?</h3>
                    <p className="text-xs text-muted-foreground mt-1">Escolha a especialidade. Sem login, sem chamada.</p>
                  </div>
                  <div className="flex gap-2 p-1 bg-muted rounded-lg text-[11px] font-semibold">
                    <button onClick={() => setUnit("sede")} className={`flex-1 py-1.5 rounded-md transition ${unit === "sede" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                      Sede · Madeiralzinho
                    </button>
                    <button onClick={() => setUnit("monte")} className={`flex-1 py-1.5 rounded-md transition ${unit === "monte" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                      Monte Sossego
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {specialties.map((s) => {
                      const Icon = s.icon;
                      const sel = spec?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => { setSpec(s); setDoctor(null); }}
                          className={`text-left rounded-xl border p-3 transition ${sel ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/40 hover:bg-muted/40"}`}
                        >
                          <div className={`size-9 rounded-lg grid place-items-center mb-2 ${sel ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                            <Icon className="size-4" />
                          </div>
                          <div className="text-[13px] font-semibold leading-tight">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{s.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">Quando lhe dá jeito?</h3>
                    <p className="text-xs text-muted-foreground mt-1">Escolha profissional, dia e hora.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Profissional</div>
                    {(doctorsBySpec[spec!.id] || []).map((d) => (
                      <button
                        key={d.name}
                        onClick={() => setDoctor(d.name)}
                        className={`w-full text-left rounded-xl border p-3 flex items-center gap-3 transition ${doctor === d.name ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}
                      >
                        <div className="size-9 rounded-full bg-accent grid place-items-center text-accent-foreground text-xs font-bold">
                          {d.name.split(" ").slice(-2).map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold">{d.name}</div>
                          <div className="text-[10px] text-muted-foreground">{d.sub}</div>
                        </div>
                        {doctor === d.name && <Check className="size-4 text-primary" />}
                      </button>
                    ))}
                  </div>

                  {doctor && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Dia</div>
                      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                        {days.map((d) => {
                          const sel = day === d.key;
                          return (
                            <button
                              key={d.key}
                              onClick={() => setDay(d.key)}
                              className={`shrink-0 w-14 py-2 rounded-xl border text-center transition ${sel ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/40"}`}
                            >
                              <div className="text-[10px] uppercase font-semibold opacity-80">{d.weekday}</div>
                              <div className="text-base font-bold leading-none mt-0.5">{d.day}</div>
                              <div className="text-[9px] opacity-70">{d.month}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {doctor && day && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Hora disponível</div>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map(({ t, free }) => (
                          <button
                            key={t}
                            disabled={!free}
                            onClick={() => setTime(t)}
                            className={`py-2 rounded-lg text-sm font-semibold border transition ${
                              !free ? "bg-muted/40 text-muted-foreground/40 line-through cursor-not-allowed border-dashed" :
                              time === t ? "bg-primary text-primary-foreground border-primary" :
                              "hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : step === 3 ? (
                <>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">Os seus dados</h3>
                    <p className="text-xs text-muted-foreground mt-1">Só precisamos do nome e contacto. Confirmação por SMS.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Nome completo</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Évora" className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Telemóvel</span>
                      <div className="mt-1 flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-muted text-sm font-semibold">+238</span>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9XX XX XX" className="flex-1 rounded-r-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Convénio / Seguro</span>
                      <select value={insurance} onChange={(e) => setInsurance(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>Particular</option>
                        <option>INPS</option>
                        <option>Garantia Seguros</option>
                        <option>IMPAR</option>
                        <option>BS Care</option>
                      </select>
                    </label>
                    <div className="rounded-lg bg-success/10 border border-success/20 p-3 text-[11px] text-success-foreground flex items-start gap-2">
                      <ShieldCheck className="size-4 text-success shrink-0 mt-0.5" />
                      Os seus dados são protegidos. RGPD · sem partilha com terceiros.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">Confirmar marcação</h3>
                    <p className="text-xs text-muted-foreground mt-1">Confira os dados antes de confirmar.</p>
                  </div>
                  <div className="rounded-xl border divide-y bg-card">
                    {[
                      { l: "Especialidade", v: spec?.name, i: spec?.icon },
                      { l: "Profissional", v: doctor, i: User },
                      { l: "Data e hora", v: `${day} · ${time}`, i: Calendar },
                      { l: "Unidade", v: unit === "sede" ? "Sede · Madeiralzinho" : "Monte Sossego", i: MapPin },
                      { l: "Paciente", v: name, i: User },
                      { l: "Contacto", v: `+238 ${phone}`, i: Smartphone },
                      { l: "Convénio", v: insurance, i: ShieldCheck },
                    ].map(({ l, v, i: Ic }) => (
                      <div key={l} className="flex items-center gap-3 px-4 py-3">
                        <div className="size-7 rounded-md bg-primary/10 grid place-items-center text-primary">
                          <Ic className="size-3.5" />
                        </div>
                        <div className="flex-1 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{l}</div>
                        <div className="text-[13px] font-semibold text-right">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-[11px] flex items-start gap-2">
                    <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                    Ao confirmar, recebe SMS com QR de check-in para o quiosque.
                  </div>
                </>
              )}
            </div>

            {/* Bottom action */}
            {!done && (
              <div className="p-4 border-t bg-card flex items-center gap-2">
                {step > 1 && (
                  <button onClick={() => setStep((s) => s - 1)} className="size-11 rounded-xl border grid place-items-center hover:bg-muted">
                    <ChevronLeft className="size-4" />
                  </button>
                )}
                <button
                  disabled={!canNext}
                  onClick={() => (step === 4 ? setDone(true) : setStep((s) => s + 1))}
                  className="flex-1 h-11 rounded-xl font-semibold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition hover:opacity-90"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {step === 4 ? <>Confirmar marcação <Check className="size-4" /></> : <>Continuar <ChevronRight className="size-4" /></>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side info */}
        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
              <Sparkles className="size-4" /> Experiência do paciente
            </div>
            <h4 className="mt-2 font-semibold">4 passos. Sem chamadas.</h4>
            <ol className="mt-3 space-y-2.5 text-sm">
              {["Escolher especialidade", "Profissional, dia e hora", "Dados de contacto", "Confirmar e receber SMS"].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className={`size-6 rounded-full grid place-items-center text-[11px] font-bold ${step > i + 1 || done ? "bg-success text-white" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {step > i + 1 || done ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className={step === i + 1 ? "font-semibold" : "text-muted-foreground"}>{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-accent to-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
              <Clock className="size-4" /> Tempo médio
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">52s</span>
              <span className="text-xs text-muted-foreground">por marcação</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">90% dos pacientes concluem sem ajuda. Compatível com WhatsApp e PWA.</p>
          </div>

          <div className="rounded-xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h4 className="font-semibold text-sm">Integração</h4>
            <ul className="mt-2 text-xs text-muted-foreground space-y-1.5">
              <li className="flex justify-between"><span>Anti-overbooking</span><span className="text-success font-semibold">Activo</span></li>
              <li className="flex justify-between"><span>SMS confirmação</span><span className="text-success font-semibold">Activo</span></li>
              <li className="flex justify-between"><span>QR para quiosque</span><span className="text-success font-semibold">Activo</span></li>
              <li className="flex justify-between"><span>Lembrete 24h antes</span><span className="text-success font-semibold">Activo</span></li>
            </ul>
            <Link to="/agendamentos" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
              Ver agenda interna →
            </Link>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

export default MarcacaoOnlinePage;