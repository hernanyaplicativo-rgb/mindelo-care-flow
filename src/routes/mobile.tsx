import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { QrCode, Smartphone, Hotel, Sparkles } from "lucide-react";

export const Route = createFileRoute("/mobile")({
  head: () => ({
    meta: [
      { title: "Fluxo Mobile QR — Urgimed" },
      { name: "description", content: "QR code do hotel para triagem mobile do turista." },
    ],
  }),
  component: MobilePage,
});

function MobilePage() {
  return (
    <DashboardLayout title="Fluxo Mobile · QR Code" subtitle="Hotel → Turista → Triagem IA">
      <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl">
        <div className="rounded-xl bg-card border p-8 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
            <Hotel className="size-4" /> Recepção do Hotel
          </div>
          <h3 className="mt-3 font-semibold">QR Code do Hotel</h3>
          <p className="text-xs text-muted-foreground mt-1">Pré-preenche "Urgimed Hospitality Guest"</p>
          <div className="mt-6 mx-auto size-56 rounded-2xl border-4 border-foreground p-4 bg-background">
            <div className="size-full grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={Math.random() > 0.5 ? "bg-foreground" : "bg-background"} />
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Escaneie com a câmara do telemóvel</p>
        </div>

        <div>
          <div className="mx-auto w-72 rounded-[2.5rem] border-8 border-foreground bg-background p-3 shadow-2xl">
            <div className="rounded-[1.75rem] overflow-hidden bg-gradient-to-b from-accent/30 to-card border">
              <div className="px-5 py-6" style={{ background: "var(--gradient-primary)" }}>
                <div className="text-primary-foreground/80 text-[10px] uppercase tracking-widest">Urgimed</div>
                <div className="text-primary-foreground font-bold text-lg">Triagem Turista</div>
              </div>
              <div className="p-5 space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground">Hotel Origem</label>
                  <div className="mt-1 rounded bg-muted px-2 py-2 font-medium flex items-center gap-1">
                    <Hotel className="size-3 text-primary" /> Urgimed Hospitality Guest
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground">Sintomas</label>
                  <div className="mt-1 rounded border bg-background px-2 py-2 text-muted-foreground">Descreva...</div>
                </div>
                <button className="w-full rounded-lg py-2 text-xs font-semibold text-primary-foreground inline-flex items-center justify-center gap-1" style={{ background: "var(--gradient-primary)" }}>
                  <Sparkles className="size-3" /> Analisar com IA
                </button>
                <div className="pt-2 border-t">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Horários VIP livres</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["09:00","10:00","11:30","14:00","15:30"].map(t => (
                      <div key={t} className="rounded bg-accent text-accent-foreground py-1 text-center font-medium">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-card border p-5 text-sm" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Smartphone className="size-4" /> Como funciona
            </div>
            <ol className="mt-3 space-y-2 text-xs text-muted-foreground list-decimal list-inside">
              <li>Turista escaneia o QR no balcão do hotel</li>
              <li>Formulário pré-preenche o hotel de origem</li>
              <li>IA analisa sintomas e sugere especialidade</li>
              <li>Sistema mostra apenas horários VIP livres (sem conflitos)</li>
            </ol>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}