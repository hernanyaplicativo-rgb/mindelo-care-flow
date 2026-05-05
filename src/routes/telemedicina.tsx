import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Video, Mic, MicOff, VideoOff, PhoneMissed, Users, Settings, Activity } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/telemedicina")({
  head: () => ({
    meta: [
      { title: "Telemedicina — Urgimed" },
      { name: "description", content: "Consultas por vídeo na Urgimed Mindelo." },
    ],
  }),
  component: TelemedicinaPage,
});

function TelemedicinaPage() {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <DashboardLayout title="Centro de Telemedicina" subtitle="Consultas Remotas · Médico no Lar">
      <div className="max-w-6xl space-y-6">
        
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 grid place-items-center">
              <Video className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Sala Virtual de Atendimento</h3>
              <p className="text-sm text-muted-foreground">Dr. Júlio Wahnon — Próxima consulta em 5 min</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-xs font-semibold">
              <Users className="size-3" /> Fila: 2 pacientes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-xs font-semibold">
              <span className="size-2 rounded-full bg-success animate-pulse" /> Servidor WebRTC Online
            </span>
          </div>
        </div>

        {/* Video Interface Area */}
        <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
          
          {/* Main Video View */}
          <div className="lg:col-span-3 rounded-2xl border bg-black relative overflow-hidden shadow-xl flex flex-col">
            {!inCall ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card/5">
                <div className="size-24 rounded-full bg-muted/20 border-2 border-muted grid place-items-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Paciente" className="size-20 rounded-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Marie Dubois</h2>
                <p className="text-slate-400">Hotel Foya Branca — Triagem: Laranja (Muito Urgente)</p>
                <button 
                  onClick={() => setInCall(true)}
                  className="mt-8 px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 hover:scale-105 transition-transform bg-green-600"
                >
                  Admitir na Sala Virtual
                </button>
              </div>
            ) : (
              <>
                {/* Simulated Patient Video */}
                <div className="absolute inset-0 bg-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" 
                    alt="Patient Stream" 
                    className={`size-full object-cover transition-opacity duration-500 ${videoOn ? 'opacity-70' : 'opacity-10 blur-xl'}`}
                  />
                  {!videoOn && (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-white flex flex-col items-center gap-3">
                        <div className="size-20 rounded-full bg-slate-800 grid place-items-center">
                          <VideoOff className="size-8" />
                        </div>
                        <span className="font-medium">O paciente pausou o vídeo</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-semibold text-white">GRAVANDO SESSÃO (ENCRIPTADO)</span>
                  </div>
                </div>

                {/* Simulated Doctor Picture-in-Picture */}
                <div className="absolute bottom-24 right-6 w-48 aspect-[3/4] rounded-xl border-2 border-primary overflow-hidden shadow-2xl bg-black">
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop" className="size-full object-cover opacity-90" />
                  <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/50 px-2 rounded">Dr. Júlio Wahnon</div>
                </div>

                {/* Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setMicOn(!micOn)}
                    className={`size-12 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                  </button>
                  <button 
                    onClick={() => setVideoOn(!videoOn)}
                    className={`size-12 rounded-full flex items-center justify-center transition-colors ${videoOn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {videoOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
                  </button>
                  <button className="size-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Settings className="size-5" />
                  </button>
                  <button 
                    onClick={() => setInCall(false)}
                    className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 text-white font-bold ml-4 transition-colors"
                  >
                    <PhoneMissed className="size-5" /> Encerrar
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Side Panel: Clinical Context */}
          <div className="rounded-2xl border bg-card flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-muted/20">
              <h4 className="font-semibold text-sm">Prontuário Rápido</h4>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Motivo da Consulta (Triagem)</div>
                <div className="mt-1 text-sm bg-orange-500/10 text-orange-600 p-2 rounded-lg border border-orange-500/20 font-medium flex items-start gap-2">
                  <Activity className="size-4 shrink-0 mt-0.5" />
                  Dor forte no peito e suor frio (Triagem: Laranja - Muito Urgente)
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Anotações da Sessão</div>
                <textarea 
                  className="w-full h-32 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="Escreva as anotações clínicas aqui. O ditado por voz da IA será inserido automaticamente."
                />
              </div>
              <button className="w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <Mic className="size-4" /> Iniciar Ditado IA
              </button>
            </div>
            <div className="p-4 border-t bg-muted/10">
              <button className="w-full rounded-lg py-2 text-sm font-semibold text-primary-foreground shadow-md" style={{ background: "var(--gradient-primary)" }}>
                Gerar Receita / Exames
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default TelemedicinaPage;
