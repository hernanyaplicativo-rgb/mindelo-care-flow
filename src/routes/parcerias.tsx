import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Building2, ShieldCheck, TrendingUp, FileText } from "lucide-react";

export const Route = createFileRoute("/parcerias")({
  head: () => ({
    meta: [
      { title: "Seguros e Parcerias — Urgimed" },
      { name: "description", content: "Gestão de convênios, INPS e Seguradoras na Urgimed." },
    ],
  }),
  component: ParceriasPage,
});

const partners = [
  { name: "Garantia Seguros", type: "Seguradora", active: true, format: "Rede Médica", featured: true },
  { name: "IMPAR Seguros", type: "Seguradora", active: true, format: "Reembolso/Rede" },
  { name: "INPS", type: "Previdência Social", active: true, format: "Comparticipação" },
  { name: "BS Care", type: "Seguradora Privada", active: true, format: "Pacotes Institucionais" },
];

const reports = [
  { provider: "Garantia Seguros", service: "Consulta Cirurgia Geral", patient: "M. Dubois", value: "3.500 CVE", status: "Aprovado" },
  { provider: "INPS", service: "Ecografia 3D", patient: "J. Carter", value: "1.200 CVE", status: "Pendente" },
  { provider: "IMPAR", service: "Internamento (Health Hospitality)", patient: "S. Rossi", value: "150.000 CVE", status: "Processado" },
];

function ParceriasPage() {
  return (
    <DashboardLayout title="Seguros e Parcerias" subtitle="Validação de Apólices e Comparticipações INPS">
      <div className="space-y-6">
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map(p => (
            <div key={p.name} className={`rounded-xl border p-5 ${p.featured ? "bg-gradient-to-br from-accent to-card border-primary/30" : "bg-card"}`} style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="size-10 rounded-lg bg-primary/10 grid place-items-center mb-3">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm leading-tight">{p.name}</h4>
              <div className="mt-2 flex items-start gap-1 text-xs text-muted-foreground">
                <Building2 className="size-3 mt-0.5 shrink-0" /> {p.type}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Modalidade</div>
                  <div className="text-sm font-bold mt-1">{p.format}</div>
                </div>
                <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded">Ativo</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Faturação e Comparticipação</h3>
              <p className="text-xs text-muted-foreground">Histórico recente de aprovações de seguros e credenciais INPS</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="size-3" /> +12% processos
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Provedor</th>
                <th className="text-left px-5 py-3 font-medium">Serviço/Exame</th>
                <th className="text-left px-5 py-3 font-medium">Paciente</th>
                <th className="text-left px-5 py-3 font-medium">Valor Comparticipado</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((r, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium flex items-center gap-2">
                    <FileText className="size-3 text-muted-foreground" />
                    {r.provider}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.service}</td>
                  <td className="px-5 py-3">{r.patient}</td>
                  <td className="px-5 py-3 font-semibold">{r.value}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-full font-medium ${
                      r.status === "Aprovado" || r.status === "Processado" 
                        ? "bg-success/15 text-success" 
                        : "bg-warning/15 text-warning"
                    }`}>{r.status}</span>
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

export default ParceriasPage;