import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { BarChart3, TrendingUp, PieChart, Activity, Users, DollarSign } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Gestão Estratégica (BI) — Urgimed" },
      { name: "description", content: "Dashboard de análise financeira e operacional da Urgimed." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <DashboardLayout title="Inteligência de Negócios (BI)" subtitle="Visão Executiva Urgimed Health Hospitality">
      <div className="space-y-6 max-w-7xl">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Faturação Mensal</p>
                <h3 className="text-2xl font-bold mt-1">4.2M CVE</h3>
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
                <h3 className="text-2xl font-bold mt-1">82%</h3>
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
                <h3 className="text-2xl font-bold mt-1">342</h3>
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
          {/* Gráfico de Faturação por Seguradora (Simulado) */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <PieChart className="size-5" />
              <h3 className="font-semibold text-foreground">Receita por Entidade Financiadora</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Privado (Pagamento Direto)", percent: 45, color: "bg-primary", value: "1.89M CVE" },
                { name: "Garantia Seguros", percent: 25, color: "bg-success", value: "1.05M CVE" },
                { name: "INPS (Comparticipações)", percent: 20, color: "bg-warning", value: "840K CVE" },
                { name: "IMPAR & Outros", percent: 10, color: "bg-accent", value: "420K CVE" },
              ].map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-muted-foreground">{item.name}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa de Calor - Especialidades Mais Procuradas */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <BarChart3 className="size-5" />
              <h3 className="font-semibold text-foreground">Mapa de Demanda (Top 5 Especialidades)</h3>
            </div>
            
            <div className="flex items-end gap-2 h-48 mt-4 pt-4 border-b border-l border-muted-foreground/20 px-2">
              {[
                { label: "Clínica Geral", value: 100, color: "bg-primary" },
                { label: "Cirurgia", value: 65, color: "bg-primary/80" },
                { label: "Cardio", value: 55, color: "bg-primary/60" },
                { label: "Ginecologia", value: 40, color: "bg-primary/50" },
                { label: "Pediatria", value: 30, color: "bg-primary/40" },
              ].map(bar => (
                <div key={bar.label} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                  <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}%</span>
                  <div className={`w-full rounded-t-md ${bar.color} transition-all duration-500 hover:brightness-110`} style={{ height: `${bar.value}%` }} />
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground text-center truncate w-full pt-1">{bar.label}</span>
                </div>
              ))}
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
