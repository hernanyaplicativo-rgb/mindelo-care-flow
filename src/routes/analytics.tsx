import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { BarChart3, TrendingUp, PieChart, Activity, Users, DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  
  const [mockKPIs, setMockKPIs] = useState({
    faturacaoMensal: "4.2M",
    crescimentoFaturacao: "+14.5%",
    ocupacao: "82%",
    suitesOcupadas: "11.5",
    pacientesNovos: "342"
  });

  const mockReceitas = [
    { entidade: 'Privado', valor: '1.89M CVE', percentagem: 45, cor: 'bg-green-500' },
    { entidade: 'Garantia Seguros', valor: '1.05M CVE', percentagem: 25, cor: 'bg-green-400' },
    { entidade: 'INPS', valor: '840K CVE', percentagem: 20, cor: 'bg-yellow-500' },
    { entidade: 'IMPAR', valor: '420K CVE', percentagem: 10, cor: 'bg-green-200' }
  ];

  const mockDemanda = [
    { nome: 'Clínica Geral', valor: 60 },
    { nome: 'Cirurgia', valor: 40 },
    { nome: 'Cardio', valor: 25 },
    { nome: 'Ginecologia', valor: 50 },
    { nome: 'Pediatria', valor: 30 }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
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
                  <h3 className="text-2xl font-bold">{loading ? <div className="h-8 w-24 bg-muted rounded animate-pulse" /> : `${mockKPIs.faturacaoMensal} CVE`}</h3>
                </div>
              </div>
              <div className="size-10 rounded-full bg-success/10 grid place-items-center">
                <DollarSign className="size-5 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-success font-medium">
              <TrendingUp className="size-3" /> {mockKPIs.crescimentoFaturacao} em relação a Abril
            </div>
          </div>
          
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ocupação Hospitalar</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse" /> : mockKPIs.ocupacao}</h3>
                </div>
              </div>
              <div className="size-10 rounded-full bg-primary/10 grid place-items-center">
                <Activity className="size-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              Média de {mockKPIs.suitesOcupadas} suítes ocupadas diariamente
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pacientes (Novos)</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse" /> : mockKPIs.pacientesNovos}</h3>
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
            <div className="space-y-4 flex-1 mt-4">
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
                mockReceitas.map(item => (
                  <div key={item.entidade} className="animate-in fade-in slide-in-from-left-2 duration-500">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-muted-foreground">{item.entidade}</span>
                      <span className="font-bold">{item.valor}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.cor} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.percentagem}%` }} />
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
            <div className="h-64 mt-4 w-full">
              {loading ? (
                <div className="flex items-end gap-2 h-full border-b border-l border-muted-foreground/20 px-2">
                  {[40, 70, 50, 80, 30].map((h, i) => <div key={i} className="flex-1 bg-muted rounded-t-md animate-pulse" style={{ height: `${h}%` }} />)}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockDemanda} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="nome" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                      tickLine={false} 
                      axisLine={{ stroke: 'hsl(var(--border))' }} 
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border))', 
                        backgroundColor: 'hsl(var(--card))',
                        color: 'hsl(var(--foreground))',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                      {mockDemanda.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.nome === 'Cirurgia' ? '#eab308' : 'hsl(var(--primary))'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
