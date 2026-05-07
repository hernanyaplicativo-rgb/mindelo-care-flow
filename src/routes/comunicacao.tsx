import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { MessageCircle, BellRing, Smartphone, CheckCircle2, Clock, Send, FileText, Calendar as CalIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/comunicacao")({
  head: () => ({
    meta: [
      { title: "WhatsApp & SMS — Medicentro" },
      { name: "description", content: "Automação de comunicações via WhatsApp para a clínica Medicentro." },
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

type Template = 'receita' | 'lembrete' | 'retorno';

function ComunicacaoPage() {
  const [phone, setPhone] = useState("+238 ");
  const [patient, setPatient] = useState("");
  const [template, setTemplate] = useState<Template>('receita');
  const [simulatedMsg, setSimulatedMsg] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const triggerSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if(!patient || !phone) return;
    
    setSimulatedMsg(false);
    setIsSending(true);
    
    setTimeout(() => {
      setIsSending(false);
      setSimulatedMsg(true);
      setTimeout(() => setSimulatedMsg(false), 8000);
    }, 1000);
  };

  const renderMessage = () => {
    const nome = patient || "[Nome do Utente]";
    if (template === 'receita') {
      return (
        <>
          A sua <strong>Receita Médica Digital</strong> já está disponível.
          <br/><br/>
          Para baixar o PDF assinado ou aceder aos seus exames, clique no link do seu Portal Medicentro:
          <a href="#" className="text-blue-500 underline mt-1 block">medicentro.cv/portal/{nome.toLowerCase().replace(/\s/g,'')}</a>
        </>
      );
    }
    if (template === 'lembrete') {
      return (
        <>
          Olá {nome}, lembramos que tem uma consulta marcada para <strong>Amanhã às 10:30</strong> com o Dr. Júlio Wahnon.
          <br/><br/>
          Por favor, chegue com 15 minutos de antecedência.
        </>
      );
    }
    if (template === 'retorno') {
      return (
        <>
          Olá {nome}, os resultados dos seus exames já foram recebidos.
          <br/><br/>
          Por favor, ligue para a recepção ou acesse o Portal para agendar o seu retorno gratuito.
        </>
      );
    }
  };

  return (
    <DashboardLayout title="Comunicação c/ Utente" subtitle="WhatsApp & SMS Business">
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl">
        
        {/* Painel de Automação */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <MessageCircle className="size-6 text-[#25D366]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">API WhatsApp Business</h3>
                <p className="text-sm font-medium text-muted-foreground">Conectado (+238 9** ** **)</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success bg-success/10 px-3 py-1.5 rounded-full">
                <span className="size-2 rounded-full bg-success animate-pulse" /> Ativo
              </span>
            </div>

            <h4 className="font-bold text-sm mb-4">Automações Ativas no Sistema</h4>
            <div className="space-y-2">
              {automations.map((auto, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    {auto.active ? (
                      <CheckCircle2 className="size-5 text-success" />
                    ) : (
                      <Clock className="size-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-bold text-sm text-foreground">{auto.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{auto.channel}</p>
                    </div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${auto.active ? 'bg-success' : 'bg-muted-foreground/30'}`}>
                    <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${auto.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simulador Mobile */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col items-center relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <h3 className="font-bold text-lg w-full text-left flex items-center gap-2 mb-6 relative z-10">
            <Smartphone className="size-5 text-primary" /> Envio Manual (Receção)
          </h3>
          
          <form onSubmit={triggerSimulation} className="w-full max-w-sm mb-8 space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setTemplate('receita')} className={`p-3 rounded-xl border text-left transition-all ${template === 'receita' ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}>
                <FileText className="size-4 mb-2" />
                <div className="text-xs font-bold">Enviar Receita</div>
              </button>
              <button type="button" onClick={() => setTemplate('lembrete')} className={`p-3 rounded-xl border text-left transition-all ${template === 'lembrete' ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}>
                <CalIcon className="size-4 mb-2" />
                <div className="text-xs font-bold">Lembrete</div>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Nome do Paciente</label>
                <input value={patient} onChange={e => setPatient(e.target.value)} placeholder="Ex: Marie Dubois" className="mt-1 w-full rounded-xl border bg-background px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Nº WhatsApp</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border bg-background px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <button 
              disabled={isSending || !patient || !phone}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
            >
              {isSending ? <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Send className="size-4" />} 
              {isSending ? 'A enviar...' : 'Disparar Mensagem'}
            </button>
          </form>

          {/* Smartphone Mockup */}
          <div className="w-[300px] h-[450px] border-[10px] border-foreground rounded-[2.5rem] bg-[#efeae2] relative shadow-2xl flex flex-col overflow-hidden z-10 shrink-0 transform transition-transform hover:-translate-y-2">
            <div className="bg-[#075e54] p-4 flex items-center gap-3 text-white">
              <div className="size-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="font-bold text-sm text-[#075e54]">MC</span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[15px]">Medicentro</div>
                <div className="text-[11px] font-medium opacity-90 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Conta comercial
                </div>
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-3 flex-1 overflow-hidden" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: 'cover', opacity: 0.9 }}>
              
              <div className={`bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-[13px] w-[90%] text-slate-800 leading-relaxed transition-all duration-500 transform ${simulatedMsg ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                {renderMessage()}
                <div className="mt-2 text-[10px] text-slate-500 flex justify-end font-medium">Agora</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ComunicacaoPage;
