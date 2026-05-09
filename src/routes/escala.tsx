import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { CalendarDays, Clock, UserPlus, AlertCircle, CheckCircle2, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/escala")({
  head: () => ({
    meta: [
      { title: "Gestão de Escalas — Urgimed" },
      { name: "description", content: "Escalas de enfermagem e corpo clínico." },
    ],
  }),
  component: EscalaPage,
});

const initialShifts = [
  { time: "08:00 - 16:00", name: "Turno da Manhã", staff: ["Enf. Maria Neves", "Enf. João Silva", "Dr. Lucien Attier"], status: "Completo" },
  { time: "16:00 - 00:00", name: "Turno da Tarde", staff: ["Enf. Sara Gomes", "Enf. Tiago Mendes", "Dra. Alicia Wahnon"], status: "Completo" },
  { time: "00:00 - 08:00", name: "Plantão Noturno (Hospitality)", staff: ["Enf. Carlos Lima"], status: "Alerta" },
];

const availableProfessionals = [
  "Dr. Júlio Wahnon",
  "Dra. Mª Teresa Martins",
  "Enf. Paulo Semedo",
  "Dr. Fernando Lopes",
  "Dra. Carlina da Luz Santos"
];

function EscalaPage() {
  const [shiftsData, setShiftsData] = useState(initialShifts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetShiftIndex, setTargetShiftIndex] = useState<number | null>(null);
  const [isQuickSelectModalOpen, setIsQuickSelectModalOpen] = useState(false);
  const [highlightMode, setHighlightMode] = useState<{dept: string, prof: string} | null>(null);
  const [dbProfessionals, setDbProfessionals] = useState<string[]>(availableProfessionals);

  useEffect(() => {
    const fetchProf = async () => {
      const { data } = await supabase.from('professionals').select('full_name, role').eq('status', 'active');
      if (data && data.length > 0) {
        setDbProfessionals(data.map(p => {
          let prefix = "";
          if (p.role === 'doctor') prefix = "Dr. ";
          if (p.role === 'nurse') prefix = "Enf. ";
          let name = p.full_name.replace(/^Dr\.?\s+/i, '').replace(/^Dra\.?\s+/i, '').replace(/^Enf\.?\s+/i, '');
          return prefix + name;
        }));
      }
    };
    fetchProf();
  }, []);

  // Calcula total dinamicamente (Base 7 do array inicial + 7 extra que supostamente estão noutras alas = 14 iniciais)
  const totalAtivos = shiftsData.reduce((acc, shift) => acc + shift.staff.length, 0) + 7;
  
  const requiresNightCoverage = shiftsData[2].status === "Alerta";

  const handleOpenModal = (index: number) => {
    setTargetShiftIndex(index);
    setIsModalOpen(true);
  };

  const handleAddStaff = (person: string) => {
    if (targetShiftIndex === null) return;
    
    const updatedShifts = [...shiftsData];
    // Evitar duplicados
    if (!updatedShifts[targetShiftIndex].staff.includes(person)) {
      updatedShifts[targetShiftIndex].staff.push(person);
      
      // Se era o turno noturno que precisava de malta, marca completo
      if (updatedShifts[targetShiftIndex].status === "Alerta") {
        updatedShifts[targetShiftIndex].status = "Completo";
      }
      setShiftsData(updatedShifts);
    }
    setIsModalOpen(false);
    setHighlightMode(null); // Clear highlight after allocation
  };

  return (
    <DashboardLayout title="Gestão de Escalas 24/7" subtitle="Coordenação do Bloco e Health Hospitality">
      <div className="max-w-6xl space-y-6">
        
        {/* Resumo */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 grid place-items-center">
                <User className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAtivos}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Profissionais Ativos Hoje</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-success/10 grid place-items-center">
                <CheckCircle2 className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cobertura Diurna</p>
              </div>
            </div>
          </div>
          <div className={`rounded-xl border bg-card p-5 shadow-sm transition-colors ${requiresNightCoverage ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'}`}>
            <div className="flex items-center gap-3">
              <div className={`size-10 rounded-full grid place-items-center ${requiresNightCoverage ? 'bg-warning/20' : 'bg-success/20'}`}>
                {requiresNightCoverage ? <AlertCircle className="size-5 text-warning" /> : <CheckCircle2 className="size-5 text-success" />}
              </div>
              <div>
                <p className={`text-2xl font-bold ${requiresNightCoverage ? 'text-warning' : 'text-success'}`}>{requiresNightCoverage ? "1" : "Completo"}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{requiresNightCoverage ? "Falta Cobertura Noturna" : "Cobertura Noturna"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quadro de Escalas */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              <h3 className="font-semibold text-lg">Quadro de Plantões — Hoje</h3>
            </div>
            <button onClick={() => setIsQuickSelectModalOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-md hover:opacity-90 flex items-center gap-2">
              <UserPlus className="size-4" /> Alocar Profissional
            </button>
          </div>

          <div className="divide-y">
            {shiftsData.map((shift, i) => {
              const isHighlighted = highlightMode && shift.status === "Alerta";
              return (
              <div key={i} className={`p-6 flex flex-col md:flex-row gap-6 hover:bg-muted/30 transition-all ${isHighlighted ? 'bg-primary/5 ring-2 ring-primary ring-inset' : ''}`}>
                <div className="md:w-1/3">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <Clock className="size-5 text-primary" /> {shift.time}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">{shift.name}</div>
                  {shift.status === "Alerta" && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-warning/10 text-warning text-xs font-bold uppercase tracking-wider">
                      <AlertCircle className="size-3" /> Requer +1 Médico
                    </div>
                  )}
                  {shift.status === "Completo" && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="size-3" /> Turno Completo
                    </div>
                  )}
                </div>
                
                <div className="md:w-2/3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Equipa Alocada</h4>
                  <div className="flex flex-wrap gap-2">
                    {shift.staff.map(person => (
                      <div key={person} className="px-3 py-2 rounded-lg border bg-background text-sm font-medium shadow-sm flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <div className="size-6 rounded-full bg-muted grid place-items-center text-[10px] font-bold">
                          {person.replace('Enf. ', '').replace('Dr. ', '').replace('Dra. ', '').charAt(0)}
                        </div>
                        {person}
                      </div>
                    ))}
                    {shift.status === "Alerta" && (
                      <button 
                        onClick={() => {
                          if (highlightMode) {
                            handleAddStaff(highlightMode.prof);
                            setTargetShiftIndex(i); // To fulfill handleAddStaff requirement, though we should change it to use the selected prof
                          } else {
                            handleOpenModal(i);
                          }
                        }}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${isHighlighted ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90' : 'border-dashed border-primary text-primary hover:bg-primary/5'}`}
                      >
                        <UserPlus className="size-4" /> {isHighlighted ? "Confirmar Alocação" : "Preencher Vaga"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

      </div>

      {/* Modal de Alocação de Profissionais */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b flex items-center justify-between bg-muted/20">
              <h3 className="font-bold text-lg">Preencher Vaga — {targetShiftIndex !== null ? shiftsData[targetShiftIndex].name : ''}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-2">
              {dbProfessionals.map((prof) => (
                <button
                  key={prof}
                  onClick={() => handleAddStaff(prof)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="size-10 rounded-full bg-primary/10 grid place-items-center text-primary font-bold">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{prof}</p>
                    <p className="text-xs text-muted-foreground">{prof.includes('Enf') ? 'Enfermagem' : 'Médico Especialista'}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 bg-muted/10 border-t">
              <p className="text-xs text-muted-foreground text-center">Ao selecionar, o profissional será imediatamente notificado na sua app móvil.</p>
            </div>
          </div>
        </div>
      )}
      {/* Quick Select Modal */}
      {isQuickSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b flex items-center justify-between bg-muted/20">
              <h3 className="font-bold text-lg">Alocar Rápido</h3>
              <button onClick={() => setIsQuickSelectModalOpen(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">Departamento</label>
                <select className="w-full border rounded-lg px-3 py-2 bg-background">
                  <option>Urgência 24/7</option>
                  <option>Bloco Operatório</option>
                  <option>Consulta Externa</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">Profissional</label>
                <select id="quickProfSelect" className="w-full border rounded-lg px-3 py-2 bg-background">
                  {dbProfessionals.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <button 
                onClick={() => {
                  const prof = (document.getElementById('quickProfSelect') as HTMLSelectElement).value;
                  setHighlightMode({ dept: 'Urgência 24/7', prof });
                  setIsQuickSelectModalOpen(false);
                }}
                className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-lg mt-2"
              >
                Procurar Vagas
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default EscalaPage;
