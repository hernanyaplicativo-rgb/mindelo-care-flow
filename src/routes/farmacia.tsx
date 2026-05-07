import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Pill, AlertTriangle, Package, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/farmacia")({
  head: () => ({
    meta: [
      { title: "Farmácia & Stock — Medicentro" },
      { name: "description", content: "Gestão de medicamentos, consumíveis e validades." },
    ],
  }),
  component: FarmaciaPage,
});

const stock = [
  { name: "Paracetamol 500mg", cat: "Analgésico", qty: 1240, min: 500, exp: "2027-08", status: "ok" },
  { name: "Amoxicilina 875mg", cat: "Antibiótico", qty: 86, min: 200, exp: "2026-11", status: "low" },
  { name: "Soro Fisiológico 500ml", cat: "Consumível", qty: 320, min: 150, exp: "2028-01", status: "ok" },
  { name: "Insulina Lantus", cat: "Hormonal · Frio", qty: 12, min: 20, exp: "2026-07", status: "low" },
  { name: "Adrenalina 1mg/ml", cat: "Emergência", qty: 18, min: 25, exp: "2026-05", status: "exp" },
  { name: "Luvas Nitrilo M", cat: "EPI", qty: 4500, min: 2000, exp: "2030-12", status: "ok" },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  ok: { label: "OK", cls: "bg-success/15 text-success" },
  low: { label: "Stock baixo", cls: "bg-warning/15 text-warning" },
  exp: { label: "Validade próxima", cls: "bg-destructive/15 text-destructive" },
};

function FarmaciaPage() {
  return (
    <DashboardLayout title="Farmácia & Stock" subtitle="Medicamentos, consumíveis e EPI">
      <div className="space-y-6 max-w-7xl">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Referências activas", v: "428", i: Pill },
            { l: "Stock baixo", v: "12", i: TrendingDown },
            { l: "Validade < 90 dias", v: "5", i: AlertTriangle },
            { l: "Encomendas pendentes", v: "3", i: Package },
          ].map(({ l, v, i: I }) => (
            <div key={l} className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{l}</span>
                <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary"><I className="size-4" /></div>
              </div>
              <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{v}</div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold">Inventário</h3>
            <p className="text-xs text-muted-foreground">Alertas automáticos por stock mínimo e validade</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2.5 font-semibold">Produto</th>
                <th className="text-left px-5 py-2.5 font-semibold">Categoria</th>
                <th className="text-right px-5 py-2.5 font-semibold">Qtd</th>
                <th className="text-right px-5 py-2.5 font-semibold">Mín.</th>
                <th className="text-right px-5 py-2.5 font-semibold">Validade</th>
                <th className="text-right px-5 py-2.5 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stock.map((s) => (
                <tr key={s.name} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{s.cat}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">{s.qty}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{s.min}</td>
                  <td className="px-5 py-3 text-right text-xs">{s.exp}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span>
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

export default FarmaciaPage;