import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Calendar, Clock, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/agendamentos")({
  head: () => ({
    meta: [
      { title: "Agendamentos VIP — Urgimed" },
      { name: "description", content: "Agendamento VIP de odontologia e especialidades em Mindelo." },
    ],
  }),
  component: AgendamentosPage,
});

const slots = [
  { time: "09:00", available: true, vip: true },
  { time: "09:30", available: false, vip: true },
  { time: "10:00", available: true, vip: true },
  { time: "10:30", available: true, vip: false },
  { time: "11:00", available: false, vip: true },
  { time: "11:30", available: true, vip: true },
  { time: "14:00", available: true, vip: true },
  { time: "14:30", available: true, vip: false },
  { time: "15:00", available: false, vip: true },
  { time: "15:30", available: true, vip: true },
];

function AgendamentosPage() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <DashboardLayout title="Agendamentos VIP" subtitle="Odontologia · Anti-conflito ativo">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-card border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Dr. Almeida — Odontologia VIP</h3>
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                <Calendar className="size-3" /> Quarta, 5 de maio · Medicentro
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
              <Lock className="size-3" /> Trigger SQL ativo
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {slots.map(s => {
              const isSel = selected === s.time;
              return (
                <button
                  key={s.time}
                  disabled={!s.available}
                  onClick={() => setSelected(s.time)}
                  className={`relative rounded-lg border p-3 text-sm transition ${
                    !s.available ? "bg-muted text-muted-foreground line-through cursor-not-allowed border-dashed" :
                    isSel ? "bg-primary text-primary-foreground border-primary" :
                    "bg-card hover:border-primary hover:text-primary"
                  }`}
                >
                  <Clock className="size-3 inline mr-1" />
                  {s.time}
                  {s.vip && s.available && <Sparkles className="size-3 absolute top-1 right-1 text-primary" />}
                </button>
              );
            })}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-accent/40 border text-xs text-muted-foreground">
            <strong className="text-foreground">Bloqueio inteligente:</strong> Horários riscados estão reservados ou bloqueados (schedule_blocks). Trigger PostgreSQL impede dupla marcação para o mesmo profissional/período.
          </div>
        </div>

        <div className="rounded-xl border p-6 bg-gradient-to-br from-accent/40 to-card" style={{ boxShadow: "var(--shadow-card)" }}>
          <h4 className="font-semibold">Confirmação VIP</h4>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm">
              <div><span className="text-muted-foreground text-xs">Paciente</span><div className="font-medium">Marie Dubois</div></div>
              <div><span className="text-muted-foreground text-xs">Hotel</span><div className="font-medium">Foya Branca Resort</div></div>
              <div><span className="text-muted-foreground text-xs">Especialidade</span><div className="font-medium">Odontologia VIP</div></div>
              <div><span className="text-muted-foreground text-xs">Horário</span><div className="font-bold text-lg text-primary">{selected}</div></div>
              <button className="w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                Confirmar Agendamento
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Selecione um horário disponível.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}