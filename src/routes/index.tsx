import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Link } from "@tanstack/react-router";
import { 
  Activity, Calendar, Building2, Users, Bed, Scissors, 
  Loader2, UserCheck, ShieldCheck, Stethoscope, Clock, FileText, 
  User, ClipboardList, CheckCircle2, Siren, HeartPulse, Mic, ChevronRight
} from "lucide-react";
import clinicImg from "@/assets/medicentro-clinic.jpg";
import logoImg from "@/assets/medicentro-logo.jpg";
import { useRole } from "@/hooks/useRole";
import { useState, useEffect, useRef } from "react";
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

const DASHBOARD_TIMEOUT_MS = 2500;

async function withDashboardTimeout<T>(request: PromiseLike<T>, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      Promise.resolve(request),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label}: ligação demorou demasiado`)), DASHBOARD_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function Index() {
  const { currentUnit, currentRole } = useRole();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  const [statsData, setStatsData] = useState({
    triagensHoje: 47,
    triagensGrowth: "+12%",
    ocupacao: "12/14",
    ocupacaoPerc: "85%",
    cirurgiasHoje: 8,
    cirurgiasGrowth: "+2",
    consultasHoje: 145,
    consultasGrowth: "+8%",
  });

  const isSede = currentUnit.includes("Madeiralzinho");
  const selectedUnitId = isSede ? 1 : 2;

  useEffect(() => {
    fetchDashboardData();
  }, [currentRole, selectedUnitId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (currentRole === 'admin') {
        console.log("[App Debug] Buscando logs de auditoria...");
        const { data, error } = await withDashboardTimeout(
          supabase
            .from('documentos_emitidos')
            .select('*, pacientes(nome_completo)')
            .order('created_at', { ascending: false })
            .limit(10),
          'Logs de auditoria'
        );
        if (error) throw error;
        setLogs(data || []);
      }

      console.log("[App Debug] Buscando fila de triagem...");
      const { data: queueData, error: queueError } = await withDashboardTimeout(
        supabase
          .from('triagens')
          .select('*')
          .eq('unidade_id', selectedUnitId)
          .eq('status', 'aguardando'),
        'Fila de triagem'
      );
      if (queueError) throw queueError;
      
      setQueue(queueData || []);

      // Mocking stats for high-fidelity feel like the screenshot
      setStatsData({
        triagensHoje: 47,
        triagensGrowth: "+12%",
        ocupacao: isSede ? "12/14" : "2/4",
        ocupacaoPerc: isSede ? "85%" : "50%",
        cirurgiasHoje: 8,
        cirurgiasGrowth: "+2",
        consultasHoje: 145,
        consultasGrowth: "+8%",
      });

    } catch (error: any) {
      console.error("Erro ao carregar Dashboard:", error);
      toast.error("Falha ao sincronizar dados em tempo real.");
    } finally {
      setLoading(false);
    }
  };

  const HeroBanner = () => (
    <section className="relative overflow-hidden rounded-[2rem] p-8 lg:p-14 text-white min-h-[340px] flex items-center shadow-2xl border border-white/10 mb-8 group">
      <img src={clinicImg} alt="Medicentro" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
      
      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-500">
          <HeartPulse className="size-3" /> Health & Hospitality
        </div>
        
        <div className="space-y-3">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-left-6 duration-700">
            Ecosistema Integrado <br /> de Saúde
          </h2>
          <p className="text-white/80 text-sm lg:text-lg font-medium leading-relaxed max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            Gestão centralizada para a Clínica Sede (Ambulatório e Diagnóstico) e Medicentro Health Hospitality (Cirurgias, Internamento e Urgências 24h).
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Link to="/triagem" className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all text-sm">
            <Activity className="size-5" /> Triagem Manchester
          </Link>
          <Link to="/agendamentos" className="flex items-center gap-2 px-8 py-4 bg-primary-dark/40 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-white/10 active:scale-95 transition-all text-sm uppercase tracking-wider">
            NOVO AGENDAMENTO
          </Link>
        </div>
      </div>
    </section>
  );

  const StatsRow = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: "Triagens (Urgência 24h)", val: statsData.triagensHoje, growth: statsData.triagensGrowth, icon: Activity, color: "text-primary" },
        { label: "Ocupação (Suítes)", val: statsData.ocupacao, growth: statsData.ocupacaoPerc, icon: Bed, color: "text-emerald-500" },
        { label: "Cirurgias (Laparoscopia)", val: statsData.cirurgiasHoje, growth: statsData.cirurgiasGrowth, icon: Scissors, color: "text-blue-500" },
        { label: "Consultas Ambulatório", val: statsData.consultasHoje, growth: statsData.consultasGrowth, icon: Calendar, color: "text-amber-500" },
      ].map((s, i) => (
        <div key={i} className="bg-card border rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className={`size-10 rounded-xl bg-muted/50 grid place-items-center ${s.color}`}>
              <s.icon className="size-5" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${s.growth.startsWith('+') ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
              {s.growth}
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
          <p className="text-3xl font-black tracking-tight">{s.val}</p>
        </div>
      ))}
    </div>
  );

  const TriageQueue = () => (
    <div className="bg-card border rounded-[1.5rem] shadow-sm overflow-hidden flex-1">
      <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-success animate-pulse" />
          <h3 className="font-bold text-sm">Fila de Triagem (Urgência 24h)</h3>
        </div>
        <Link to="/triagem" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Gerir Fila →</Link>
      </div>
      <ul className="divide-y max-h-[440px] overflow-y-auto custom-scrollbar">
        {queue.length > 0 ? queue.map(q => (
          <li key={q.id} className="p-5 flex items-center gap-4 hover:bg-muted/30 transition-all cursor-pointer group">
            <div className="size-12 rounded-2xl bg-primary/10 grid place-items-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">{q.paciente_nome?.[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-sm truncate">{q.paciente_nome}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${priorityStyle[q.prioridade] || priorityStyle['Normal']}`}>
                  {q.prioridade?.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{q.sintoma || 'Avaliação geral'}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 justify-end">
                <Clock className="size-3" /> {formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: pt })}
              </div>
              <div className="text-[9px] text-success font-bold mt-1 uppercase tracking-tighter">Ao vivo</div>
            </div>
          </li>
        )) : (
          <li className="p-16 text-center">
            <Activity className="size-10 text-muted/30 mx-auto mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Nenhum paciente em espera crítica.</p>
          </li>
        )}
      </ul>
    </div>
  );

  const StatusCard = () => (
    <div className="bg-card border rounded-[1.5rem] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="size-5 text-primary" />
        <h4 className="font-bold text-sm">Status das Unidades</h4>
      </div>
      <div className="space-y-4">
        {[
          { name: "Clínica Sede (08h-22h)", status: "Aberto", color: "text-success" },
          { name: "Health Hospitality (24h)", status: "Aberto", color: "text-success" },
          { name: "Farmácia Central", status: "Aberto", color: "text-success" },
        ].map((u, i) => (
          <div key={i} className="flex items-center justify-between group cursor-default">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{u.name}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${u.color}`}>{u.status}</span>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t">
        <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="size-5 text-primary" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider">Sistema Ativo</p>
            <p className="text-[10px] text-muted-foreground truncate">Criptografia de ponta a ponta ativa.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ReceptionUI = () => (
    <div className="space-y-0">
      <HeroBanner />
      <StatsRow />
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TriageQueue />
        </div>
        <div className="space-y-8">
          <StatusCard />
          <div className="bg-primary text-primary-foreground rounded-[1.5rem] p-6 shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-bold mb-2 relative z-10">Suporte Prioritário</h4>
            <p className="text-xs text-primary-foreground/80 mb-4 relative z-10 leading-relaxed">Problemas técnicos com o sistema? Contacte o TI Medicentro.</p>
            <button className="w-full py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-xs font-bold hover:bg-white/30 transition-all relative z-10">
              Abrir Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DoctorUI = () => (
    <div className="space-y-6">
      <HeroBanner />
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-[1.5rem] p-5 shadow-sm sticky top-32">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><Users className="size-4 text-primary" /> Fila de Prontuário</h3>
            <div className="space-y-2">
              {queue.map(q => (
                <div key={q.id} className="p-3 border rounded-xl bg-muted/20 hover:border-primary/50 cursor-pointer transition-all border-l-4 border-l-primary/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold truncate">{q.paciente_nome}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Aguardando há {formatDistanceToNow(new Date(q.created_at), { locale: pt })}</span>
                </div>
              ))}
              {queue.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nenhum paciente aguardando.</p>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-2">Bom trabalho, Dr. Anderson</h2>
              <p className="text-white/70 text-lg">A sua agenda está sincronizada com a triagem em tempo real.</p>
              <Link to="/triagem" className="mt-10 inline-flex px-10 py-5 bg-white text-primary rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                Chamar Próximo Utente
              </Link>
            </div>
            <Stethoscope className="absolute -right-10 -bottom-10 size-80 text-white/10 rotate-12" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/prontuario" className="bg-card border rounded-2xl p-8 shadow-sm flex items-center gap-5 hover:border-primary/50 transition-all group">
              <div className="size-16 rounded-2xl bg-primary/10 grid place-items-center text-primary group-hover:scale-110 transition-transform"><Activity className="size-8" /></div>
              <div>
                <h4 className="font-bold text-lg">Prontuário Digital</h4>
                <p className="text-sm text-muted-foreground">Aceder ao histórico clínico completo.</p>
              </div>
            </Link>
            <Link to="/ditado" className="bg-card border rounded-2xl p-8 shadow-sm flex items-center gap-5 hover:border-success/50 transition-all group">
              <div className="size-16 rounded-2xl bg-success/10 grid place-items-center text-success group-hover:scale-110 transition-transform"><Mic className="size-8" /></div>
              <div>
                <h4 className="font-bold text-lg">Ditado IA (EMR)</h4>
                <p className="text-sm text-muted-foreground">Converter voz em notas clínicas.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminUI = () => (
    <div className="space-y-6">
      <HeroBanner />
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Faturação Hoje", val: "452.000 CVE", color: "border-l-primary" },
          { label: "Ocupação Suítes", val: statsData.ocupacao, color: "border-l-success" },
          { label: "Tempo Médio Espera", val: "18 min", color: "border-l-amber-500" },
          { label: "Críticos Atuais", val: "2", color: "border-l-destructive" },
        ].map((s, i) => (
          <div key={i} className={`bg-card border rounded-2xl p-6 shadow-sm border-l-4 ${s.color}`}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-black mt-2 tracking-tight">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-[2rem] shadow-xl overflow-hidden">
        <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-primary" />
            <h3 className="font-bold text-lg">Monitor de Auditoria em Tempo Real</h3>
          </div>
          <Link to="/documentos" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Ver Logs Completos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-muted/10 border-b text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Utente</th>
                <th className="px-8 py-5">Documento</th>
                <th className="px-8 py-5">Responsável</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-8 py-5 text-muted-foreground font-medium">{new Date(log.created_at).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-8 py-5 font-bold group-hover:text-primary transition-colors">{log.pacientes?.nome_completo || '—'}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 uppercase tracking-tighter">{log.tipo_documento}</span>
                  </td>
                  <td className="px-8 py-5 font-medium text-muted-foreground italic">{log.emitido_por}</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 text-success font-bold text-[10px] uppercase tracking-widest">
                      <CheckCircle2 className="size-3" /> Assinado
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">Aguardando novos registos de atividade...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const NurseUI = () => (
    <div className="space-y-6">
      <HeroBanner />
      <StatsRow />
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TriageQueue />
        </div>
        <div className="space-y-6">
          <Link to="/triagem" className="block p-8 bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] text-white shadow-xl hover:scale-[1.02] transition-all group">
             <Activity className="size-12 mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="text-xl font-bold tracking-tight">Nova Triagem</h3>
             <p className="text-white/70 text-sm mt-2">Iniciar protocolo Manchester para paciente em espera na recepção.</p>
          </Link>
          <StatusCard />
        </div>
      </div>
    </div>
  );

  const PatientUI = () => (
    <div className="max-w-xl mx-auto py-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="size-24 rounded-[2.5rem] bg-primary text-white grid place-items-center mx-auto shadow-2xl shadow-primary/30 mb-8 transform hover:rotate-6 transition-transform">
          <UserCheck className="size-12" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter">Bem-vindo à Medicentro</h2>
        <p className="text-muted-foreground text-lg">Efetue o seu check-in para atendimento imediato.</p>
      </div>
      
      <div className="bg-card border rounded-[2.5rem] p-10 shadow-2xl space-y-8 ring-1 ring-border/50">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-[0.2em]">Nome Completo</label>
          <input className="w-full px-6 py-5 bg-muted/30 border-2 border-transparent focus:border-primary/20 rounded-2xl text-xl font-semibold outline-none focus:ring-8 ring-primary/5 transition-all placeholder:text-muted/50" placeholder="Ex: Hernany Monteiro" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-[0.2em]">NIF ou Cartão SNS</label>
          <input className="w-full px-6 py-5 bg-muted/30 border-2 border-transparent focus:border-primary/20 rounded-2xl text-xl font-semibold outline-none focus:ring-8 ring-primary/5 transition-all placeholder:text-muted/50" placeholder="000 000 000" />
        </div>
        <button className="w-full py-6 bg-primary text-primary-foreground rounded-2xl font-black text-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          Confirmar Presença <ChevronRight className="size-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Link to="/sos" className="bg-red-500/5 p-8 rounded-3xl border border-red-500/10 text-center hover:bg-red-500/10 transition-all group">
          <Siren className="size-10 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black uppercase text-red-600 tracking-widest">Emergência</p>
        </Link>
        <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10 text-center hover:bg-emerald-500/10 transition-all group cursor-pointer">
          <ClipboardList className="size-10 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black uppercase text-emerald-600 tracking-widest">Minha Fila</p>
        </div>
      </div>
    </div>
  );

  const getDashboardTitle = () => {
    switch(currentRole) {
      case 'admin': return "Painel de Controlo · Admin";
      case 'doctor': return "Central Médica · Medicentro";
      case 'nurse': return "Posto de Enfermagem · Triagem";
      case 'patient': return "Portal do Utente";
      default: return "Recepção Medicentro";
    }
  };

  return (
    <DashboardLayout title={getDashboardTitle()} subtitle={currentUnit}>
      {loading ? (
        <div className="h-[70vh] grid place-items-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Loader2 className="size-14 animate-spin text-primary" />
              <div className="absolute inset-0 size-14 rounded-full border-4 border-primary/20" />
            </div>
            <p className="text-xs font-black text-muted-foreground animate-pulse uppercase tracking-[0.3em]">Sincronizando Ecossistema...</p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentRole === 'reception' && <ReceptionUI />}
          {currentRole === 'doctor' && <DoctorUI />}
          {currentRole === 'nurse' && <NurseUI />}
          {currentRole === 'admin' && <AdminUI />}
          {currentRole === 'patient' && <PatientUI />}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Index;
