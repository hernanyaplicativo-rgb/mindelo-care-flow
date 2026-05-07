import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useRole } from "@/hooks/useRole";
import { useState } from "react";
import { Pill, AlertTriangle, Package, TrendingDown, Edit3, Plus, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/farmacia")({
  head: () => ({
    meta: [
      { title: "Farmácia & Stock — Medicentro" },
      { name: "description", content: "Gestão de medicamentos, consumíveis e validades." },
    ],
  }),
  component: FarmaciaPage,
});

const statusMap: Record<string, { label: string; cls: string }> = {
  ok: { label: "OK", cls: "bg-success/15 text-success" },
  low: { label: "Stock baixo", cls: "bg-warning/15 text-warning" },
  exp: { label: "Validade próxima", cls: "bg-destructive/15 text-destructive" },
};

function FarmaciaPage() {
  const { currentRole } = useRole();
  const [q, setQ] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [stockItems, setStockItems] = useState([
    { name: "Paracetamol 500mg", cat: "Analgésico", qty: 1240, min: 500, exp: "2027-08", status: "ok" },
    { name: "Amoxicilina 875mg", cat: "Antibiótico", qty: 86, min: 200, exp: "2026-11", status: "low" },
    { name: "Soro Fisiológico 500ml", cat: "Consumível", qty: 320, min: 150, exp: "2028-01", status: "ok" },
    { name: "Insulina Lantus", cat: "Hormonal · Frio", qty: 12, min: 20, exp: "2026-07", status: "low" },
    { name: "Adrenalina 1mg/ml", cat: "Emergência", qty: 18, min: 25, exp: "2026-05", status: "exp" },
    { name: "Luvas Nitrilo M", cat: "EPI", qty: 4500, min: 2000, exp: "2030-12", status: "ok" },
  ]);

  const filtered = stockItems.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <DashboardLayout title="Farmácia & Stock" subtitle="Medicamentos, consumíveis e EPI">
      <div className="space-y-6 max-w-[1400px]">
        
        {/* Manager Actions Bar */}
        {currentRole === 'admin' && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Package className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Gestão de Inventário (Gerente)</h4>
                <p className="text-xs text-muted-foreground">Você pode editar quantidades e categorias.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all">
                <Plus className="size-3.5" /> Adicionar Produto
              </button>
            </div>
          </div>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Referências activas", v: stockItems.length, i: Pill },
            { l: "Stock baixo", v: stockItems.filter(s => s.status === 'low').length, i: TrendingDown },
            { l: "Validade < 90 dias", v: stockItems.filter(s => s.status === 'exp').length, i: AlertTriangle },
            { l: "Valor em Stock", v: "1.2M CVE", i: Package },
          ].map(({ l, v, i: I }) => (
            <div key={l} className="rounded-2xl bg-card border p-5 flex flex-col gap-3 group hover:border-primary/30 transition-all" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold">{l}</span>
                <div className="size-8 rounded-lg bg-primary/5 grid place-items-center text-primary group-hover:scale-110 transition-transform"><I className="size-4" /></div>
              </div>
              <div className="text-2xl font-bold tracking-tight tabular-nums">{v}</div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border bg-card overflow-hidden shadow-sm" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="px-6 py-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <div>
              <h3 className="font-bold text-lg">Inventário Geral</h3>
              <p className="text-xs text-muted-foreground font-medium">Controle de stock mínimo e validades críticas</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Pesquisar produto..." 
                  className="bg-background border rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                />
              </div>
              <button className="p-2 rounded-xl border bg-background hover:bg-muted transition-colors"><Filter className="size-4" /></button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-widest text-muted-foreground border-b">
              <tr>
                <th className="text-left px-6 py-3.5 font-bold">Produto</th>
                <th className="text-left px-6 py-3.5 font-bold">Categoria</th>
                <th className="text-right px-6 py-3.5 font-bold">Qtd Atual</th>
                <th className="text-right px-6 py-3.5 font-bold">Mínimo</th>
                <th className="text-right px-6 py-3.5 font-bold">Validade</th>
                <th className="text-right px-6 py-3.5 font-bold">Estado</th>
                {currentRole === 'admin' && <th className="text-right px-6 py-3.5 font-bold">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((s, idx) => (
                <tr key={s.name} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{s.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg border">{s.cat}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingItem === s.name ? (
                      <input 
                        type="number"
                        className="w-20 bg-background border rounded px-2 py-1 text-right font-bold"
                        value={s.qty}
                        onChange={(e) => {
                          const newStock = [...stockItems];
                          newStock[idx].qty = parseInt(e.target.value);
                          setStockItems(newStock);
                        }}
                      />
                    ) : (
                      <span className={`font-bold tabular-nums ${s.qty <= s.min ? 'text-destructive' : 'text-foreground'}`}>{s.qty}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-muted-foreground font-medium">{s.min}</td>
                  <td className="px-6 py-4 text-right text-xs font-mono">{s.exp}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${statusMap[s.status].cls} shadow-sm border`}>{statusMap[s.status].label}</span>
                  </td>
                  {currentRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setEditingItem(editingItem === s.name ? null : s.name)}
                        className={`p-2 rounded-lg transition-all ${editingItem === s.name ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                      >
                        {editingItem === s.name ? <Plus className="size-4 rotate-45" /> : <Edit3 className="size-4" />}
                      </button>
                    </td>
                  )}
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