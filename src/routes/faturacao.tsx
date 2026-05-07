import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Receipt, TrendingUp, CreditCard, Wallet, Download } from "lucide-react";

export const Route = createFileRoute("/faturacao")({
  head: () => ({
    meta: [
      { title: "Faturação & Caixa — Medicentro" },
      { name: "description", content: "Gestão de faturação, recibos e caixa diária da Medicentro." },
    ],
  }),
  component: FaturacaoPage,
});

const kpis = [
  { label: "Caixa Hoje", value: "284.500 CVE", trend: "+12%", icon: Wallet },
  { label: "Faturas emitidas", value: "63", trend: "+5", icon: Receipt },
  { label: "Por liquidar (INPS)", value: "47.200 CVE", trend: "-3%", icon: CreditCard },
  { label: "Receita mês", value: "5.8M CVE", trend: "+18%", icon: TrendingUp },
];

const invoices = [
  { n: "FT 2026/0412", patient: "Maria Évora", value: "3.500 CVE", status: "Pago", method: "Vinti4" },
  { n: "FT 2026/0411", patient: "João Silva", value: "12.800 CVE", status: "INPS", method: "Convénio" },
  { n: "FT 2026/0410", patient: "Ana Tavares", value: "5.200 CVE", status: "Pago", method: "Numerário" },
  { n: "FT 2026/0409", patient: "Pedro Lima", value: "28.000 CVE", status: "Pendente", method: "Garantia" },
  { n: "FT 2026/0408", patient: "Sofia Brito", value: "1.800 CVE", status: "Pago", method: "MobiCash" },
];

const statusStyle: Record<string, string> = {
  Pago: "bg-success/15 text-success",
  Pendente: "bg-warning/15 text-warning",
  INPS: "bg-primary/10 text-primary",
};

function FaturacaoPage() {
  return (
    <DashboardLayout title="Faturação & Caixa" subtitle="Recibos, convénios e fecho diário">
      <div className="space-y-6 max-w-7xl">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, trend, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
                <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary"><Icon className="size-4" /></div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight tabular-nums">{value}</span>
                <span className="text-[11px] text-success font-semibold">{trend}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Faturas recentes</h3>
              <p className="text-xs text-muted-foreground">Hoje · Clínica Sede</p>
            </div>
            <button className="inline-flex items-center gap-2 text-xs font-semibold border rounded-lg px-3 py-1.5 hover:bg-muted">
              <Download className="size-3.5" /> Exportar SAFT
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2.5 font-semibold">Nº</th>
                <th className="text-left px-5 py-2.5 font-semibold">Paciente</th>
                <th className="text-left px-5 py-2.5 font-semibold">Método</th>
                <th className="text-right px-5 py-2.5 font-semibold">Valor</th>
                <th className="text-right px-5 py-2.5 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((i) => (
                <tr key={i.n} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs">{i.n}</td>
                  <td className="px-5 py-3">{i.patient}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{i.method}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{i.value}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusStyle[i.status]}`}>{i.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default FaturacaoPage;