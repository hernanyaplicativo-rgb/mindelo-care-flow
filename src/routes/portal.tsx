import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { FileText, Download, UserCircle, Activity, Calendar, Share2 } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Portal do Paciente MyUrgimed" },
      { name: "description", content: "Área segura do paciente com resultados de exames e histórico clínico." },
    ],
  }),
  component: PortalPage,
});

const historico = [
  { date: "12 Mai 2026", type: "Consulta Presencial", specialty: "Clínica Geral", doctor: "Dr. Júlio Wahnon", status: "Concluída" },
  { date: "15 Abr 2026", type: "Exame", specialty: "Raio X", doctor: "Téc. Radiologia", status: "Concluída" },
  { date: "02 Mar 2026", type: "Consulta Domiciliar", specialty: "Médico no Lar", doctor: "Enf. João Neves", status: "Concluída" },
];

const resultados = [
  { date: "15 Abr 2026", exam: "Raio X Torácico", status: "Disponível", icon: FileText },
  { date: "10 Jan 2026", exam: "Análises Clínicas (Rotina)", status: "Disponível", icon: FileText },
];

function PortalPage() {
  return (
    <DashboardLayout title="Portal do Paciente — MyUrgimed" subtitle="Visualização em Modo Utente">
      <div className="max-w-5xl space-y-6">
        
        {/* Patient Profile Header */}
        <div className="rounded-2xl border bg-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
          <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <UserCircle className="size-10 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-display">Marie Dubois</h2>
            <p className="text-sm text-muted-foreground mt-1">ID Urgimed: #URG-8472-A | Foya Branca Resort</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider bg-success/15 text-success px-2.5 py-1 rounded-full">
                Garantia Seguros Ativo
              </span>
              <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                Alergia: Penicilina
              </span>
            </div>
          </div>
          <button className="rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors shadow-sm whitespace-nowrap">
            Atualizar Perfil
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resultados de Exames */}
          <div className="rounded-xl border bg-card flex flex-col shadow-sm">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="size-4 text-primary" /> Resultados de Exames
                </h3>
                <p className="text-xs text-muted-foreground">Laudos médicos e imagens</p>
              </div>
            </div>
            <div className="p-5 flex-1">
              <div className="space-y-3">
                {resultados.map(r => (
                  <div key={r.exam} className="group rounded-lg border p-3 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-accent grid place-items-center">
                        <r.icon className="size-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{r.exam}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="size-8 rounded-full bg-muted grid place-items-center hover:bg-primary/20 hover:text-primary" title="Compartilhar">
                        <Share2 className="size-3.5" />
                      </button>
                      <button className="size-8 rounded-full bg-muted grid place-items-center hover:bg-primary/20 hover:text-primary" title="Fazer Download PDF">
                        <Download className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground">O seu próximo exame (Ecografia 3D) aparecerá aqui após o laudo médico.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico Clínico */}
          <div className="rounded-xl border bg-card flex flex-col shadow-sm">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="size-4 text-primary" /> Histórico Clínico
                </h3>
                <p className="text-xs text-muted-foreground">Linha do tempo de atendimentos</p>
              </div>
            </div>
            <div className="p-5 flex-1">
              <div className="relative border-l border-muted-foreground/20 ml-3 space-y-6 pb-4">
                {historico.map((h, i) => (
                  <div key={i} className="relative pl-6">
                    <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-semibold text-sm">{h.type}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{h.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{h.specialty} · {h.doctor}</p>
                      <button className="text-xs font-semibold text-primary mt-2 hover:underline">Ver Receita Médica</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default PortalPage;
