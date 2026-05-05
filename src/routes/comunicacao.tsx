import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { MessageCircle, BellRing, Smartphone, CheckCircle2, Clock, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/comunicacao")({
  head: () => ({
    meta: [
      { title: "WhatsApp & SMS — Urgimed" },
      { name: "description", content: "Automação de comunicações via WhatsApp para a clínica Urgimed." },
    ],
  }),
  component: ComunicacaoPage,
});

const automations = [
  { title: "Lembrete de Consulta (24h antes)", active: true, channel: "WhatsApp" },
  { title: "Lembrete de Jejum para Exames", active: true, channel: "WhatsApp" },
  { title: "Aviso de Exame Disponível no Portal", active: true, channel: "SMS / WhatsApp" },
  { title: "Aviso de Retorno de Consulta", active: false, channel: "WhatsApp" },
];

function ComunicacaoPage() {
  const [phone, setPhone] = useState("+238 987 65 43");
  const [simulatedMsg, setSimulatedMsg] = useState(false);

  const triggerSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatedMsg(true);
    setTimeout(() => setSimulatedMsg(false), 4000);
  };

  return (
    <DashboardLayout title="WhatsApp & SMS" subtitle="Automação de Contacto com Utentes">
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl">
        
        {/* Painel de Automação */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-full bg-green-500/10 grid place-items-center">
                <MessageCircle className="size-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Central WhatsApp Business</h3>
                <p className="text-sm text-muted-foreground">Conectado (+238 9** ** **)</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
                <span className="size-2 rounded-full bg-success animate-pulse" /> Ativo
              </span>
            </div>

            <h4 className="font-semibold mb-3">Automações Ativas</h4>
            <div className="space-y-3">
              {automations.map((auto, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-3">
                    {auto.active ? (
                      <CheckCircle2 className="size-5 text-success" />
                    ) : (
                      <Clock className="size-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{auto.title}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{auto.channel}</p>
                    </div>
                  </div>
                  <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full">
                    <div className={`h-5 w-9 rounded-full transition-colors ${auto.active ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                    <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${auto.active ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simulador Mobile */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center bg-gradient-to-br from-accent/20 to-card relative overflow-hidden">
          <h3 className="font-semibold mb-6 w-full text-left flex items-center gap-2">
            <Smartphone className="size-5 text-primary" /> Teste de Envio (Receita Digital)
          </h3>
          
          <form onSubmit={triggerSimulation} className="w-full max-w-sm mb-6 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nº de Telemóvel do Utente</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90">
              <Send className="size-4" /> Enviar Receita via WhatsApp
            </button>
          </form>

          {/* Smartphone Mockup */}
          <div className="w-[280px] h-[400px] border-[8px] border-foreground rounded-[2rem] bg-[#efeae2] relative shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#075e54] p-3 flex items-center gap-2 text-white">
              <div className="size-8 rounded-full bg-white/20 grid place-items-center shrink-0">
                <span className="font-bold text-xs">UH</span>
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-sm">Urgimed Health</div>
                <div className="text-[10px] opacity-80">Conta comercial confirmada</div>
              </div>
            </div>
            
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div className="bg-white p-2 rounded-xl rounded-tl-none shadow-sm text-sm w-[85%] text-slate-800">
                Olá Marie, a sua consulta com o <strong>Dr. Júlio Wahnon</strong> terminou.
                <div className="mt-2 text-xs text-slate-500">14:30</div>
              </div>
              
              <div className={`bg-white p-2 rounded-xl rounded-tl-none shadow-sm text-sm w-[90%] text-slate-800 transition-all duration-500 ${simulatedMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                A sua <strong>Receita Médica Digital</strong> já está disponível.
                <br/><br/>
                Para baixar o PDF assinado ou aceder aos seus exames, clique no link do seu Portal MyUrgimed:
                <a href="#" className="text-blue-500 underline mt-1 block">urgimed.cv/portal/m-dubois</a>
                <div className="mt-2 text-xs text-slate-500 flex justify-end">Agora</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ComunicacaoPage;
