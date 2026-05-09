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

type Invoice = { n: string; patient: string; value: number; status: string; method: string };

const initialInvoices: Invoice[] = [
  { n: "FT 2026/0412", patient: "Maria Évora", value: 3500, status: "Pago", method: "Vinti4" },
  { n: "FT 2026/0411", patient: "João Silva", value: 12800, status: "INPS", method: "Convénio" },
  { n: "FT 2026/0410", patient: "Ana Tavares", value: 5200, status: "Pago", method: "Numerário" },
  { n: "FT 2026/0409", patient: "Pedro Lima", value: 28000, status: "Pendente", method: "Garantia" },
  { n: "FT 2026/0408", patient: "Sofia Brito", value: 1800, status: "Pago", method: "MobiCash" },
];

import { useRole } from "@/hooks/useRole";
import { useState, useEffect } from "react";
import { Settings2, Plus, Save, X } from "lucide-react";
import { formatCVE, statusBadgeClass, methodBadgeClass } from "@/lib/format";

function FaturacaoPage() {
  const { currentRole } = useRole();
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [q, setQ] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState<any>(null);
  
  const [invoicesData, setInvoicesData] = useState<Invoice[]>(initialInvoices);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("invoicesData") : null;
      if (saved) setInvoicesData(JSON.parse(saved) as Invoice[]);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem("invoicesData", JSON.stringify(invoicesData)); } catch {}
  }, [invoicesData, hydrated]);

  const [newInvoice, setNewInvoice] = useState({ patient: "", value: 0, method: "Numerário", status: "Pago" });

  const [prices, setPrices] = useState([
    { id: 1, service: "Consulta Geral", price: "3.500", category: "Atendimento" },
    { id: 2, service: "Ecocardiograma", price: "8.500", category: "Exames" },
    { id: 3, service: "Análises Sangue (Base)", price: "2.800", category: "Laboratório" },
    { id: 4, service: "Urgência (Manchester)", price: "5.000", category: "Urgência" },
  ]);

  const filteredInvoices = invoicesData.filter((i: any) => i.patient.toLowerCase().includes(q.toLowerCase()) || i.n.toLowerCase().includes(q.toLowerCase()));
  
  // Calculate Caixa Hoje (Only "Pago")
  const caixaHoje = invoicesData.filter((i: any) => i.status === "Pago").reduce((acc: number, i: any) => acc + i.value, 0);

  const handleAddInvoice = () => {
    if (!newInvoice.patient) return;
    const n = `FT 2026/${(413 + (invoicesData.length - 5)).toString().padStart(4, '0')}`;
    setInvoicesData([{ ...newInvoice, n }, ...invoicesData]);
    setNewInvoice({ patient: "", value: 0, method: "Numerário", status: "Pago" });
    setIsAddModalOpen(false);
  };

  const exportInvoiceCSV = (inv: Invoice) => {
    const rows = [
      ["Numero", "Paciente", "Metodo", "Estado", "Valor (CVE)"],
      [inv.n, inv.patient, inv.method, inv.status, String(inv.value)],
    ];
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.n.replace(/[^\w]+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Faturação & Caixa" subtitle="Recibos, convénios e fecho diário">
      <div className="space-y-6 max-w-7xl pb-10">
        
        {/* Manager Tools */}
        {currentRole === 'admin' && (
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Settings2 className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Painel de Gestão (Gerente)</h4>
                <p className="text-xs text-muted-foreground">Você tem permissão para alterar preços e serviços.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditingPrices(!isEditingPrices)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              {isEditingPrices ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
              {isEditingPrices ? "Fechar Gestão" : "Editar Tabela de Preços"}
            </button>
          </section>
        )}

        {/* Price Editing Modal/View */}
        {isEditingPrices && currentRole === 'admin' && (
          <section className="rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Tabela de Preços de Serviços</h3>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Save className="size-3" /> Alterações são aplicadas em tempo real
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {prices.map((p, idx) => (
                <div key={p.id} className="p-4 rounded-xl border bg-muted/30 flex items-center gap-4 group">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Serviço</label>
                    <input 
                      value={p.service} 
                      onChange={(e) => {
                        const newPrices = [...prices];
                        newPrices[idx].service = e.target.value;
                        setPrices(newPrices);
                      }}
                      className="w-full bg-background border rounded-md px-3 py-1.5 text-sm font-semibold focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Preço (CVE)</label>
                    <input 
                      type="text"
                      value={p.price} 
                      onChange={(e) => {
                        const newPrices = [...prices];
                        newPrices[idx].price = e.target.value;
                        setPrices(newPrices);
                      }}
                      className="w-full bg-background border rounded-md px-3 py-1.5 text-sm font-bold text-primary focus:ring-1 focus:ring-primary text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button className="text-xs font-semibold px-4 py-2 rounded-lg border hover:bg-muted transition-colors">Adicionar Novo Serviço</button>
              <button onClick={() => setIsEditingPrices(false)} className="text-xs font-bold px-6 py-2 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">Guardar Alterações</button>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-card border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Caixa Hoje</span>
              <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary"><Wallet className="size-4" /></div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight tabular-nums">{formatCVE(caixaHoje)}</span>
              <span className="text-[11px] text-success font-semibold">+12%</span>
            </div>
          </div>
          {kpis.slice(1).map(({ label, value, trend, icon: Icon }) => (
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
          <div className="px-5 py-4 border-b flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Faturas recentes</h3>
              <p className="text-xs text-muted-foreground">Hoje · Clínica Sede</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Pesquisar paciente..." 
                className="bg-background border rounded-lg px-3 py-1.5 text-xs w-48 focus:ring-1 focus:ring-primary"
              />
              <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 text-xs font-bold bg-primary text-white border-primary rounded-lg px-3 py-1.5 hover:opacity-90 shadow-sm shadow-primary/20">
                <Plus className="size-3.5" /> Faturar
              </button>
            </div>
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
              {filteredInvoices.map((i: any) => (
                <tr key={i.n} className="hover:bg-muted/30 cursor-pointer group" onClick={() => setDetailsModalOpen(i)}>
                  <td className="px-5 py-3 font-mono text-xs text-primary group-hover:underline">{i.n}</td>
                  <td className="px-5 py-3 font-medium">{i.patient}</td>
                  <td className="px-5 py-3 text-xs"><span className={methodBadgeClass(i.method)}>{i.method}</span></td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatCVE(i.value)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={statusBadgeClass(i.status)}>{i.status}</span>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr><td colSpan={5} className="text-center py-6 text-muted-foreground text-sm">Nenhuma fatura encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* Add Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg mb-4">Criar Nova Fatura</h3>
            <div className="space-y-4">
              <input placeholder="Nome do Paciente" value={newInvoice.patient} onChange={e => setNewInvoice({...newInvoice, patient: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Valor (CVE)" value={newInvoice.value || ''} onChange={e => setNewInvoice({...newInvoice, value: parseInt(e.target.value) || 0})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={newInvoice.method} onChange={e => setNewInvoice({...newInvoice, method: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                <option value="Numerário">Numerário</option>
                <option value="Vinti4">Vinti4</option>
                <option value="Convénio">Convénio</option>
                <option value="MobiCash">MobiCash</option>
              </select>
              <select value={newInvoice.status} onChange={e => setNewInvoice({...newInvoice, status: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="INPS">INPS</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleAddInvoice} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Emitir Fatura</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setDetailsModalOpen(null)} className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-1 rounded-lg transition-colors">
              <X className="size-4" />
            </button>
            <div className="text-center mb-6">
              <div className="size-12 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-3"><Receipt className="size-6" /></div>
              <h3 className="font-bold text-xl">{detailsModalOpen.n}</h3>
              <p className="text-sm text-muted-foreground">Medicentro Mindelo</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Paciente</span> <span className="font-semibold">{detailsModalOpen.patient}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Método</span> <span className={methodBadgeClass(detailsModalOpen.method)}>{detailsModalOpen.method}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Estado</span> <span className={statusBadgeClass(detailsModalOpen.status)}>{detailsModalOpen.status}</span></div>
              <div className="flex justify-between py-3 text-lg"><span className="font-bold text-muted-foreground">Total</span> <span className="font-bold">{formatCVE(detailsModalOpen.value)}</span></div>
            </div>
            <div className="mt-6">
              <button onClick={() => exportInvoiceCSV(detailsModalOpen)} className="w-full py-2.5 rounded-xl border bg-background text-sm font-bold shadow-sm hover:bg-muted transition-colors flex items-center justify-center gap-2">
                <Download className="size-4" /> Exportar Recibo (CSV)
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default FaturacaoPage;