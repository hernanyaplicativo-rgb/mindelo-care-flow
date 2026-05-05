import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Mic, FileAudio, FileText, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ditado")({
  head: () => ({
    meta: [
      { title: "Ditado Clínico por IA — Urgimed" },
      { name: "description", content: "Assistente de transcrição de voz para médicos da Urgimed." },
    ],
  }),
  component: DitadoPage,
});

function DitadoPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setTranscription("Paciente do sexo feminino, 34 anos. Queixa principal: dor abdominal aguda no quadrante inferior direito, iniciada há cerca de 12 horas, acompanhada de náuseas e um episódio de êmese. Ao exame físico, apresenta sinal de Blumberg positivo. Temperatura: 38.2ºC. \n\nHipótese diagnóstica: Apendicite aguda.\nConduta: Encaminhada para ecografia abdominal de urgência e solicitados marcadores inflamatórios (Hemograma e PCR). Preparo para possível abordagem laparoscópica no bloco operatório.");
      }, 2000);
    } else {
      setIsRecording(true);
      setTranscription("");
    }
  };

  return (
    <DashboardLayout title="Ditado Clínico Inteligente" subtitle="Assistente de Voz para Prontuário Eletrónico (EMR)">
      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Gravação */}
        <div className="rounded-xl border bg-card p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary/10 grid place-items-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">IA Médica Urgimed</span>
          </div>

          <button 
            onClick={handleRecord}
            className={`mt-6 size-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative ${isRecording ? 'bg-red-500 scale-110 shadow-red-500/30' : 'bg-gradient-to-tr from-primary to-[var(--primary-glow)] hover:scale-105 shadow-primary/30'}`}
          >
            {isRecording && <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-ping" />}
            <Mic className={`size-12 text-white ${isRecording ? 'animate-pulse' : ''}`} />
          </button>
          
          <h3 className="text-xl font-bold mt-8">
            {isRecording ? "A Ouvir..." : "Pressione para Ditar"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Fale naturalmente. A IA da Urgimed vai estruturar os sintomas, diagnóstico e plano de tratamento formatando com a terminologia médica correta.
          </p>

          {isProcessing && (
            <div className="mt-6 flex items-center gap-2 text-primary font-medium">
              <Loader2 className="size-5 animate-spin" /> Processando áudio e formatando...
            </div>
          )}
        </div>

        {/* Resultado */}
        <div className="rounded-xl border bg-card shadow-sm flex flex-col">
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="size-4 text-primary" /> Prontuário Estruturado
            </h4>
            {transcription && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                <CheckCircle2 className="size-3" /> IA Finalizada
              </span>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            {!transcription && !isProcessing && (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/50">
                <FileAudio className="size-16 mb-4" />
                <p className="text-sm">O texto processado aparecerá aqui</p>
              </div>
            )}
            
            {transcription && (
              <div className="flex-1">
                <textarea 
                  className="w-full h-full min-h-[300px] bg-transparent border-none resize-none focus:outline-none text-sm leading-relaxed"
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                />
              </div>
            )}

            <button 
              disabled={!transcription}
              className="mt-6 w-full py-3 rounded-xl text-primary-foreground font-bold shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
            >
              Salvar no Ficheiro do Paciente
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default DitadoPage;
