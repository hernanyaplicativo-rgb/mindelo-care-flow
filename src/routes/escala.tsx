import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { CalendarDays, Clock, UserPlus, AlertCircle, CheckCircle2, User } from "lucide-react";

export const Route = createFileRoute("/escala")({
  head: () => ({
    meta: [
      { title: "Gestão de Escalas — Urgimed" },
      { name: "description", content: "Escalas de enfermagem e corpo clínico." },
    ],
  }),
  component: EscalaPage,
});

const shifts = [
  { time: "08:00 - 16:00", name: "Turno da Manhã", staff: ["Enf. Maria Neves", "Enf. João Silva", "Dr. Lucien Attier"], status: "Completo" },
  { time: "16:00 - 00:00", name: "Turno da Tarde", staff: ["Enf. Sara Gomes", "Enf. Tiago Mendes", "Dra. Alicia Wahnon"], status: "Completo" },
  { time: "00:00 - 08:00", name: "Plantão Noturno (Hospitality)", staff: ["Enf. Carlos Lima"], status: "Alerta" },
];

function EscalaPage() {
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
                <p className="text-2xl font-bold">14</p>
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
          <div className="rounded-xl border bg-card p-5 shadow-sm bg-warning/5 border-warning/20">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-warning/20 grid place-items-center">
                <AlertCircle className="size-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">1</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Falta Cobertura Noturna</p>
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
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-md hover:opacity-90 flex items-center gap-2">
              <UserPlus className="size-4" /> Alocar Profissional
            </button>
          </div>

          <div className="divide-y">
            {shifts.map((shift, i) => (
              <div key={i} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-muted/30 transition-colors">
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
                </div>
                
                <div className="md:w-2/3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Equipa Alocada</h4>
                  <div className="flex flex-wrap gap-2">
                    {shift.staff.map(person => (
                      <div key={person} className="px-3 py-2 rounded-lg border bg-background text-sm font-medium shadow-sm flex items-center gap-2">
                        <div className="size-6 rounded-full bg-muted grid place-items-center text-[10px] font-bold">
                          {person.charAt(0)}
                        </div>
                        {person}
                      </div>
                    ))}
                    {shift.status === "Alerta" && (
                      <button className="px-3 py-2 rounded-lg border border-dashed border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center gap-2">
                        <UserPlus className="size-4" /> Preencher Vaga
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default EscalaPage;
