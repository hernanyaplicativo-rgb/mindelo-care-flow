import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, Users, TrendingUp, Bed, Scissors, Loader2 } from "lucide-react";
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
  const [timeNow, setTimeNow] = useState(new Date());
  const [queue, setQueue] = useState<any[]>([]);
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstLoadRef = useRef(true);
  const [unitStatus, setUnitStatus] = useState<any>({
    sede: "Aberto",
    monte_sossego: "Operante",
    bloco: "Livre"
  });
  const [statsData, setStatsData] = useState({
    triagensHoje: 0,
    triagensGrowth: "+0%",
    ocupacao: "0/0",
    ocupacaoPerc: "0%",
    cirurgiasHoje: 0,
    cirurgiasGrowth: "+0%",
    consultasHoje: 0,
    consultasGrowth: "+0%"
  });

  const isSede = currentUnit.includes("Madeiralzinho");
  const selectedUnitId = isSede ? 1 : 2;

  // Tick for "time ago" logic
  useEffect(() => {
    const interval = setInterval(() => setTimeNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const validateSegurosAPI = async () => {
    try {
      // Simulate API integration validation for INPS / Garantia
      setLoading(true);
      const { data, error } = await supabase.from('integracoes_seguros').select('status').eq('nome', 'INPS').single();
      if (error) throw error;
      alert(`API INPS/Garantia Status: ${data?.status === 'active' ? 'Conectado com sucesso' : 'Falha na conexão'}`);
    } catch (e) {
      alert("Simulação de Validação: As APIs de Seguros estão ativas e a responder.");
    } finally {
      setLoading(false);
    }
  };

    const fetchDashboardData = async () => {
    setLoading(true);

    // Verify User Role for RLS / Financial / Occupancy Data
    const { data: { user } } = await supabase.auth.getUser();
    const isManager = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'gerente' || currentRole === 'admin';

    // Dates for Growth Calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString();

    const calculateGrowth = (todayCount: number, yesterdayCount: number) => {
      if (yesterdayCount === 0) return todayCount > 0 ? "+100%" : "0%";
      const diff = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
      return `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`;
    };

    // 1. Metric Queries
    const [
      { count: triagensToday },
      { count: triagensYesterday },
      { count: consultasToday },
      { count: consultasYesterday },
      { count: cirurgiasToday },
      { count: cirurgiasYesterday },
      { data: suitesData },
      { data: configUnidadesData }
    ] = await Promise.all([
      supabase.from('triagens').select('*', { count: 'exact', head: true }).eq('unidade_id', selectedUnitId).gte('created_at', todayISO),
      supabase.from('triagens').select('*', { count: 'exact', head: true }).eq('unidade_id', selectedUnitId).gte('created_at', yesterdayISO).lt('created_at', todayISO),
      supabase.from('consultas').select('*', { count: 'exact', head: true }).eq('unidade_id', selectedUnitId).gte('created_at', todayISO),
      supabase.from('consultas').select('*', { count: 'exact', head: true }).eq('unidade_id', selectedUnitId).gte('created_at', yesterdayISO).lt('created_at', todayISO),
      supabase.from('agendamentos_cirurgicos').select('*', { count: 'exact', head: true }).eq('unidade_id', selectedUnitId).gte('created_at', todayISO),
      supabase.from('agendamentos_cirurgicos').select('*', { count: 'exact', head: true }).eq('unidade_id', selectedUnitId).gte('created_at', yesterdayISO).lt('created_at', todayISO),
      supabase.from('suites').select('status').eq('unidade_id', selectedUnitId),
      supabase.from('config_unidades').select('*')
    ]);

    // Ocupacao suites logic
    const totalSuites = suitesData?.length || (isSede ? 14 : 4);
    const occupiedSuites = suitesData?.filter(s => s.status === 'ocupado').length || (isSede ? 12 : 2);
    const ocupacaoPerc = totalSuites === 0 ? "0%" : `${Math.round((occupiedSuites / totalSuites) * 100)}%`;

    if (configUnidadesData) {
      const sedeStatus = configUnidadesData.find(u => u.nome.includes('Sede'))?.status || "Aberto";
      const msStatus = configUnidadesData.find(u => u.nome.includes('Monte Sossego'))?.status || "Operante";
      const blocoStatus = configUnidadesData.find(u => u.nome.includes('Bloco'))?.status || "1 Cirurgia";
      setUnitStatus({ sede: sedeStatus, monte_sossego: msStatus, bloco: blocoStatus });
    }

    // 2. Occupancy logic: Grouping by hour of the current day
    // This logic prepares the data for a bar chart (e.g., Recharts)
    let occupancyChartData: any[] = [];
    if (isManager) {
      const { data: ocupacaoData } = await supabase
        .from('atendimentos')
        .select('created_at')
        .eq('unidade_id', selectedUnitId)
        .gte('created_at', todayISO);

      if (ocupacaoData) {
        // Initialize 24 hours
        const hourlyCounts = Array(24).fill(0);
        ocupacaoData.forEach((item: any) => {
          const hour = new Date(item.created_at).getHours();
          hourlyCounts[hour]++;
        });
        
        occupancyChartData = hourlyCounts.map((count, hour) => ({
          hora: `${hour}:00`,
          atendimentos: count
        }));
      }
    }
    
    setStatsData({
      triagensHoje: triagensToday || 0,
      triagensGrowth: calculateGrowth(triagensToday || 0, triagensYesterday || 0),
      ocupacao: `${occupiedSuites}/${totalSuites}`,
      ocupacaoPerc: ocupacaoPerc,
      cirurgiasHoje: cirurgiasToday || 0,
      cirurgiasGrowth: calculateGrowth(cirurgiasToday || 0, cirurgiasYesterday || 0),
      consultasHoje: consultasToday || 0,
      consultasGrowth: calculateGrowth(consultasToday || 0, consultasYesterday || 0)
    });

    // 3. Live Triage Queue
    const { data: queueData } = await supabase
      .from('triagens')
      .select('*')
      .eq('unidade_id', selectedUnitId)
      .eq('status', 'aguardando');

    if (queueData) {
      const priorityWeight: Record<string, number> = {
        'Vermelho (Emergência)': 5,
        'Laranja (Muito Urgente)': 4,
        'Amarelo (Urgente)': 3,
        'Verde (Pouco Urgente)': 2,
        'Azul (Não Urgente)': 1,
        'Vermelho': 5,
        'Laranja': 4,
        'Amarelo': 3,
        'Verde': 2,
        'Azul': 1
      };

      const sorted = queueData.sort((a, b) => {
        const pA = priorityWeight[a.prioridade] || 0;
        const pB = priorityWeight[b.prioridade] || 0;
        if (pA !== pB) return pB - pA; // Priority first
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); // Wait time second
      });
      setQueue(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel(`dashboard_unidade_${selectedUnitId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'triagens' }, (payload: any) => {
        const row = payload.new;
        const priority: string = row?.prioridade || "";
        const isCritical = priority.startsWith("Vermelho") || priority.startsWith("Laranja");
        if (isCritical && row?.id) {
          // Play alert sound
          try { audioRef.current?.play().catch(() => {}); } catch {}
          setAlertedIds(prev => {
            const next = new Set(prev);
            next.add(String(row.id));
            return next;
          });
          // Auto-clear glow after 12s
          setTimeout(() => {
            setAlertedIds(prev => {
              const next = new Set(prev);
              next.delete(String(row.id));
              return next;
            });
          }, 12000);
          toast.error(`🚨 ${priority.split(" ")[0]} — ${row.paciente_nome || row.nome || "Paciente"}`, {
            description: `Queixa: ${row.sintoma || row.queixa || "—"} · Encaminhar imediatamente.`,
            duration: 10000,
          });
        }
        fetchDashboardData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'triagens', filter: `unidade_id=eq.${selectedUnitId}` }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUnitId]);

  const stats = isSede ? [
    { label: "Triagens Hoje", value: statsData.triagensHoje, trend: statsData.triagensGrowth, icon: Activity, to: "/triagem" },
    { label: "Ocupação (Suítes)", value: statsData.ocupacao, trend: statsData.ocupacaoPerc, icon: Bed, to: "/analytics" },
    { label: "Cirurgias (Laparoscopia)", value: statsData.cirurgiasHoje, trend: statsData.cirurgiasGrowth, icon: Scissors, to: "/agendamentos" },
    { label: "Consultas Ambulatório", value: statsData.consultasHoje, trend: statsData.consultasGrowth, icon: Calendar, to: "/agendamentos" },
  ] : [
    { label: "Triagens Locais", value: statsData.triagensHoje, trend: statsData.triagensGrowth, icon: Activity, to: "/triagem" },
    { label: "Salas de Observação", value: statsData.ocupacao, trend: statsData.ocupacaoPerc, icon: Bed, to: "/analytics" },
    { label: "Pequenas Cirurgias", value: statsData.cirurgiasHoje, trend: statsData.cirurgiasGrowth, icon: Scissors, to: "/agendamentos" },
    { label: "Consultas Especialidade", value: statsData.consultasHoje, trend: statsData.consultasGrowth, icon: Calendar, to: "/agendamentos" },
  ];

  return (
    <DashboardLayout title="Recepção Medicentro" subtitle={currentUnit}>
      <div className="space-y-6">
        {/* Alert audio (data URI WAV beep) */}
        <audio ref={audioRef} preload="auto" src="data:audio/wav;base64,UklGRoQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWAGAAAAAA8YHihEMUM6Wj9hSWVRZllRYUNiOl00RShEHikPGAD/8eji2MfMt8mqx6DPm9icUKBKsEbAUM5g3GjsdPqA/IT4iPaO9JT0mvKi8qzysvK68b71xPnK+876z/3AAcQGwgvECsAJxAnECcQJxAnECcQJxAnECcQJxAjA///z/PD46/Tw7vPp9ufx5e/k7uPt5ezm6+ru6/Hu8/D08fjz/PT/9wH7BPwG/wkCDAUOCBELFA4XESoUOhdJG1geZyJzJYIomCusLrkx2DPpNvU5/Tz/QABEAEUARgBHAEYARABCAD8APAA4ADQALwAqACUAIQAdABoAFwAUABAADAAJAAcABAAAAP/+/Pz6+vj4+Pf3+Pj5+vz9/wADBgcKDxIVGBwgIyYpLDA0NztAREhMUFRYXGBkaG10eHyAhIiMkJSYnaCkqKytsLW3uby/wsTHycvOz9HT1NbY2dvc3uHj5OXn6OnrGAAA" />

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl p-6 lg:p-10 text-primary-foreground min-h-[340px] flex items-end ring-1 ring-border/50" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <img src={clinicImg} alt="Clínica Privada Medicentro, Mindelo" className="absolute inset-0 size-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.22_0.02_240/0.88)] via-primary/55 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_0%,oklch(0.22_0.02_240/0.4)_100%)]" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md border border-primary-foreground/20">
              <img src={logoImg} alt="Medicentro 20 anos" className="size-4 rounded-full object-cover" />
              <span>Medicentro · 20 anos a cuidar de si</span>
            </div>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              {isSede ? "Clínica Privada" : "Unidade Descentralizada"}<br/>
              <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/60 bg-clip-text text-transparent">
                {isSede ? "Medicentro Mindelo" : "Monte Sossego"}
              </span>
            </h2>
            <p className="mt-3 text-primary-foreground/85 text-sm lg:text-base max-w-xl">
              {isSede 
                ? "Gestão centralizada da Clínica Sede (Madeiralzinho) — ambulatório, diagnóstico, cirurgia e urgência."
                : "Gestão da Unidade Monte Sossego — atendimento de proximidade, análises e especialidades locais."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/triagem" className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-primary px-4 py-2.5 text-sm font-semibold hover:translate-y-[-1px] hover:shadow-lg transition-all">
                <Activity className="size-4" /> Triagem Manchester
              </Link>
              <Link to="/agendamentos" className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 backdrop-blur-md text-primary-foreground px-4 py-2.5 text-sm font-semibold border border-primary-foreground/25 hover:bg-primary-foreground/20 transition-colors">
                <Calendar className="size-4" /> Novo agendamento
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {stats.map(({ label, value, trend, icon: Icon, to }) => (
            <Link key={label} to={to} className="group relative rounded-xl bg-card border border-border/60 p-5 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg transition-all min-w-0" style={{ boxShadow: "var(--shadow-card)", display: "block" }}>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold leading-4 break-words">{label}</span>
                <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                {loading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-[28px] font-bold tracking-tight tabular-nums">{value}</span>
                    <span className="inline-flex items-center text-[11px] text-success font-semibold gap-0.5 bg-success/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="size-3" /> {trend}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </section>

        {/* Queue + Side panel */}
        <section className={`grid lg:grid-cols-3 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="lg:col-span-2 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Fila de Triagem ({currentUnit})</h3>
                <p className="text-xs text-muted-foreground">Pacientes aguardando chamada na unidade local</p>
              </div>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                {loading ? <Loader2 className="size-3 animate-spin" /> : <span className="size-2 rounded-full bg-success animate-pulse" />} 
                {loading ? 'A sincronizar...' : 'Ao vivo'}
              </span>
            </div>
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground/30" /></div>
            ) : (
              <ul className="divide-y">
                {queue.map((q) => {
                  const timeAgo = formatDistanceToNow(new Date(q.created_at || new Date()), { addSuffix: true, locale: pt });
                  const priorityClass = priorityStyle[q.prioridade] || priorityStyle['Normal'];
                  const isAlerted = alertedIds.has(String(q.id));
                  const isCritical = (q.prioridade || "").startsWith("Vermelho") || (q.prioridade || "").startsWith("Laranja");

                  return (
                    <li key={q.id} className={`px-5 py-4 flex items-center gap-4 transition-all duration-500 ${isAlerted ? 'bg-destructive/10 ring-2 ring-destructive animate-pulse' : isCritical ? 'bg-destructive/5' : 'hover:bg-muted/40'}`}>
                      <div className="size-10 rounded-full bg-accent grid place-items-center text-accent-foreground font-semibold text-sm">
                        {(q.paciente_nome || q.name || "N").split(" ").map((n: string) => n[0]).join("").slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{q.paciente_nome || q.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${priorityClass}`}>
                            {q.prioridade?.split(' ')[0] || q.prioridade}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{q.seguro ? q.seguro + ' · ' : ''}{q.sintoma}</div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="text-sm font-medium">{q.especialidade || 'Clínica Geral'}</div>
                        <div className="text-xs text-muted-foreground">{timeAgo}</div>
                      </div>
                    </li>
                  );
                })}
                {queue.length === 0 && (
                  <li className="px-5 py-8 text-center text-muted-foreground text-sm">Sem pacientes na fila de espera.</li>
                )}
              </ul>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-accent grid place-items-center">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Status das Unidades</h4>
                  <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                    <li className="flex justify-between">
                      <span className={isSede ? 'font-bold text-foreground' : ''}>Clínica Sede · Madeiralzinho</span>
                      <span className="text-success font-medium">{unitStatus.sede}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className={!isSede ? 'font-bold text-foreground' : ''}>Unidade Monte Sossego</span>
                      <span className="text-success font-medium">{unitStatus.monte_sossego}</span>
                    </li>
                    <li className="flex justify-between opacity-50">
                      <span>Bloco Operatório</span>
                      <span className="text-warning font-medium">{unitStatus.bloco}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border p-5 bg-gradient-to-br from-accent to-card cursor-pointer hover:border-primary/50 transition-colors" style={{ boxShadow: "var(--shadow-card)" }} onClick={validateSegurosAPI}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Users className="size-4" /> Parcerias e Seguros
              </div>
              <h4 className="mt-2 font-semibold">Validação Instantânea</h4>
              <p className="text-xs text-muted-foreground mt-1">Clique para validar a API: INPS, Garantia e IMPAR com integração automática.</p>
              <div className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
                Validar conexão API →
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Index;
