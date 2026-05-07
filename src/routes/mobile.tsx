import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { QrCode, CreditCard, Info, Sparkles, Activity, FileText, ChevronRight, Loader2, CheckCircle2, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile")({
  head: () => ({
    meta: [
      { title: "Quiosque de Autoatendimento — Medicentro" },
      { name: "description", content: "Módulo de quiosque para check-in, pagamentos e informações na Medicentro." },
    ],
  }),
  component: QuiosquePage,
});

function QuiosquePage() {
  const [activeScreen, setActiveScreen] = useState<"home" | "payment" | "info" | "checkin_auth" | "checkin_form" | "checkin_success">("home");
  
  // Check-in state
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryId.trim()) return;
    
    setIsValidating(true);
    // Simulate Supabase/API validation
    setTimeout(() => {
      setIsValidating(false);
      setPatientName("Carlos Silva (Titular)"); // Mocked user
      setActiveScreen("checkin_form");
    }, 1500);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) return;
    
    setIsSubmitting(true);
    // Simulate Supabase save
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveScreen("checkin_success");
      
      // Reset after success
      setTimeout(() => {
        setActiveScreen("home");
        setBeneficiaryId("");
        setComplaint("");
      }, 5000);
    }, 1500);
  };

  return (
    <DashboardLayout title="Módulo Quiosque" subtitle="Interface Tablet · Autoatendimento Medicentro">
      <div className="flex flex-col items-center max-w-4xl mx-auto h-[calc(100vh-8rem)] justify-center">
        
        {/* Tablet Frame */}
        <div className="w-full max-w-[800px] h-[600px] rounded-[2rem] border-[12px] border-foreground bg-background overflow-hidden relative shadow-2xl flex flex-col">
          {/* Top Bar Tablet */}
          <div className="h-10 bg-muted flex items-center justify-between px-6 border-b shrink-0">
            <span className="text-xs font-semibold">14:30</span>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Medicentro Quiosque</span>
            </div>
            <span className="text-xs font-semibold">100%</span>
          </div>

          {/* Screen Content */}
          <div className="flex-1 bg-card/50 relative overflow-y-auto flex flex-col p-8 custom-scrollbar">
            
            {activeScreen === "home" && (
              <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-300 justify-center">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold font-display">Bem-vindo à Medicentro</h2>
                  <p className="text-muted-foreground mt-2 font-medium">Toque na opção desejada para iniciar o seu atendimento</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                  <button onClick={() => setActiveScreen("checkin_auth")} className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group">
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <Activity className="size-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Triagem (Sem Marcação)</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Para urgências 24h ou consultas no dia</p>
                  </button>

                  <button className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <QrCode className="size-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Check-in QR Code</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Aproxime o código da sua consulta ou do Hotel</p>
                  </button>

                  <button onClick={() => setActiveScreen("payment")} className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group">
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <CreditCard className="size-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Pagamentos & Faturas</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Liquidar taxas moderadoras ou INPS</p>
                  </button>

                  <button onClick={() => setActiveScreen("info")} className="rounded-2xl border bg-card p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all shadow-md group">
                    <div className="size-16 rounded-full bg-primary/10 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <Info className="size-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Preparo de Exames</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Consultar requisitos (Jejum, etc)</p>
                  </button>
                </div>
              </div>
            )}

            {/* FLOW: CHECK-IN AUTH */}
            {activeScreen === "checkin_auth" && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <button onClick={() => setActiveScreen("home")} className="text-sm font-bold text-primary mb-6 hover:underline flex items-center gap-1 w-fit">
                  ← Voltar ao Início
                </button>
                <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center">
                  <div className="size-20 rounded-full bg-primary/10 grid place-items-center mb-6">
                    <UserCheck className="size-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Identificação do Utente</h2>
                  <p className="text-muted-foreground mb-8 text-sm">Insira o seu número de Beneficiário (INPS) ou Nº de CNI para iniciarmos o atendimento.</p>
                  
                  <form onSubmit={handleValidateBeneficiary} className="w-full space-y-4">
                    <input 
                      autoFocus
                      disabled={isValidating}
                      value={beneficiaryId}
                      onChange={e => setBeneficiaryId(e.target.value)}
                      placeholder="Ex: 123456789" 
                      className="w-full h-14 text-center text-xl tracking-widest font-bold border-2 rounded-2xl bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                    />
                    <button 
                      disabled={isValidating || !beneficiaryId}
                      className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-primary/20"
                    >
                      {isValidating ? <Loader2 className="size-6 animate-spin" /> : "Validar e Continuar"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* FLOW: CHECK-IN COMPLAINT FORM */}
            {activeScreen === "checkin_form" && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <button onClick={() => setActiveScreen("home")} className="text-sm font-bold text-primary mb-6 hover:underline flex items-center gap-1 w-fit">
                  ← Cancelar
                </button>
                <div className="flex-1 flex flex-col max-w-xl mx-auto w-full">
                  <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="size-12 rounded-full bg-primary/10 grid place-items-center shrink-0">
                      <UserCheck className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Bem-vindo(a), {patientName}</h3>
                      <p className="text-xs text-muted-foreground">INPS: {beneficiaryId}</p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">Qual é o motivo da sua visita?</h2>
                  <p className="text-muted-foreground mb-6 text-sm">Descreva os seus sintomas para que a nossa equipa médica prepare a sua triagem.</p>
                  
                  <form onSubmit={handleSubmitComplaint} className="w-full space-y-4 flex-1 flex flex-col">
                    <textarea 
                      autoFocus
                      disabled={isSubmitting}
                      value={complaint}
                      onChange={e => setComplaint(e.target.value)}
                      placeholder="Ex: Tenho dor forte no peito e falta de ar desde as 10h da manhã..." 
                      className="w-full flex-1 min-h-[150px] p-4 text-base border-2 rounded-2xl bg-background resize-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                    />
                    <button 
                      disabled={isSubmitting || !complaint}
                      className="w-full h-14 shrink-0 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-primary/20"
                    >
                      {isSubmitting ? <Loader2 className="size-6 animate-spin" /> : "Enviar para a Enfermagem"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* FLOW: CHECK-IN SUCCESS */}
            {activeScreen === "checkin_success" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 max-w-md mx-auto w-full">
                <div className="size-24 rounded-full bg-success/10 flex items-center justify-center mb-6 shadow-inner border border-success/20">
                  <CheckCircle2 className="size-12 text-success" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-foreground">Recebido com Sucesso!</h2>
                <p className="text-muted-foreground text-base mb-8">
                  Os seus sintomas foram enviados para a nossa equipa. Por favor, <strong>aguarde na sala de espera</strong> até ser chamado pelo ecrã.
                </p>
                <div className="bg-muted px-6 py-3 rounded-xl border border-dashed font-mono font-bold text-lg text-foreground mb-8">
                  Senha: <span className="text-primary">MZ-{Math.floor(Math.random() * 900) + 100}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">A regressar ao menu inicial...</p>
              </div>
            )}

            {/* Existing screens */}
            {activeScreen === "payment" && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <button onClick={() => setActiveScreen("home")} className="text-sm font-bold text-primary mb-6 hover:underline flex items-center gap-1 w-fit">
                  ← Voltar ao Início
                </button>
                <div className="max-w-xl mx-auto w-full">
                  <h2 className="text-2xl font-bold mb-6">Pagamento de Taxa Moderadora</h2>
                  <div className="rounded-2xl border bg-card p-6 shadow-md mb-6" style={{ boxShadow: "var(--shadow-card)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="size-6 text-primary" />
                      <div>
                        <p className="font-bold">Consulta Clínica Geral</p>
                        <p className="text-xs font-medium text-muted-foreground">Paciente: Marie Dubois (Urgimed Hospitality)</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-4 border-y border-dashed my-4">
                      <span className="text-sm font-semibold">Valor Consulta</span>
                      <span className="font-bold">3.500 CVE</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-black">
                      <span>Total a Pagar</span>
                      <span className="text-primary text-2xl">3.500 CVE</span>
                    </div>
                  </div>
                  <button className="w-full rounded-2xl py-4 font-bold text-lg text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 shadow-xl shadow-primary/20 hover:scale-105 transition-all" style={{ background: "var(--gradient-primary)" }}>
                    <CreditCard className="size-6" /> Inserir Cartão Vinti4
                  </button>
                </div>
              </div>
            )}

            {activeScreen === "info" && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <button onClick={() => setActiveScreen("home")} className="text-sm font-bold text-primary mb-6 hover:underline flex items-center gap-1 w-fit">
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
                      <div key={item.e} className="rounded-2xl border bg-card p-5 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
                        <div>
                          <p className="font-bold">{item.e}</p>
                          <p className="text-sm font-medium text-muted-foreground mt-1">{item.i}</p>
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
          <div className="h-6 bg-card flex justify-center pb-2 shrink-0 border-t bg-muted/10">
            <div className="w-32 h-1.5 rounded-full bg-foreground/20 mt-2" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default QuiosquePage;