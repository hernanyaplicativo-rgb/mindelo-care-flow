import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Video, Mic, MicOff, VideoOff, PhoneMissed, Users, Settings, Activity, Camera, Monitor, Play, User, Clock, AlertCircle, FileHeart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/telemedicina")({
  head: () => ({
    meta: [
      { title: "Telemedicina — Medicentro" },
      { name: "description", content: "Consultas por vídeo na Medicentro Mindelo." },
    ],
  }),
  component: TelemedicinaPage,
});

function TelemedicinaPage() {
  const { currentRole } = useRole();
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [patientWaiting, setPatientWaiting] = useState(true);

  // Doctor's View
  if (currentRole === 'admin' || currentRole === 'doctor') {
    return (
      <DashboardLayout title="Centro de Telemedicina" subtitle="Consultas Remotas · Médico no Lar">
        <div className="max-w-[1400px] space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-5 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Video className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Sala de Consulta Virtual</h3>
                <p className="text-xs text-muted-foreground font-medium">Médico: <span className="text-foreground">Dr. Júlio Wahnon</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-muted/50 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                <Users className="size-3.5 text-primary" /> Fila: 2 pacientes
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" /> WebRTC Ativo
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 h-[650px]">
            
            {/* Main Call View */}
            <div className="lg:col-span-3 rounded-3xl border bg-slate-950 relative overflow-hidden shadow-2xl flex flex-col group">
              {!inCall ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <div className="size-28 rounded-full bg-muted/10 border-4 border-muted/20 grid place-items-center mb-8 relative shadow-2xl">
                    <div className="absolute inset-[-8px] rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Paciente" className="size-24 rounded-full object-cover shadow-inner" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Marie Dubois</h2>
                  <p className="text-slate-400 font-medium max-w-sm">Aguardando no Hotel Foya Branca · Triagem Urgente (Laranja)</p>
                  
                  <div className="mt-10 flex gap-4">
                    <button className="px-6 py-3 rounded-xl font-bold text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-all text-sm">Visualizar Ficha</button>
                    <button 
                      onClick={() => setInCall(true)}
                      className="px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-primary/30 hover:scale-105 transition-all bg-primary flex items-center gap-2"
                    >
                      <Play className="size-4 fill-current" /> Iniciar Consulta
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" 
                      alt="Patient" 
                      className={`size-full object-cover transition-all duration-1000 ${videoOn ? 'opacity-100 scale-100' : 'opacity-20 blur-3xl scale-110'}`}
                    />
                    {!videoOn && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 animate-in fade-in duration-500">
                        <VideoOff className="size-16 mb-4 opacity-20" />
                        <span className="font-bold tracking-widest uppercase text-sm">Vídeo do Paciente Pausado</span>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                        <div className="size-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]" />
                        <span className="text-[10px] font-bold tracking-[0.15em] text-white uppercase">Sessão Segura (AES-256)</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">HD 1080p</div>
                    </div>
                  </div>

                  {/* Doctor PIP */}
                  <div className="absolute top-6 right-6 w-48 aspect-video rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl bg-black/40 backdrop-blur-md group-hover:scale-105 transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop" className="size-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[8px] font-bold text-white uppercase tracking-wider">Você (Dr. Júlio)</div>
                  </div>

                  {/* Call Controls */}
                  <div className="absolute bottom-8 inset-x-0 flex items-center justify-center gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl px-6 py-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
                      <button onClick={() => setMicOn(!micOn)} className={`size-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                        {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                      </button>
                      <button onClick={() => setVideoOn(!videoOn)} className={`size-12 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                        {videoOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
                      </button>
                      <button className="size-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
                        <Monitor className="size-5" />
                      </button>
                      <div className="w-px h-8 bg-white/10 mx-2" />
                      <button onClick={() => setInCall(false)} className="h-12 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/30">
                        <PhoneMissed className="size-5" /> Terminar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Doctor Sidebar Context */}
            <div className="rounded-3xl border bg-card flex flex-col overflow-hidden shadow-sm border-border/50">
              <div className="p-5 border-b bg-muted/20 flex items-center gap-2">
                <FileHeart className="size-4 text-primary" />
                <h4 className="font-bold text-sm tracking-tight">Contexto Clínico</h4>
              </div>
              <div className="p-5 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
                    <AlertCircle className="size-3 text-orange-500" /> Triagem Atual
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                    <p className="text-sm font-semibold text-orange-700 leading-snug">Dor retroesternal súbita irradiando para o braço esquerdo.</p>
                    <div className="mt-2 text-[10px] text-orange-600/70 font-bold uppercase tracking-wider">Risco: Elevado (Laranja)</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Anotações Rápida</div>
                  <textarea className="w-full h-40 rounded-2xl border bg-muted/30 p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed" placeholder="Anote aqui as observações críticas..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-border hover:bg-muted/50 transition-all group">
                    <Camera className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] mt-2 font-bold text-muted-foreground">Capturar</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-border hover:bg-muted/50 transition-all group">
                    <Mic className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] mt-2 font-bold text-muted-foreground">Ditado IA</span>
                  </button>
                </div>
              </div>
              <div className="p-5 border-t bg-muted/5">
                <button className="w-full py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Gerar Prescrição Digital
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Patient View
  return (
    <DashboardLayout title="Portal de Telemedicina" subtitle="Seu médico à distância de um clique">
      <div className="max-w-4xl mx-auto py-10">
        <div className="rounded-[2.5rem] border bg-card p-10 text-center space-y-8 relative overflow-hidden shadow-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="absolute -right-20 -top-20 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-inner">
              <Clock className="size-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Sala de Espera Virtual</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Olá, <span className="font-bold text-foreground">Marie Dubois</span>. O Dr. Júlio Wahnon está terminando um atendimento e chamará você em instantes.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative z-10">
            {[
              { l: "Posição na Fila", v: "2º", i: Users, c: "text-blue-500", bg: "bg-blue-500/10" },
              { l: "Tempo Estimado", v: "4 min", i: Clock, c: "text-orange-500", bg: "bg-orange-500/10" },
              { l: "Qualidade Conexão", v: "Excelente", i: Activity, c: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map(({ l, v, i: I, c, bg }) => (
              <div key={l} className="p-6 rounded-3xl border bg-muted/20 flex flex-col items-center gap-3">
                <div className={`p-2.5 rounded-xl ${bg}`}>
                  <I className={`size-5 ${c}`} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{l}</div>
                  <div className="text-xl font-bold">{v}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-muted/30 border border-dashed space-y-6 relative z-10">
            <h3 className="font-bold text-sm uppercase tracking-widest">Teste de Equipamento</h3>
            <div className="flex justify-center gap-10">
              <div className="flex flex-col items-center gap-3">
                <div className="size-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><Mic className="size-5" /></div>
                <span className="text-xs font-bold">Microfone OK</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="size-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><Camera className="size-5" /></div>
                <span className="text-xs font-bold">Câmera OK</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="size-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Monitor className="size-5" /></div>
                <span className="text-xs font-bold">Ecrã OK</span>
              </div>
            </div>
          </div>

          <div className="pt-4 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 text-primary font-bold text-sm animate-pulse">
              <div className="size-2 rounded-full bg-primary" />
              Aguardando o médico iniciar a sessão...
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
          Medicentro Telehealth · Encriptação Ponta-a-Ponta
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TelemedicinaPage;
