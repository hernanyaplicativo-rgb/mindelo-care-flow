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

import { useRole } from "@/hooks/useRole";
import { useState } from "react";
import { Settings2, Plus, Save, X } from "lucide-react";

function FaturacaoPage() {
  const { currentRole } = useRole();
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [prices, setPrices] = useState([
    { id: 1, service: "Consulta Geral", price: "3.500", category: "Atendimento" },
    { id: 2, service: "Ecocardiograma", price: "8.500", category: "Exames" },
    { id: 3, service: "Análises Sangue (Base)", price: "2.800", category: "Laboratório" },
    { id: 4, service: "Urgência (Manchester)", price: "5.000", category: "Urgência" },
  ]);

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