import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Calendar, Clock, Lock, Sparkles, Stethoscope, Microscope, Search, UserCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/agendamentos")({
  head: () => ({
    meta: [
      { title: "Agendamento Inteligente — Medicentro" },
      { name: "description", content: "Sistema centralizado de agendamentos para Clínica Medicentro." },
    ],
  }),
  component: AgendamentosPage,
});

type Category = "Consultas" | "Exames" | "Domicílio";

const professionals = [
  { id: 1, name: "Dr. Júlio Wahnon", specialty: "Clínica Geral", category: "Consultas" },
  { id: 2, name: "Dra. Alicia Wahnon", specialty: "Clínica Geral", category: "Consultas" },
  { id: 3, name: "Dr. Lucien Attier", specialty: "Cirurgia Geral", category: "Consultas" },
  { id: 4, name: "Dr. Ernesto Hernandes", specialty: "Cirurgia Geral", category: "Consultas" },
  { id: 5, name: "Dr. Fernando Lopes", specialty: "Cardiologia", category: "Consultas" },
  { id: 6, name: "Dra. Carlina da Luz Santos", specialty: "Pediatria", category: "Consultas" },
  { id: 7, name: "Dra. Mª Teresa Martins", specialty: "Ginecologia / Obstetrícia", category: "Consultas" },
  { id: 8, name: "Dr. Paulo Semedo Freire", specialty: "Ortopedia", category: "Consultas" },
  
  { id: 9, name: "Ecografia 3D/4D", specialty: "Imagem (Aparelho Ultrassonografia)", category: "Exames" },
  { id: 10, name: "Raio X", specialty: "Imagem (Sala Plomada)", category: "Exames" },
  { id: 11, name: "Prova de Esforço", specialty: "Cardiologia (Passadeira Ergonômica)", category: "Exames" },
  { id: 12, name: "Endoscopia Digestiva Alta", specialty: "Endoscopia (Torre & Recobro)", category: "Exames" },

  { id: 13, name: "Enfermagem (Suturas/Pensos)", specialty: "Médico no Lar", category: "Domicílio" },
  { id: 14, name: "Vacinação / Soroterapia", specialty: "Médico no Lar", category: "Domicílio" },
];

const MOCK_PATIENTS = [
  "João Silva", "Maria Évora", "Ana Tavares", "Pedro Lima", "Sofia Brito", "Carlos Fortes"
];

function AgendamentosPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Consultas");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof professionals[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [convenio, setConvenio] = useState<"Particular" | "Garantia" | "INPS">("Particular");
  
  // Calculate pricing based on convenio
  const precoTotal = 2500;
  const comparticipacao = convenio === "Garantia" ? 2000 : convenio === "INPS" ? 1500 : 0;
  const precoUtente = precoTotal - comparticipacao;
  
  // App state to hold confirmed appointments
  const [appointments, setAppointments] = useState<Array<{ id: number, patient: string, professional: string, time: string, status: 'scheduled' | 'arrived' | 'triage' }>>([
    { id: 101, patient: "Marie Dubois", professional: "Dr. Júlio Wahnon", time: "09:30", status: 'triage' },
    { id: 102, patient: "António Neves", professional: "Dra. Alicia Wahnon", time: "10:00", status: 'arrived' },
  ]);

  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate slots deterministically based on professional ID so it stays consistent
  const currentSlots = useMemo(() => {
    if (!selectedItem) return [];
    const slots = [];
    const seed = selectedItem.id; 
    for (let h = 8; h < 22; h++) {
      slots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: (h * seed) % 3 !== 0 });
      slots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: (h * seed) % 2 === 0 });
    }
    // Filter out already booked ones from our local state
    return slots.map(s => {
      const isBooked = appointments.some(a => a.professional === selectedItem.name && a.time === s.time);
      return { ...s, available: s.available && !isBooked };
    });
  }, [selectedItem, appointments]);

  const filteredItems = professionals.filter(p => 
    p.category === activeCategory && 
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirm = () => {
    if (!selectedTime || !selectedItem || !patientName) return;
    
    setIsConfirming(true);
    setTimeout(() => {
      setAppointments(prev => [...prev, {
        id: Date.now(),
        patient: patientName,
        professional: selectedItem.name,
        time: selectedTime,
        status: 'scheduled' as 'scheduled' | 'arrived' | 'triage'
      }].sort((a, b) => a.time.localeCompare(b.time)));

      // Sync with Faturação via localStorage
      const savedInvoicesStr = localStorage.getItem('invoicesData');
      const initialInvoices = [
        { n: "FT 2026/0412", patient: "Maria Évora", value: 3500, status: "Pago", method: "Vinti4" },
        { n: "FT 2026/0411", patient: "João Silva", value: 12800, status: "INPS", method: "Convénio" },
        { n: "FT 2026/0410", patient: "Ana Tavares", value: 5200, status: "Pago", method: "Numerário" },
        { n: "FT 2026/0409", patient: "Pedro Lima", value: 28000, status: "Pendente", method: "Garantia" },
        { n: "FT 2026/0408", patient: "Sofia Brito", value: 1800, status: "Pago", method: "MobiCash" },
      ];
      let savedInvoices = savedInvoicesStr ? JSON.parse(savedInvoicesStr) : initialInvoices;
      
      const n = `FT 2026/${(413 + savedInvoices.length).toString().padStart(4, '0')}`;
      const newInvoice = {
        n,
        patient: patientName,
        value: precoUtente,
        status: "Pendente",
        method: convenio
      };
      
      localStorage.setItem('invoicesData', JSON.stringify([newInvoice, ...savedInvoices]));
      
      setIsConfirming(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedTime(null);
        setPatientName("");
        setConvenio("Particular");
      }, 3000);
    }, 800);
  };

  const updateStatus = (id: number, newStatus: 'scheduled' | 'arrived' | 'triage') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <DashboardLayout title="Agendamento & Recepção" subtitle="Gestão de fluxo de pacientes da Medicentro">
      <div className="grid xl:grid-cols-4 gap-6 max-w-[1600px] h-[calc(100vh-8rem)]">
        
        {/* Left Panel: Waitlist / Queue (Recepção Life) */}
        <div className="xl:col-span-1 flex flex-col rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="font-bold text-sm">Fila de Hoje</h3>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full">{appointments.length} Utentes</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {appointments.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-10">Nenhum paciente agendado hoje.</div>
            )}
            {appointments.map(app => (
              <div key={app.id} className="p-3 rounded-xl border bg-card shadow-sm group">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm truncate pr-2">{app.patient}</div>
                  <div className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{app.time}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Stethoscope className="size-3" /> <span className="truncate">{app.professional}</span>
                </div>
                
                {/* Reception Controls */}
                <div className="flex bg-muted/50 p-1 rounded-lg">
                  <button 
                    onClick={() => updateStatus(app.id, 'scheduled')}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${app.status === 'scheduled' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                  >Agendado</button>
                  <button 
                    onClick={() => updateStatus(app.id, 'arrived')}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${app.status === 'arrived' ? 'bg-blue-500/20 text-blue-700 shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                  >Chegou</button>
                  <button 
                    onClick={() => updateStatus(app.id, 'triage')}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${app.status === 'triage' ? 'bg-orange-500/20 text-orange-700 shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                  >Em Triagem</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Panel: Service Selection */}
        <div className="xl:col-span-1 space-y-4 flex flex-col h-full">
          <div className="flex gap-2 bg-muted/40 p-1 rounded-xl border">
            {["Consultas", "Exames", "Domicílio"].map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat as Category); setSelectedItem(null); setSelectedTime(null); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeCategory === cat ? "bg-background shadow-sm border text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar médico ou exame..."
              className="w-full bg-card border rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
            />
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden flex flex-col flex-1 shadow-sm">
            <div className="p-4 border-b bg-muted/10">
              <h3 className="font-bold text-sm tracking-tight">Diretório Medicentro</h3>
            </div>
            <div className="overflow-y-auto p-2 space-y-1 flex-1 custom-scrollbar">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItem(item); setSelectedTime(null); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedItem?.id === item.id 
                      ? "bg-primary/5 border-primary/30 shadow-sm" 
                      : "border-transparent hover:bg-muted/50 hover:border-border/50"
                  }`}
                >
                  <div className="font-bold text-sm flex items-center justify-between text-foreground">
                    {item.name}
                    {activeCategory === "Exames" && <Microscope className="size-4 text-primary" />}
                    {activeCategory === "Consultas" && <Stethoscope className="size-4 text-primary" />}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1.5">{item.specialty}</div>
                </button>
              ))}
              {filteredItems.length === 0 && (
                <div className="p-6 text-center text-sm font-medium text-muted-foreground">Nenhum resultado encontrado.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Time Slots & Booking */}
        <div className="xl:col-span-2 space-y-6 flex flex-col h-full">
          {selectedItem ? (
            <div className="rounded-3xl bg-card border p-8 flex flex-col flex-1 relative overflow-hidden shadow-sm" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div>
                  <h3 className="font-bold text-2xl tracking-tight text-foreground">{selectedItem.name}</h3>
                  <p className="text-sm font-semibold text-muted-foreground inline-flex items-center gap-1.5 mt-2 bg-muted px-3 py-1 rounded-full">
                    <Calendar className="size-4 text-primary" /> Segunda a Sexta · 08:00 às 22:00
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <Lock className="size-3" /> Prevenção de Conflito
                </span>
              </div>
              
              <div className="mt-10 relative z-10 flex-1">
                <div className="flex justify-between items-end mb-6">
                  <h4 className="text-sm font-bold tracking-tight">Horários Disponíveis (Hoje)</h4>
                  <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1.5"><div className="size-2.5 bg-card border-2 border-primary/40 rounded-full"></div> Livre</span>
                    <span className="flex items-center gap-1.5"><div className="size-2.5 bg-muted border-dashed border-2 rounded-full"></div> Ocupado</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {currentSlots.map(s => {
                    const isSel = selectedTime === s.time;
                    return (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setSelectedTime(s.time)}
                        className={`relative rounded-xl border py-3 text-sm font-bold transition-all ${
                          !s.available ? "bg-muted/40 text-muted-foreground/40 border-dashed cursor-not-allowed" :
                          isSel ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10" :
                          "bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checkout Form */}
              <div className={`mt-6 transition-all duration-500 ${selectedTime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                  {showSuccess && (
                    <div className="absolute inset-0 bg-success/95 text-white flex flex-col items-center justify-center z-20 animate-in zoom-in-95 duration-300 backdrop-blur-sm">
                      <CheckCircle2 className="size-12 mb-2 animate-bounce" />
                      <h4 className="font-bold text-lg">Agendamento Confirmado!</h4>
                      <p className="text-sm opacity-90">O paciente foi adicionado à fila.</p>
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 block">Nome do Utente</label>
                        <input 
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Ex: Carlos Fortes"
                          className="w-full bg-background border rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 block">Entidade Financeira</label>
                        <select 
                          value={convenio}
                          onChange={(e) => setConvenio(e.target.value as any)}
                          className="w-full bg-background border rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        >
                          <option value="Particular">Particular (Sem Seguro)</option>
                          <option value="Garantia">Garantia Seguros</option>
                          <option value="INPS">INPS</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="text-sm flex flex-col gap-1 text-muted-foreground font-medium bg-background/50 p-3 rounded-xl border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><UserCheck className="size-4 text-primary" /> Especialista:</div>
                        <strong className="text-foreground">{selectedItem.name}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Clock className="size-4 text-primary" /> Hora Reservada:</div>
                        <strong className="text-primary">{selectedTime}</strong>
                      </div>
                      
                      <div className="my-1 border-t border-dashed" />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span>Valor Base Consulta:</span>
                        <span>{precoTotal.toLocaleString('pt-PT')} CVE</span>
                      </div>
                      {comparticipacao > 0 && (
                        <div className="flex items-center justify-between text-xs text-emerald-600">
                          <span>Comparticipação ({convenio}):</span>
                          <span>- {comparticipacao.toLocaleString('pt-PT')} CVE</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-foreground">A Pagar (Utente):</span>
                        <strong className="text-lg text-foreground">{precoUtente.toLocaleString('pt-PT')} CVE</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end shrink-0 w-full md:w-auto">
                    <button 
                      disabled={!patientName.trim() || isConfirming}
                      onClick={handleConfirm}
                      className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20 bg-primary flex items-center justify-center gap-2"
                    >
                      {isConfirming ? (
                        <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <>Confirmar & Adicionar à Fila</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl bg-card border h-full min-h-[500px] flex flex-col items-center justify-center text-muted-foreground p-8 text-center shadow-sm">
              <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Calendar className="size-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Painel de Agendamento</h3>
              <p className="max-w-md text-sm leading-relaxed">
                Selecione um profissional ou serviço no diretório ao lado para visualizar os horários disponíveis.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AgendamentosPage;