import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Link } from "@tanstack/react-router";
import { 
  Activity, Calendar, Building2, Users, TrendingUp, Bed, Scissors, 
  Loader2, UserCheck, ShieldCheck, Stethoscope, Clock, FileText, 
  Printer, User, ClipboardList, CheckCircle2, Siren, UserPlus
} from "lucide-react";
import clinicImg from "@/assets/medicentro-clinic.jpg";
import logoImg from "@/assets/medicentro-logo.jpg";
import { useRole } from "@/hooks/useRole";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medicentro Health Hub — Dashboard" },
      { name: "description", content: "Sistema de triagem e gestão para a Clínica Privada Medicentro — Mindelo, Cabo Verde." },
    ],
  }),
  component: Index,
});

const priorityStyle: Record<string, string> = {
  'Vermelho (Emergência)': "bg-destructive text-destructive-foreground animate-pulse",
  'Laranja (Muito Urgente)': "bg-orange-600/15 text-orange-600 border border-orange-600/30",
  'Amarelo (Urgente)': "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  'Verde (Pouco Urgente)': "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
  'Azul (Não Urgente)': "bg-blue-500/15 text-blue-600 border border-blue-500/20",
  'Emergência': "bg-destructive text-destructive-foreground animate-pulse",
  'Urgência': "bg-warning/15 text-warning border border-warning/30",
  'Normal': "bg-muted text-muted-foreground",
  'VIP': "bg-primary text-primary-foreground",
};

function Index() {
  const { currentUnit, currentRole } = useRole();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [statsData, setStatsData] = useState({
    triagensHoje: 0,
    triagensGrowth: "+0%",
    ocupacao: "0/0",
    ocupacaoPerc: "0%",
    cirurgiasHoje: 0,
    consultasHoje: 0,
  });

  const isSede = currentUnit.includes("Madeiralzinho");
  const selectedUnitId = isSede ? 1 : 2;

  useEffect(() => {
    fetchDashboardData();
  }, [currentRole, selectedUnitId]);

  const fetchDashboardData = async () => {
    console.log(`[App Debug] Carregando Dashboard (Perfil: ${currentRole}, Unidade: ${currentUnit})...`);
    setLoading(true);
    try {
      if (currentRole === 'admin') {
        console.log("[App Debug] Buscando logs de auditoria...");
        const { data, error } = await supabase
          .from('documentos_emitidos')
          .select('*, pacientes(nome_completo)')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setLogs(data || []);
      }

      console.log("[App Debug] Buscando fila de triagem...");
      const { data: queueData, error: queueError } = await supabase
        .from('triagens')
        .select('*')
        .eq('unidade_id', selectedUnitId)
        .eq('status', 'aguardando');
      
      if (queueError) throw queueError;
      setQueue(queueData || []);

      // Mock stats for demo
      setStatsData({
        triagensHoje: (queueData?.length || 0) + 14,
        triagensGrowth: "+12%",
        ocupacao: isSede ? "12/14" : "2/4",
        ocupacaoPerc: "85%",
        cirurgiasHoje: 3,
        consultasHoje: 42,
      });

    } catch (error: any) {
      console.error("[App Debug] Erro ao carregar Dashboard:", error);
      
      let msg = error.message || 'Falha desconhecida';
      if (error.code === '42501' || error.message?.includes('RLS')) {
        msg = "Precisa de fazer login primeiro. Permissão negada pelas regras de segurança (RLS).";
      }
      toast.error(`Erro de Carregamento: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // UI: RECEÇÃO
  // ---------------------------------------------------------
  const ReceptionUI = () => (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl p-6 lg:p-10 text-primary-foreground min-h-[300px] flex items-end ring-1 ring-border/50 shadow-xl">
        <img src={clinicImg} alt="Medicentro" className="absolute inset-0 size-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight leading-none">Consola de Receção</h2>
            <p className="mt-4 text-primary-foreground/80">Gestão de fluxo de utentes e emissão de documentos oficiais na {currentUnit}.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/pacientes" className="flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-xl font-bold shadow-lg shadow-success/20 hover:scale-105 transition-all">
              <UserPlus className="size-5" /> Novo Paciente
            </Link>
            <Link to="/documentos" className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all">
              <FileText className="size-5" /> Emitir PDF
            </Link>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
              <h3 className="font-bold text-sm">Fila de Triagem em Tempo Real</h3>
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-success">
                <span className="size-2 rounded-full bg-success animate-pulse" /> Live
              </span>
            </div>
            <ul className="divide-y max-h-[400px] overflow-y-auto">
              {queue.map(q => (
                <li key={q.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-all">
                  <div className="size-10 rounded-xl bg-primary/10 grid place-items-center text-primary font-bold">{q.paciente_nome?.[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{q.paciente_nome}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${priorityStyle[q.prioridade] || priorityStyle['Normal']}`}>
                        {q.prioridade?.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{q.sintoma}</p>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground">
                    <Clock className="size-3 inline mr-1" /> {formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: pt })}
                  </div>
                </li>
              ))}
              {queue.length === 0 && <li className="p-10 text-center text-muted-foreground text-sm">Fila vazia no momento.</li>}
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center shadow-inner">
            <TrendingUp className="size-10 text-primary mx-auto mb-4" />
            <h4 className="font-bold text-lg">{statsData.triagensHoje} Triagens</h4>
            <p className="text-sm text-muted-foreground">Realizadas hoje nesta unidade.</p>
          </div>
          <div className="bg-card border rounded-2xl p-6">
            <h4 className="font-bold text-sm mb-4">Acesso Rápido</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/agendamentos" className="p-3 bg-muted/50 rounded-xl text-center hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                <Calendar className="size-5 mx-auto mb-1 text-primary" />
                <span className="text-[10px] font-bold uppercase">Agenda</span>
              </Link>
              <Link to="/pacientes" className="p-3 bg-muted/50 rounded-xl text-center hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                <Users className="size-5 mx-auto mb-1 text-primary" />
                <span className="text-[10px] font-bold uppercase">Utentes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // UI: MÉDICO
  // ---------------------------------------------------------
  const DoctorUI = () => (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><Users className="size-4 text-primary" /> Fila de Espera</h3>
            <div className="space-y-2">
              {queue.map(q => (
                <div key={q.id} className="p-3 border rounded-xl bg-muted/20 hover:border-primary/50 cursor-pointer transition-all border-l-4 border-l-primary/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold truncate">{q.paciente_nome}</span>
                    <span className={`text-[8px] px-1.5 rounded-full font-bold ${priorityStyle[q.prioridade] || priorityStyle['Normal']}`}>
                      {q.prioridade?.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Aguardando há {formatDistanceToNow(new Date(q.created_at), { locale: pt })}</span>
                </div>
              ))}
              {queue.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nenhum paciente aguardando.</p>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2">Bem-vindo, Dr. Anderson</h2>
              <p className="text-white/70">O seu próximo paciente está pronto para a triagem Manchester.</p>
              <button className="mt-8 px-8 py-4 bg-white text-primary rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                Chamar Próximo Utente
              </button>
            </div>
            <Stethoscope className="absolute -right-10 -bottom-10 size-64 text-white/10 rotate-12" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-primary/50 transition-all cursor-pointer">
              <div className="size-12 rounded-2xl bg-primary/10 grid place-items-center text-primary"><Activity className="size-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Consultório Virtual</h4>
                <p className="text-xs text-muted-foreground">Aceder a prontuários e notas de voz.</p>
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-success/50 transition-all cursor-pointer">
              <div className="size-12 rounded-2xl bg-success/10 grid place-items-center text-success"><CheckCircle2 className="size-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Altas Realizadas</h4>
                <p className="text-xs text-muted-foreground">8 pacientes atendidos hoje com sucesso.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // UI: GERENTE / ADMIN
  // ---------------------------------------------------------
  const AdminUI = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm border-l-4 border-l-primary">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Faturação Hoje</p>
          <p className="text-2xl font-black mt-1">452.000 CVE</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm border-l-4 border-l-success">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Ocupação Suítes</p>
          <p className="text-2xl font-black mt-1">{statsData.ocupacao}</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Tempo Médio Espera</p>
          <p className="text-2xl font-black mt-1">18 min</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm border-l-4 border-l-destructive">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Críticos Atuais</p>
          <p className="text-2xl font-black mt-1">2</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Dashboard de Auditoria (Logs de Emissão)</h3>
          <Link to="/documentos" className="text-xs font-bold text-primary hover:underline">Ver Histórico Completo →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-muted/10 border-b text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Utente</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">{new Date(log.created_at).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-6 py-4 font-bold">{log.pacientes?.nome_completo || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">{log.tipo_documento}</span>
                  </td>
                  <td className="px-6 py-4 italic text-muted-foreground">{log.emitido_por}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">Nenhum log registado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // UI: PACIENTE
  // ---------------------------------------------------------
  const PatientUI = () => (
    <div className="max-w-xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="size-20 rounded-3xl bg-primary text-white grid place-items-center mx-auto shadow-2xl mb-6">
          <UserCheck className="size-10" />
        </div>
        <h2 className="text-3xl font-black">Bem-vindo à Medicentro</h2>
        <p className="text-muted-foreground">Faça o seu check-in rápido para triagem prioritária.</p>
      </div>
      
      <div className="bg-card border rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1 tracking-widest">Nome Completo</label>
          <input className="w-full px-5 py-4 bg-muted/50 border rounded-2xl text-lg font-medium outline-none focus:ring-4 ring-primary/10 transition-all" placeholder="Ex: Hernany Monteiro" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1 tracking-widest">NIF ou Cartão SNS</label>
          <input className="w-full px-5 py-4 bg-muted/50 border rounded-2xl text-lg font-medium outline-none focus:ring-4 ring-primary/10 transition-all" placeholder="000 000 000" />
        </div>
        <button className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          Confirmar Presença
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 text-center hover:bg-blue-500/20 transition-all cursor-pointer">
          <Siren className="size-8 text-blue-500 mx-auto mb-2" />
          <p className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">Emergência</p>
        </div>
        <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 text-center hover:bg-emerald-500/20 transition-all cursor-pointer">
          <ClipboardList className="size-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest">Minha Fila</p>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout title={currentRole === 'patient' ? "Quiosque Digital" : "Painel Central"} subtitle={currentUnit}>
      {loading ? (
        <div className="h-[60vh] grid place-items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Sincronizando Dados...</p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {currentRole === 'reception' && <ReceptionUI />}
          {currentRole === 'doctor' && <DoctorUI />}
          {currentRole === 'admin' && <AdminUI />}
          {currentRole === 'patient' && <PatientUI />}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Index;
