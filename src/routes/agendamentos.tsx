import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Calendar, Clock, Lock, Sparkles, Stethoscope, Microscope, Search } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/agendamentos")({
  head: () => ({
    meta: [
      { title: "Agendamento Inteligente — Urgimed" },
      { name: "description", content: "Sistema centralizado de agendamentos para Clínica e Health Hospitality." },
    ],
  }),
  component: AgendamentosPage,
});

type Category = "Consultas" | "Exames" | "Domicílio";

const professionals = [
  { name: "Dr. Júlio Wahnon", specialty: "Clínica Geral", category: "Consultas" },
  { name: "Dra. Alicia Wahnon", specialty: "Clínica Geral", category: "Consultas" },
  { name: "Dr. Lucien Attier", specialty: "Cirurgia Geral", category: "Consultas" },
  { name: "Dr. Ernesto Hernandes", specialty: "Cirurgia Geral", category: "Consultas" },
  { name: "Dr. Fernando Lopes", specialty: "Cardiologia", category: "Consultas" },
  { name: "Dra. Carlina da Luz Santos", specialty: "Pediatria", category: "Consultas" },
  { name: "Dra. Mª Teresa Martins", specialty: "Ginecologia / Obstetrícia", category: "Consultas" },
  { name: "Dr. Paulo Semedo Freire", specialty: "Ortopedia", category: "Consultas" },
  
  { name: "Ecografia 3D/4D", specialty: "Imagem (Aparelho Ultrassonografia)", category: "Exames" },
  { name: "Raio X", specialty: "Imagem (Sala Plomada)", category: "Exames" },
  { name: "Prova de Esforço", specialty: "Cardiologia (Passadeira Ergonômica)", category: "Exames" },
  { name: "Endoscopia Digestiva Alta", specialty: "Endoscopia (Torre & Recobro)", category: "Exames" },

  { name: "Enfermagem (Suturas/Pensos)", specialty: "Médico no Lar", category: "Domicílio" },
  { name: "Vacinação / Soroterapia", specialty: "Médico no Lar", category: "Domicílio" },
];

// Gera slots dinâmicos baseados no horário da clínica (08:00 - 22:00)
const generateSlots = () => {
  const slots = [];
  const hourStart = 8;
  const hourEnd = 22;
  
  for (let h = hourStart; h < hourEnd; h++) {
    slots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3, express: Math.random() > 0.8 });
    slots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: Math.random() > 0.3, express: Math.random() > 0.8 });
  }
  return slots;
};

function AgendamentosPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Consultas");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof professionals[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Memoizamos os slots para não recalcular a cada render
  const currentSlots = useMemo(() => generateSlots(), [selectedItem]);

  const filteredItems = professionals.filter(p => 
    p.category === activeCategory && 
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout title="Agendamento Inteligente" subtitle="Clínica Sede · Alocação de Recursos e Especialistas">
      <div className="grid lg:grid-cols-3 gap-6 max-w-7xl">
        
        {/* Painel Esquerdo: Seleção de Especialidade/Exame */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2 bg-muted/40 p-1 rounded-xl border">
            {["Consultas", "Exames", "Domicílio"].map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat as Category); setSelectedItem(null); setSelectedTime(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeCategory === cat ? "bg-background shadow-sm border text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar médico ou exame..."
              className="w-full bg-card border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="rounded-xl border bg-card overflow-hidden h-[500px] flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-4 border-b bg-muted/20">
              <h3 className="font-semibold text-sm">Diretório Urgimed</h3>
            </div>
            <div className="overflow-y-auto p-2 space-y-1 flex-1">
              {filteredItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => { setSelectedItem(item); setSelectedTime(null); }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedItem?.name === item.name 
                      ? "bg-primary/5 border-primary/30" 
                      : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium text-sm flex items-center justify-between">
                    {item.name}
                    {activeCategory === "Exames" && <Microscope className="size-3.5 text-primary" />}
                    {activeCategory === "Consultas" && <Stethoscope className="size-3.5 text-primary" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{item.specialty}</div>
                </button>
              ))}
              {filteredItems.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhum resultado encontrado.</div>
              )}
            </div>
          </div>
        </div>

        {/* Painel Direito: Slots de Tempo e Confirmação */}
        <div className="lg:col-span-2 space-y-6">
          {selectedItem ? (
            <div className="rounded-xl bg-card border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                    <Calendar className="size-4 text-primary" /> Segunda a Sexta · 08:00 às 22:00
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  <Lock className="size-3" /> Anti-conflito (Recurso)
                </span>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-end mb-4">
                  <h4 className="text-sm font-semibold">Horários Disponíveis (Hoje)</h4>
                  <div className="flex items-center gap-3 text-[10px] uppercase font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1"><div className="size-2 bg-card border rounded-full"></div> Livre</span>
                    <span className="flex items-center gap-1"><div className="size-2 bg-muted border-dashed border rounded-full"></div> Ocupado</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {currentSlots.map(s => {
                    const isSel = selectedTime === s.time;
                    return (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setSelectedTime(s.time)}
                        className={`relative rounded-lg border py-2.5 text-sm font-medium transition ${
                          !s.available ? "bg-muted/50 text-muted-foreground/50 border-dashed cursor-not-allowed" :
                          isSel ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" :
                          "bg-card hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeCategory === "Exames" && (
                <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning-foreground flex items-start gap-3">
                  <Lock className="size-4 shrink-0 text-warning mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Dependência de Equipamento</strong>
                    O agendamento de <em>{selectedItem.name}</em> reserva simultaneamente o equipamento {selectedItem.specialty} na base de dados, prevenindo overbooking da máquina.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-card border h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground p-6">
              <Calendar className="size-12 mb-4 opacity-20" />
              <p>Selecione um profissional ou exame no painel esquerdo</p>
              <p className="text-xs mt-2 text-center max-w-sm">
                O sistema Urgimed garante que médicos e recursos físicos (como salas de Raio-X ou blocos cirúrgicos) não sofram duplo agendamento.
              </p>
            </div>
          )}

          {/* Checkout Block */}
          {selectedTime && selectedItem && (
            <div className="rounded-xl border p-5 bg-gradient-to-r from-accent/30 via-card to-card flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Resumo do Agendamento</p>
                <p className="font-semibold mt-1">{selectedItem.name}</p>
                <p className="text-sm text-primary font-bold">Hoje às {selectedTime}</p>
              </div>
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-md" style={{ background: "var(--gradient-primary)" }}>
                Confirmar Marcação
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AgendamentosPage;