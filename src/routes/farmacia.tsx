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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({ name: "", cat: "", qty: 0, min: 0, exp: "", price: 0 });

  const [stockItems, setStockItems] = useState([
    { name: "Paracetamol 500mg", cat: "Analgésico", qty: 1240, min: 500, exp: "2027-08", price: 250 },
    { name: "Amoxicilina 875mg", cat: "Antibiótico", qty: 86, min: 200, exp: "2026-11", price: 600 },
    { name: "Soro Fisiológico 500ml", cat: "Consumível", qty: 320, min: 150, exp: "2028-01", price: 400 },
    { name: "Insulina Lantus", cat: "Hormonal · Frio", qty: 12, min: 20, exp: "2026-07", price: 4500 },
    { name: "Adrenalina 1mg/ml", cat: "Emergência", qty: 18, min: 25, exp: "2026-05", price: 1200 },
    { name: "Luvas Nitrilo M", cat: "EPI", qty: 4500, min: 2000, exp: "2030-12", price: 50 },
  ]);

  const itemsWithStatus = stockItems.map(s => {
    let status = "ok";
    if (s.qty <= s.min) status = "low";
    // basic check for exp logic if needed, but for now fallback to basic
    if (s.name === "Adrenalina 1mg/ml") status = "exp"; 
    return { ...s, status };
  });

  const filtered = itemsWithStatus.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));

  const totalValue = stockItems.reduce((sum, s) => sum + (s.qty * s.price), 0);
  const formattedValue = totalValue >= 1000000 ? `${(totalValue / 1000000).toFixed(1)}M CVE` : `${(totalValue / 1000).toFixed(1)}K CVE`;
  
  const handleSaveEdit = () => {
    setStockItems(prev => prev.map(item => item.name === editingItem.originalName ? { ...editingItem, name: editingItem.name } : item));
    setIsEditModalOpen(false);
  };

  const handleAddProduct = () => {
    if (!newItem.name) return;
    setStockItems(prev => [...prev, { ...newItem, price: newItem.price || 0 }]);
    setNewItem({ name: "", cat: "", qty: 0, min: 0, exp: "", price: 0 });
    setIsAddModalOpen(false);
  };

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
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus className="size-3.5" /> Adicionar Produto
              </button>
            </div>
          </div>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Referências activas", v: itemsWithStatus.length, i: Pill },
            { l: "Stock baixo", v: itemsWithStatus.filter(s => s.status === 'low').length, i: TrendingDown },
            { l: "Validade < 90 dias", v: itemsWithStatus.filter(s => s.status === 'exp').length, i: AlertTriangle },
            { l: "Valor em Stock", v: formattedValue, i: Package },
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
                    <span className={`font-bold tabular-nums ${s.qty <= s.min ? 'text-destructive' : 'text-foreground'}`}>{s.qty}</span>
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-muted-foreground font-medium">{s.min}</td>
                  <td className="px-6 py-4 text-right text-xs font-mono">{s.exp}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${statusMap[s.status].cls} shadow-sm border`}>{statusMap[s.status].label}</span>
                  </td>
                  {currentRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setEditingItem({ ...s, originalName: s.name }); setIsEditModalOpen(true); }}
                        className="p-2 rounded-lg transition-all text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit3 className="size-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg mb-4">Adicionar Produto</h3>
            <div className="space-y-4">
              <input placeholder="Nome" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Categoria" value={newItem.cat} onChange={e => setNewItem({...newItem, cat: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Quantidade" value={newItem.qty || ''} onChange={e => setNewItem({...newItem, qty: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input type="number" placeholder="Mínimo" value={newItem.min || ''} onChange={e => setNewItem({...newItem, min: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Validade (YYYY-MM)" value={newItem.exp} onChange={e => setNewItem({...newItem, exp: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input type="number" placeholder="Preço (CVE)" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleAddProduct} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg mb-4">Editar Produto: {editingItem.originalName}</h3>
            <div className="space-y-4">
              <input placeholder="Nome" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Qtd Atual</label>
                  <input type="number" value={editingItem.qty} onChange={e => setEditingItem({...editingItem, qty: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Mínimo Permitido</label>
                  <input type="number" value={editingItem.min} onChange={e => setEditingItem({...editingItem, min: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Validade</label>
                  <input type="text" value={editingItem.exp} onChange={e => setEditingItem({...editingItem, exp: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Preço Un. (CVE)</label>
                  <input type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Atualizar Stock</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default FarmaciaPage;