import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Siren, Phone, MapPin, Heart, AlertTriangle, CheckCircle2, Ambulance, Clock, ShieldAlert, Navigation, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "SOS · Emergência — Medicentro" },
      { name: "description", content: "Acionamento rápido de emergência médica com geolocalização e tempo de resposta em tempo real." },
    ],
  }),
  component: SosPage,
});

const FIRST_AID = [
  { step: "Mantenha a calma", detail: "Respire fundo. Não desligue até a equipa chegar." },
  { step: "Avalie a consciência", detail: "Chame a vítima. Verifique respiração." },
  { step: "Não mova a vítima", detail: "Salvo perigo iminente (fogo, trânsito)." },
  { step: "Compressões torácicas", detail: "100–120/min, 5 cm profundidade, se não respira." },
  { step: "Pressione hemorragias", detail: "Pano limpo + pressão direta firme." },
];

const CONTACTS = [
  { label: "Bombeiros · 132", number: "132", color: "bg-red-500" },
  { label: "Polícia Nacional · 132", number: "132", color: "bg-blue-500" },
  { label: "Medicentro 24h", number: "+238 232 1234", color: "bg-primary" },
  { label: "INEM Cabo Verde", number: "130", color: "bg-orange-500" },
];

function SosPage() {
  const [activated, setActivated] = useState(false);
  const [eta, setEta] = useState(8 * 60); // seconds
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    if (!activated) return;
    const t = setInterval(() => setEta((e) => Math.max(0, e - 1)), 1000);
    return () => clearInterval(t);
  }, [activated]);

  useEffect(() => {
    if (!activated) return;
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => setCoords({ lat: 16.8866, lng: -24.9879 }), // Mindelo fallback
      );
    } else {
      setCoords({ lat: 16.8866, lng: -24.9879 });
    }
  }, [activated]);

  // Hold-to-activate (3 seconds)
  useEffect(() => {
    if (activated || holdProgress === 0) return;
    if (holdProgress >= 100) {
      setActivated(true);
      return;
    }
    const t = setTimeout(() => setHoldProgress((p) => Math.min(100, p + 4)), 100);
    return () => clearTimeout(t);
  }, [holdProgress, activated]);

  const fmtEta = `${Math.floor(eta / 60).toString().padStart(2, "0")}:${(eta % 60).toString().padStart(2, "0")}`;

  return (
    <DashboardLayout title="SOS · Emergência" subtitle="Acionamento rápido com geolocalização">
      <div className="grid lg:grid-cols-3 gap-6 max-w-[1400px]">
        {/* Big SOS button */}
        <div className={`lg:col-span-2 rounded-3xl p-8 lg:p-12 relative overflow-hidden border transition-colors ${activated ? "bg-destructive text-destructive-foreground border-destructive" : "bg-card"}`} style={{ boxShadow: "var(--shadow-elegant)" }}>
          {!activated && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.62_0.22_25/0.12),transparent_60%)] pointer-events-none" />
          )}

          {!activated ? (
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-bold uppercase tracking-widest border border-destructive/20">
                <ShieldAlert className="size-3" /> Acionamento Médico de Emergência
              </div>
              <h2 className="mt-4 text-2xl lg:text-4xl font-bold tracking-tight">Em caso de emergência</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">Mantenha pressionado o botão por 3 segundos. A equipa Medicentro será notificada com a sua localização GPS.</p>

              <button
                onMouseDown={() => setHoldProgress(1)}
                onMouseUp={() => setHoldProgress(0)}
                onMouseLeave={() => setHoldProgress(0)}
                onTouchStart={() => setHoldProgress(1)}
                onTouchEnd={() => setHoldProgress(0)}
                className="mt-10 relative size-56 lg:size-64 rounded-full bg-destructive text-destructive-foreground grid place-items-center font-black text-2xl shadow-[0_20px_60px_-10px_oklch(0.62_0.22_25/0.6)] active:scale-95 transition-transform select-none"
              >
                <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-20" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <Siren className="size-14" />
                  <span>SOS</span>
                  <span className="text-[10px] font-semibold opacity-80 tracking-widest uppercase">Pressione 3s</span>
                </div>
                {holdProgress > 0 && (
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="3" fill="none" strokeDasharray={`${holdProgress * 3.01} 301`} strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                <span className="size-2 rounded-full bg-white animate-pulse" /> Emergência ativada
              </div>
              <h2 className="mt-3 text-3xl lg:text-5xl font-black tracking-tight">Equipa a caminho</h2>
              <p className="mt-2 opacity-90 text-sm">A ambulância da Clínica Sede foi despachada. Mantenha o telemóvel próximo.</p>

              <div className="mt-8 grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/20">
                  <div className="text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-1"><Clock className="size-3" /> ETA</div>
                  <div className="mt-1 text-3xl font-black tabular-nums">{fmtEta}</div>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/20">
                  <div className="text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-1"><Ambulance className="size-3" /> Veículo</div>
                  <div className="mt-1 text-sm font-bold">Medicentro AMB-02</div>
                  <div className="text-[11px] opacity-80">Dr. Júlio Wahnon · Enf. Rosa</div>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/20">
                  <div className="text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-1"><MapPin className="size-3" /> Sua localização</div>
                  <div className="mt-1 text-[13px] font-bold tabular-nums">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "A obter GPS…"}
                  </div>
                  <div className="text-[11px] opacity-80">Mindelo · São Vicente</div>
                </div>
              </div>

              <button onClick={() => { setActivated(false); setEta(8 * 60); setHoldProgress(0); }} className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 border border-white/25 text-xs font-bold hover:bg-white/25 transition-colors">
                Cancelar acionamento (falso alarme)
              </button>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick contacts */}
          <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><Phone className="size-4 text-primary" /> Contactos Rápidos</h3>
            <div className="space-y-2">
              {CONTACTS.map((c) => (
                <a key={c.label} href={`tel:${c.number.replace(/\s/g, "")}`} className="flex items-center justify-between p-3 rounded-xl border bg-background hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`size-9 rounded-full ${c.color} text-white grid place-items-center shrink-0`}>
                      <Phone className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{c.label}</div>
                      <div className="text-[11px] text-muted-foreground tabular-nums">{c.number}</div>
                    </div>
                  </div>
                  <Navigation className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Medical ID */}
          <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold">
              <Heart className="size-3" /> ID Médico (partilhado com socorristas)
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="size-12 rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] grid place-items-center text-primary-foreground"><User className="size-5" /></div>
              <div>
                <div className="font-bold text-sm">Dr. Hernâni</div>
                <div className="text-[11px] text-muted-foreground">Tipo sanguíneo: O+ · 42 anos</div>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-[12px]">
              <li className="flex justify-between"><span className="text-muted-foreground">Alergias</span><span className="font-semibold">Penicilina</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Crónicos</span><span className="font-semibold">Hipertensão</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Medicação</span><span className="font-semibold">Losartan 50mg</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Contacto SOS</span><span className="font-semibold">Maria · 9914 5577</span></li>
            </ul>
          </div>
        </div>

        {/* First aid - full width */}
        <div className="lg:col-span-3 rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-4 text-warning" />
            <h3 className="font-bold text-sm">Enquanto espera — Primeiros Socorros</h3>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {FIRST_AID.map((s, i) => (
              <li key={s.step} className="rounded-xl border bg-background p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-7 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">{i + 1}</span>
                  <CheckCircle2 className="size-4 text-success ml-auto" />
                </div>
                <div className="text-sm font-bold leading-tight">{s.step}</div>
                <div className="text-[11px] text-muted-foreground leading-snug">{s.detail}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SosPage;