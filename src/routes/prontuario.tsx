import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { FileHeart, Search, Pill, Activity, Stethoscope, ClipboardList, Mic, PenTool, Save, History, FileText, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/prontuario")({
  head: () => ({
    meta: [
      { title: "Prontuário Eletrónico — Medicentro" },
      { name: "description", content: "Histórico clínico unificado dos pacientes." },
    ],
  }),
  component: ProntuarioPage,
});

const patients = [
  { id: 1, name: "Maria Évora", age: 42, doc: "1234567", insurance: "INPS", risk: "Hipertensa", bloodType: "O+", allergies: "Penicilina" },
  { id: 2, name: "João Silva", age: 58, doc: "8765432", insurance: "Garantia", risk: "Diabético tipo 2", bloodType: "A-", allergies: "Nenhuma" },
  { id: 3, name: "Ana Tavares", age: 7, doc: "5552233", insurance: "IMPAR", risk: "Asma leve", bloodType: "B+", allergies: "Poeira, Ácaros" },
  { id: 4, name: "Pedro Lima", age: 31, doc: "4445566", insurance: "Particular", risk: "—", bloodType: "AB+", allergies: "Nenhuma" },
];

const history = [
  { id: 1, d: "2026-05-02", t: "Consulta · Cardiologia", who: "Dr. Fernando Lopes", note: "Paciente refere palpitações eventuais. TA 145/95. ECG sem alterações agudas. Ajuste de losartan para 50mg/dia. Retorno em 30 dias.", type: "consulta" },
  { id: 2, d: "2026-04-18", t: "Resultados de Análises", who: "Lab. Medicentro", note: "Glicemia em jejum: 132mg/dl (Alta). HbA1c: 6.8%. Colesterol Total: 190mg/dl.", type: "exame" },
  { id: 3, d: "2026-03-10", t: "Ecografia Abdominal", who: "Imagiologia", note: "Fígado com dimensões e ecogenicidade normais. Vesícula biliar sem cálculos. Sem alterações significativas nos demais órgãos.", type: "exame" },
  { id: 4, d: "2025-12-04", t: "Triagem de Urgência", who: "Manchester · Amarelo", note: "Queixa principal: Cefaleia intensa de início súbito há 2h. Sinais vitais estáveis. Resolução com analgesia EV.", type: "triagem" },
];

import { useRole } from "@/hooks/useRole";
import { Settings2, Sliders, Thermometer, Droplets, Heart } from "lucide-react";

function ProntuarioPage() {
  const { currentRole } = useRole();
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [thresholds, setThresholds] = useState({
    glucoseHigh: "126 mg/dL",
    bloodPressureHigh: "140/90 mmHg",
    heartRateMax: "100 bpm",
    feverStart: "37.5 ºC"
  });

  const [sel, setSel] = useState(patients[0]);
// ...
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("historia");
  const [isRecording, setIsRecording] = useState(false);
  const [clinicalNote, setClinicalNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.doc.includes(q));

  const handleSaveNote = () => {
    if (!clinicalNote.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setClinicalNote("");
      setActiveTab("historia"); // Switch to history tab to simulate saving
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setClinicalNote(prev => prev + (prev ? " " : "") + "Paciente apresenta melhora do quadro clínico após introdução da nova medicação. Nega dispneia ou dores precordiais. ");
        setIsRecording(false);
      }, 3000);
    }
  };

  useEffect(() => {
    setClinicalNote("");
    setIsRecording(false);
  }, [sel.id]);

  return (
    <DashboardLayout title="Prontuário Eletrónico" subtitle="Gestão clínica e evolução do paciente">
      <div className="grid lg:grid-cols-[340px_1fr] gap-6 max-w-[1400px]">
        {/* Sidebar */}
        <aside className="rounded-2xl border bg-card/50 backdrop-blur-sm p-4 space-y-4 h-[calc(100vh-8rem)] flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Buscar paciente ou nº doc…" 
              className="w-full bg-background/80 border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm" 
            />
          </div>
          
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Meus Pacientes (Hoje)
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {filtered.map((p) => (
              <button 
                key={p.id} 
                onClick={() => setSel(p)} 
                className={`w-full text-left rounded-xl p-3 border transition-all duration-300 relative overflow-hidden group ${
                  sel.id === p.id 
                    ? "border-primary/50 bg-primary/5 shadow-sm" 
                    : "border-transparent hover:bg-muted/50 hover:border-border/50"
                }`}
              >
                {sel.id === p.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-in slide-in-from-left" />
                )}
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    sel.id === p.id ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-accent text-accent-foreground group-hover:bg-primary/10"
                  }`}>
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <span>{p.age}a</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span>{p.insurance}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <section className="space-y-6 flex flex-col h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar pb-6">
          
          {/* Manager Clinical Config */}
          {currentRole === 'admin' && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary shadow-sm">
                  <Sliders className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Configuração Clínica (Gerente)</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Definir limites de alerta do sistema</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingThresholds(!isEditingThresholds)}
                className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                {isEditingThresholds ? "Fechar Painel" : "Ajustar Limiares"}
              </button>
            </div>
          )}

          {isEditingThresholds && currentRole === 'admin' && (
            <div className="rounded-2xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-300 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { l: "Glicemia Alerta", v: thresholds.glucoseHigh, k: 'glucoseHigh', i: Droplets },
                { l: "Tensão Alerta", v: thresholds.bloodPressureHigh, k: 'bloodPressureHigh', i: Heart },
                { l: "Febre Início", v: thresholds.feverStart, k: 'feverStart', i: Thermometer },
                { l: "FC Máxima", v: thresholds.heartRateMax, k: 'heartRateMax', i: Activity },
              ].map(({ l, v, k, i: I }) => (
                <div key={k} className="p-3 rounded-xl bg-muted/40 border">
                  <div className="flex items-center gap-2 mb-2">
                    <I className="size-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{l}</span>
                  </div>
                  <input 
                    value={v}
                    onChange={(e) => setThresholds({...thresholds, [k]: e.target.value})}
                    className="w-full bg-background border rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Header */}
          <div className="rounded-2xl border bg-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden group" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            
            <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-[var(--primary-glow)] flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20 shrink-0">
              {sel.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            
            <div className="flex-1 space-y-3 z-10">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{sel.name}</h2>
                {sel.risk !== "—" && (
                  <span className="text-xs uppercase font-bold tracking-wider bg-destructive/10 text-destructive px-2.5 py-1 rounded-full border border-destructive/20 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {sel.risk}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><span className="font-medium text-foreground">{sel.age}</span> anos</div>
                <div className="flex items-center gap-1.5"><span className="text-foreground">Doc:</span> {sel.doc}</div>
                <div className="flex items-center gap-1.5"><span className="text-foreground">Convênio:</span> {sel.insurance}</div>
                <div className="flex items-center gap-1.5"><span className="text-foreground">Sangue:</span> <span className="font-medium text-destructive">{sel.bloodType}</span></div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { i: Activity, l: "Sinais Vitais", v: "120/80 mmHg", s: "Última há 2h", c: "text-blue-500", bg: "bg-blue-500/10" },
              { i: Pill, l: "Medicação", v: "3 Ativos", s: "Ver lista", c: "text-emerald-500", bg: "bg-emerald-500/10" },
              { i: ClipboardList, l: "Alergias", v: sel.allergies, s: "Atenção", c: sel.allergies !== "Nenhuma" ? "text-destructive" : "text-muted-foreground", bg: sel.allergies !== "Nenhuma" ? "bg-destructive/10" : "bg-muted" },
              { i: FileText, l: "Exames", v: "2 Pendentes", s: "Em breve", c: "text-amber-500", bg: "bg-amber-500/10" },
            ].map(({ i: I, l, v, s, c, bg }) => (
              <div key={l} className="rounded-2xl border bg-card p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors group cursor-pointer" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <I className={`size-4 ${c}`} />
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">{l}</div>
                  <div className="font-semibold text-foreground mt-0.5 truncate">{v}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 truncate">{s}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Editor/History Tabs */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex gap-1 border-b pb-px">
              {[
                { id: "nova-nota", label: "Nova Evolução", icon: PenTool },
                { id: "historia", label: "Histórico Clínico", icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Note Editor Tab */}
            {activeTab === "nova-nota" && (
              <div className="rounded-2xl border bg-card p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col flex-1" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <PenTool className="size-4 text-primary" />
                    Evolução Médica
                  </h3>
                  
                  <button 
                    onClick={toggleRecording}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                      isRecording 
                        ? "bg-destructive/15 text-destructive animate-pulse ring-2 ring-destructive/30" 
                        : "bg-background border hover:bg-muted"
                    }`}
                  >
                    <Mic className={`size-3.5 ${isRecording ? 'text-destructive' : 'text-primary'}`} />
                    {isRecording ? "Gravando (Ditado)..." : "Ditado por Voz"}
                  </button>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    value={clinicalNote}
                    onChange={(e) => setClinicalNote(e.target.value)}
                    placeholder="Digite a evolução do paciente ou utilize o Ditado por Voz para transcrever automaticamente..."
                    className="w-full h-full min-h-[250px] resize-none bg-muted/30 border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all leading-relaxed shadow-inner"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t mt-auto">
                  <button 
                    onClick={handleSaveNote}
                    disabled={!clinicalNote.trim() || isSaving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                  >
                    {isSaving ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    ) : (
                      <Save className="size-4" />
                    )}
                    {isSaving ? "Salvando..." : "Assinar e Salvar"}
                  </button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "historia" && (
              <div className="rounded-2xl border bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ boxShadow: "var(--shadow-card)" }}>
                <ol className="divide-y divide-border/50">
                  {history.map((h) => (
                    <li key={h.id} className="p-5 flex gap-4 hover:bg-muted/20 transition-colors group">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 border-2 border-background shadow-sm ${
                          h.type === 'consulta' ? 'bg-blue-500/10 text-blue-500' :
                          h.type === 'exame' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {h.type === 'consulta' && <Stethoscope className="size-4" />}
                          {h.type === 'exame' && <FileText className="size-4" />}
                          {h.type === 'triagem' && <Activity className="size-4" />}
                        </div>
                        <div className="w-px h-full bg-border group-last:hidden" />
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-semibold text-sm text-foreground">{h.t}</div>
                          <div className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md border">{h.d}</div>
                        </div>
                        <div className="text-xs text-primary font-medium mb-2">{h.who}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                          {h.note}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ProntuarioPage;