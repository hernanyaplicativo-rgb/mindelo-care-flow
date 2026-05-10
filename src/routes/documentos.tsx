import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  FileText, Search, Printer, FileCheck, ClipboardList, 
  Receipt, History, Filter, Download, User, 
  Calendar, Clock, CheckCircle2, AlertCircle, Loader2,
  Building2, HeartPulse, ShieldCheck, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/documentos")({
  component: Documentos,
});

interface Exame {
  id: string;
  descricao: string;
  paciente_id: string;
  status: string;
  created_at: string;
  pacientes: { nome_completo: string };
}

interface Fatura {
  id: string;
  valor: number;
  data_emissao: string;
  descricao: string;
  pacientes: { nome_completo: string };
}

function Documentos() {
  const [activeTab, setActiveTab] = useState<'declaracoes' | 'guias' | 'recibos' | 'historico'>('declaracoes');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [exames, setExames] = useState<Exame[]>([]);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [declarationType, setDeclarationType] = useState("Presença");
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Realtime Historico
  useEffect(() => {
    const channel = supabase
      .channel('documentos-emitidos-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'documentos_emitidos' }, () => {
        if (activeTab === 'historico') fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  // Handle Search for Patients (ilike logic)
  useEffect(() => {
    if (activeTab !== 'declaracoes') return;
    
    const timer = setTimeout(async () => {
      if (!searchTerm) {
        const { data } = await supabase.from('pacientes').select('id, nome_completo, telemovel').limit(10);
        setPacientes(data || []);
        return;
      }
      
      const { data } = await supabase
        .from('pacientes')
        .select('id, nome_completo, telemovel')
        .ilike('nome_completo', `%${searchTerm}%`)
        .limit(10);
      
      setPacientes(data || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'guias') {
        let query = supabase.from('exames_pendentes').select('*, pacientes(nome_completo)').order('created_at', { ascending: false });
        if (selectedPaciente) query = query.eq('paciente_id', selectedPaciente.id);
        const { data, error } = await query;
        if (error) throw error;
        setExames(data || []);
      } else if (activeTab === 'recibos') {
        let query = supabase.from('faturas').select('*, pacientes(nome_completo)').order('data_emissao', { ascending: false });
        if (selectedPaciente) query = query.eq('paciente_id', selectedPaciente.id);
        const { data, error } = await query;
        if (error) throw error;
        setFaturas(data || []);
      } else if (activeTab === 'historico') {
        let query = supabase
          .from('documentos_emitidos')
          .select('*, pacientes(nome_completo)')
          .order('created_at', { ascending: false });
        
        if (dateFilter) {
          query = query.gte('created_at', `${dateFilter}T00:00:00`).lte('created_at', `${dateFilter}T23:59:59`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        setHistorico(data || []);
      }
    } catch (error: any) {
      console.error("Erro na busca de dados:", error);
      toast.error(`Falha ao carregar a lista: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };


  const handlePrint = async () => {
    if (!selectedPaciente) return;

    try {
      // Log Document Emission for Dr. Anderson
      const { error } = await supabase.from('documentos_emitidos').insert({
        paciente_id: selectedPaciente.id,
        tipo_documento: `Declaração de ${declarationType}`,
        emitido_por: 'Receção' // In a real app, use auth.user.email or name
      });
      
      if (error) throw error;
      
      window.print();
      toast.success("Documento emitido e registado no sistema de auditoria.");
    } catch (error: any) {
      console.error("Erro ao registar log:", error);
      toast.error(`Atenção: Documento impresso, mas falhou ao guardar no Log! Erro: ${error.message || 'Erro desconhecido'}`);
      window.print(); // Still print even if log fails, so patient is not blocked
    }
  };

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'guias') return exames.filter(e => e.pacientes.nome_completo.toLowerCase().includes(term));
    if (activeTab === 'recibos') return faturas.filter(f => f.pacientes.nome_completo.toLowerCase().includes(term));
    if (activeTab === 'historico') return historico.filter(h => h.pacientes?.nome_completo.toLowerCase().includes(term));
    return pacientes; // Patients are already filtered by the ilike useEffect
  };

  const getBadgeColor = (type: string) => {
    if (type.includes('Declaração')) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (type.includes('Receita')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (type.includes('Guia')) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <DashboardLayout title="Documentos e Saídas Rápidas" subtitle="Emissão de guias, declarações e recibos">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-muted/50 rounded-xl border w-fit overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setActiveTab('declaracoes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'declaracoes' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FileText className="size-4" /> Declarações
          </button>
          <button 
            onClick={() => setActiveTab('guias')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'guias' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ClipboardList className="size-4" /> Central de Guias
          </button>
          <button 
            onClick={() => setActiveTab('recibos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'recibos' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Receipt className="size-4" /> Recibos & Faturas
          </button>
          <button 
            onClick={() => setActiveTab('historico')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'historico' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <History className="size-4" /> Histórico
          </button>
        </div>

        {/* Search Bar (Global for active tab) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              placeholder={`Buscar por nome do paciente...`} 
              className="w-full pl-10 pr-4 py-2 bg-card border rounded-lg text-sm focus:ring-2 ring-primary/20 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'historico' && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <input 
                type="date"
                className="bg-card border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/20 transition-all shadow-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <button 
                onClick={() => setDateFilter("")}
                className="text-xs text-primary font-bold hover:underline"
              >
                Limpar
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* TAB 4: HISTÓRICO DE EMISSÕES */}
          {activeTab === 'historico' && (
            <div className="lg:col-span-12">
              <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <History className="size-4 text-primary" /> Log de Emissões Realtime
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-success flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" /> Live
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-muted/10 border-b text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        <th className="px-6 py-4">Data / Hora</th>
                        <th className="px-6 py-4">Tipo de Documento</th>
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4">Responsável</th>
                        <th className="px-6 py-4 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {loading && historico.length === 0 ? (
                        Array(5).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse"><td colSpan={5} className="p-8 bg-muted/5"></td></tr>
                        ))
                      ) : filteredItems().map((log: any) => (
                        <tr key={log.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-[11px] font-medium text-muted-foreground">
                              {new Date(log.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground/60">
                              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${getBadgeColor(log.tipo_documento)}`}>
                              {log.tipo_documento}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-primary/10 grid place-items-center text-primary text-[10px] font-bold">
                                {log.pacientes?.nome_completo?.[0] || 'P'}
                              </div>
                              <span className="text-sm font-bold text-foreground">
                                {log.pacientes?.nome_completo || 'Paciente Removido'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-semibold text-muted-foreground italic flex items-center gap-1.5">
                              <User className="size-3" /> {log.emitido_por}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              className="size-8 rounded-lg bg-muted grid place-items-center hover:bg-primary hover:text-white transition-all shadow-sm"
                              title="Visualizar / Reimprimir"
                              onClick={() => {
                                setSelectedPaciente(log.pacientes);
                                setActiveTab('declaracoes');
                                toast.info("Dados carregados para reimpressão.");
                              }}
                            >
                              <Printer className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {historico.length === 0 && !loading && (
                  <div className="p-20 text-center space-y-3 opacity-40">
                    <History className="size-12 mx-auto" />
                    <p className="font-medium font-mono text-xs uppercase tracking-widest">Nenhum registo no log de sistema.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* TAB 1: DECLARAÇÕES */}
          {activeTab === 'declaracoes' && (
            <>
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-muted/20 font-bold text-xs uppercase tracking-wider text-muted-foreground">Selecionar Utente</div>
                  <ul className="max-h-[400px] overflow-y-auto divide-y">
                    {filteredItems().map((p: any) => (
                      <li 
                        key={p.id} 
                        onClick={() => setSelectedPaciente(p)}
                        className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedPaciente?.id === p.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted/30'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 grid place-items-center text-primary text-[10px] font-bold">{p.nome_completo[0]}</div>
                          <span className="text-sm font-medium">{p.nome_completo}</span>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground opacity-50" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2"><Clock className="size-4 text-primary" /> Detalhes da Declaração</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Hora de Entrada</label>
                      <input type="time" className="w-full p-2 border rounded-lg text-sm bg-muted/30" onChange={(e) => setEntryTime(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Hora de Saída</label>
                      <input type="time" className="w-full p-2 border rounded-lg text-sm bg-muted/30" onChange={(e) => setExitTime(e.target.value)} />
                    </div>
                  </div>
                  <button 
                    disabled={!selectedPaciente}
                    onClick={handlePrint}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all"
                  >
                    <Printer className="size-4" /> Emitir Declaração PDF
                  </button>
                </div>
              </div>

              {/* Preview Area (A4 style) */}
              <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-2xl p-[1in] text-black overflow-hidden print:shadow-none print:border-0 print:p-0" id="print-area">
                {selectedPaciente ? (
                  <div className="space-y-12">
                    {/* Logo & Header */}
                    <div className="flex items-center justify-between border-b pb-8 border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                          <HeartPulse className="size-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-black tracking-tight text-blue-900 uppercase">Medicentro</h1>
                          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400">CLÍNICA PRIVADA · MINDELO</p>
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-gray-400 leading-relaxed font-medium">
                        Rua de Angola, Madeiralzinho<br/>
                        C.P. 123 · Mindelo, S. Vicente<br/>
                        Tel: (+238) 231 44 55
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold border-y border-gray-100 py-4 uppercase tracking-widest text-gray-800">Declaração de Presença</h2>
                      <p className="text-gray-500 font-medium">Atestamos para os devidos efeitos que:</p>
                    </div>

                    {/* Body */}
                    <div className="space-y-8 leading-loose text-lg">
                      <p className="text-justify">
                        O(A) Sr(a). <span className="font-bold border-b-2 border-gray-200">{selectedPaciente.nome_completo}</span>, 
                        esteve presente nestas instalações clínicas no dia <span className="font-bold">{new Date().toLocaleDateString('pt-PT')}</span>, 
                        com entrada às <span className="font-bold">{entryTime || '--:--'}</span> e saída às <span className="font-bold">{exitTime || '--:--'}</span>, 
                        para fins de consulta/tratamento médico.
                      </p>
                      <p className="text-justify">
                        Por ser verdade e me ter sido solicitado, passo a presente declaração que assino e faço autenticar com o carimbo a óleo desta instituição.
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-24 flex flex-col items-center gap-12">
                      <div className="text-center space-y-1">
                        <div className="w-64 border-b border-gray-400 mb-2 mx-auto"></div>
                        <p className="text-sm font-bold uppercase text-gray-800">A Direção Administrativa</p>
                        <p className="text-xs text-gray-500 italic">Mindelo, {new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 w-full flex items-center justify-between">
                        <div className="flex items-center gap-3 text-blue-600">
                          <ShieldCheck className="size-10 opacity-20" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Documento Digital Autêntico</p>
                            <p className="text-xs font-medium">Validado via Medicentro Health Hub</p>
                          </div>
                        </div>
                        <div className="size-16 bg-gray-200 rounded grid place-items-center text-[10px] font-bold text-gray-400 uppercase">QR CODE</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-30">
                    <FileText className="size-20" />
                    <p className="font-medium">Selecione um utente para visualizar a declaração</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: CENTRAL DE GUIAS */}
          {activeTab === 'guias' && (
            <div className="lg:col-span-12">
              <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Utente</th>
                      <th className="px-6 py-4">Exame / Prescrição</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Acções</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse"><td colSpan={5} className="p-8 bg-muted/10"></td></tr>
                      ))
                    ) : filteredItems().map((exame: any) => (
                      <tr key={exame.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{new Date(exame.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/10 grid place-items-center text-primary text-[10px] font-bold">{exame.pacientes.nome_completo[0]}</div>
                            <span className="text-sm font-bold">{exame.pacientes.nome_completo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{exame.descricao}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${exame.status === 'pendente' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-success/10 text-success border-success/20'}`}>
                            {exame.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all">
                            <Printer className="size-3.5" /> Guia de Encaminhamento
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {exames.length === 0 && !loading && (
                  <div className="p-20 text-center space-y-3 opacity-40">
                    <ClipboardList className="size-12 mx-auto" />
                    <p className="font-medium">Nenhuma guia pendente encontrada.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RECIBOS & FATURAS */}
          {activeTab === 'recibos' && (
            <div className="lg:col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                  Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />)
                ) : filteredItems().map((fatura: any) => (
                  <div key={fatura.id} className="bg-card border rounded-2xl p-5 hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-10 rounded-xl bg-success/10 grid place-items-center text-success border border-success/20">
                        <Receipt className="size-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(fatura.data_emissao).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-sm truncate">{fatura.pacientes.nome_completo}</h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{fatura.descricao}</p>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-dashed">
                      <div className="text-lg font-black text-foreground">
                        {fatura.valor.toLocaleString('pt-PT', { style: 'currency', currency: 'CVE' })}
                      </div>
                      <button className="size-8 rounded-lg bg-muted grid place-items-center hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Printer className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {faturas.length === 0 && !loading && (
                <div className="p-20 text-center space-y-3 opacity-40">
                  <History className="size-12 mx-auto" />
                  <p className="font-medium">Sem histórico de faturas recentes.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 100%; 
            height: 100%; 
            padding: 0 !important;
            margin: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
          }
          header, aside, .lg\\:col-span-5, nav, .lg\\:col-span-12 { display: none !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}
