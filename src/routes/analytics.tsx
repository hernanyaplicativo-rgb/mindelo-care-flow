import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { BarChart3, TrendingUp, PieChart, Activity, Users, DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Gestão Estratégica (BI) — Medicentro" },
      { name: "description", content: "Dashboard de análise financeira e operacional da Medicentro." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  
  // States that will be fed by Supabase
  const [faturacaoTotal, setFaturacaoTotal] = useState("4.2M");
  const [conveniosData, setConveniosData] = useState([
    { name: "Privado (Pagamento Direto)", percent: 45, color: "bg-primary", value: "1.89M CVE" },
    { name: "Garantia Seguros", percent: 25, color: "bg-success", value: "1.05M CVE" },
    { name: "INPS (Comparticipações)", percent: 20, color: "bg-warning", value: "840K CVE" },
    { name: "IMPAR & Outros", percent: 10, color: "bg-accent", value: "420K CVE" },
  ]);
  const [especialidadesData, setEspecialidadesData] = useState([
    { label: "Clínica Geral", value: 100, color: "bg-primary" },
    { label: "Cirurgia", value: 65, color: "bg-primary/80" },
    { label: "Cardio", value: 55, color: "bg-primary/60" },
    { label: "Ginecologia", value: 40, color: "bg-primary/50" },
    { label: "Pediatria", value: 30, color: "bg-primary/40" },
  ]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Attempt to fetch from real Supabase table "atendimentos"
        const { data, error } = await supabase
          .from('atendimentos')
          .select('valor, convenio, especialidade');

        if (error || !data || data.length === 0) {
          throw new Error("Tabela não existe ou está vazia. Usando fallback.");
        }

        // Logic to aggregate data dynamically if table exists:
        let total = 0;
        const convMap: Record<string, number> = {};
        const espMap: Record<string, number> = {};

        data.forEach(item => {
          total += Number(item.valor) || 0;
          convMap[item.convenio] = (convMap[item.convenio] || 0) + (Number(item.valor) || 0);
          espMap[item.especialidade] = (espMap[item.especialidade] || 0) + 1;
        });

        setFaturacaoTotal(`${(total / 1000000).toFixed(1)}M`);

        // Format charts based on actual DB logic
        const colors = ["bg-primary", "bg-success", "bg-warning", "bg-accent"];
        const convArray = Object.entries(convMap).map(([name, val], idx) => ({
          name,
          percent: Math.round((val / total) * 100) || 0,
          color: colors[idx % colors.length],
          value: `${(val / 1000).toFixed(1)}K CVE`
        })).sort((a,b) => b.percent - a.percent);

        if (convArray.length > 0) setConveniosData(convArray);

      } catch (err) {
        console.log("Using simulated BI data while Supabase credentials/table are missing.");
      } finally {
        // Simulate network delay for effect
        setTimeout(() => setLoading(false), 1200);
      }
    }

    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout title="Inteligência de Negócios (BI)" subtitle="Visão Executiva Medicentro">
      <div className="space-y-6 max-w-7xl">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Faturação Mensal</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{loading ? <div className="h-8 w-24 bg-muted rounded animate-pulse" /> : `${faturacaoTotal} CVE`}</h3>
                </div>
              </div>
              <div className="size-10 rounded-full bg-success/10 grid place-items-center">
                <DollarSign className="size-5 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-success font-medium">
              <TrendingUp className="size-3" /> +14.5% em relação a Abril
            </div>
          </div>
          
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ocupação Hospitalar</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse" /> : `82%`}</h3>
                </div>
              </div>
              <div className="size-10 rounded-full bg-primary/10 grid place-items-center">
                <Activity className="size-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              Média de 11.5 suítes ocupadas diariamente
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pacientes (Novos)</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse" /> : `342`}</h3>
                </div>
              </div>
              <div className="size-10 rounded-full bg-accent text-accent-foreground grid place-items-center">
                <Users className="size-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-success font-medium">
              <TrendingUp className="size-3" /> Crescimento via Hotéis Parceiros
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Gráfico de Faturação por Seguradora */}
          <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <PieChart className="size-5" />
                <h3 className="font-semibold text-foreground">Receita por Entidade Financiadora</h3>
              </div>
              {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </div>
            
            <div className="space-y-4 flex-1">
              {loading ? (
                <div className="space-y-4 pt-2">
                  {[1,2,3,4].map(i => (
                    <div key={i}>
                      <div className="flex justify-between mb-2"><div className="h-4 w-32 bg-muted rounded animate-pulse" /><div className="h-4 w-16 bg-muted rounded animate-pulse" /></div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden" />
                    </div>
                  ))}
                </div>
              ) : (
                conveniosData.map(item => (
                  <div key={item.name} className="animate-in fade-in slide-in-from-left-2 duration-500">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-muted-foreground">{item.name}</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mapa de Calor - Especialidades Mais Procuradas */}
          <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <BarChart3 className="size-5" />
                <h3 className="font-semibold text-foreground">Mapa de Demanda (Top Especialidades)</h3>
              </div>
              {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </div>
            
            <div className="flex items-end gap-2 h-48 mt-4 pt-4 border-b border-l border-muted-foreground/20 px-2 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-end gap-2 px-2 pb-5">
                  {[40, 70, 50, 80, 30].map((h, i) => <div key={i} className="flex-1 bg-muted rounded-t-md animate-pulse" style={{ height: `${h}%` }} />)}
                </div>
              ) : (
                especialidadesData.map(bar => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center justify-end gap-2 group animate-in zoom-in-90 duration-500">
                    <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}%</span>
                    <div className={`w-full rounded-t-md ${bar.color} transition-all duration-1000 ease-out hover:brightness-110`} style={{ height: `${bar.value}%` }} />
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground text-center truncate w-full pt-1">{bar.label}</span>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Recomendação IA: Abrir novos horários para <strong>Cirurgia Geral</strong> devido à alta demanda nas últimas 72h.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AnalyticsPage;
