import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { QrCode, CreditCard, Info, Sparkles, Activity, FileText, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/mobile")({
  head: () => ({
    meta: [
      { title: "Quiosque de Autoatendimento — Urgimed" },
      { name: "description", content: "Módulo de quiosque para check-in, pagamentos e informações na Urgimed." },
    ],
  }),
  component: QuiosquePage,
});

function QuiosquePage() {
  const [activeScreen, setActiveScreen] = useState<"home" | "payment" | "info">("home");

  return (
    <DashboardLayout title="Módulo Quiosque" subtitle="Interface Tablet · Autoatendimento Urgimed">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        
        {/* Tablet Frame */}
        <div className="w-full max-w-[800px] aspect-[4/3] rounded-[2rem] border-[12px] border-foreground bg-background overflow-hidden relative shadow-2xl flex flex-col">
          {/* Top Bar Tablet */}
          <div className="h-10 bg-muted flex items-center justify-between px-6 border-b">
            <span className="text-xs font-semibold">14:30</span>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Urgimed Quiosque</span>
            </div>
            <span className="text-xs font-semibold">100%</span>
          </div>

          {/* Screen Content */}
          <div className="flex-1 bg-card/50 relative overflow-hidden flex flex-col p-8">
            
            {activeScreen === "home" && (
              <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold font-display">Bem-vindo à Urgimed</h2>
                  <p className="text-muted-foreground mt-2">Toque na opção desejada para iniciar o seu atendimento</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full flex-1">
                  <button onClick={() => window.location.href = '/triagem'} className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group">
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <Activity className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Triagem (Sem Marcação)</h3>
                    <p className="text-xs text-muted-foreground mt-2">Para urgências 24h ou consultas no dia</p>
                  </button>

                  <button className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <QrCode className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Check-in QR Code</h3>
                    <p className="text-xs text-muted-foreground mt-2">Aproxime o código da sua consulta ou do Hotel</p>
                  </button>

                  <button onClick={() => setActiveScreen("payment")} className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group">
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <CreditCard className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Pagamentos & Faturas</h3>
                    <p className="text-xs text-muted-foreground mt-2">Liquidar taxas moderadoras ou INPS</p>
                  </button>

                  <button onClick={() => setActiveScreen("info")} className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group">
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <Info className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Preparo de Exames</h3>
                    <p className="text-xs text-muted-foreground mt-2">Consultar requisitos (Jejum, etc)</p>
                  </button>
                </div>
              </div>
            )}

            {activeScreen === "payment" && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <button onClick={() => setActiveScreen("home")} className="text-sm font-semibold text-primary mb-6 hover:underline flex items-center gap-1">
                  ← Voltar ao Início
                </button>
                <div className="max-w-xl mx-auto w-full">
                  <h2 className="text-2xl font-bold mb-6">Pagamento de Taxa Moderadora</h2>
                  <div className="rounded-xl border bg-card p-6 shadow-md mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="size-6 text-primary" />
                      <div>
                        <p className="font-semibold">Consulta Clínica Geral</p>
                        <p className="text-xs text-muted-foreground">Paciente: Marie Dubois (Urgimed Hospitality)</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-y border-dashed my-4">
                      <span className="text-sm">Valor Consulta</span>
                      <span className="font-semibold">3.500 CVE</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total a Pagar</span>
                      <span className="text-primary">3.500 CVE</span>
                    </div>
                  </div>
                  <button className="w-full rounded-xl py-4 font-bold text-lg text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>
                    <CreditCard className="size-5" /> Inserir Cartão Vinti4
                  </button>
                </div>
              </div>
            )}

            {activeScreen === "info" && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <button onClick={() => setActiveScreen("home")} className="text-sm font-semibold text-primary mb-6 hover:underline flex items-center gap-1">
                  ← Voltar ao Início
                </button>
                <div className="max-w-2xl mx-auto w-full">
                  <h2 className="text-2xl font-bold mb-6">Informações de Preparo</h2>
                  <div className="space-y-4">
                    {[
                      { e: "Endoscopia Digestiva Alta", i: "Jejum absoluto de 8 horas. Comparecer com acompanhante. Suspender medicação antiácida." },
                      { e: "Ecografia Abdominal", i: "Jejum de 6 horas. Beber 4 copos de água 1 hora antes do exame (não urinar)." },
                      { e: "Análises Clínicas (Rotina)", i: "Jejum de 8 a 12 horas. Água permitida em pequenas quantidades." }
                    ].map(item => (
                      <div key={item.e} className="rounded-xl border bg-card p-4 flex items-center justify-between group cursor-pointer hover:border-primary">
                        <div>
                          <p className="font-semibold">{item.e}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.i}</p>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
          
          {/* Home Indicator */}
          <div className="h-6 bg-card flex justify-center pb-2">
            <div className="w-32 h-1.5 rounded-full bg-foreground/20" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default QuiosquePage;