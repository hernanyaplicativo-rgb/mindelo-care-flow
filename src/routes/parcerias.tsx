import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Building2, MapPin, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/parcerias")({
  head: () => ({
    meta: [
      { title: "Parcerias Clínicas — Urgimed" },
      { name: "description", content: "Gestão de parcerias entre hotéis e clínicas em Mindelo." },
    ],
  }),
  component: ParceriasPage,
});

const partners = [
  { name: "Medicentro Clínico de Especialidades", address: "Rua Alberto Leite, Mindelo", referrals: 14, commission: "12%", featured: true },
  { name: "Clínica Dental Mindelo", address: "Av. Marginal, Mindelo", referrals: 8, commission: "15%" },
  { name: "Hospital Dr. Baptista de Sousa", address: "Monte Sossego, Mindelo", referrals: 6, commission: "8%" },
  { name: "Centro de Cardiologia SV", address: "Rua de Lisboa, Mindelo", referrals: 3, commission: "10%" },
];

const reports = [
  { hotel: "Foya Branca Resort", clinic: "Medicentro", patient: "M. Dubois", value: "€85", status: "Pago" },
  { hotel: "Oasis Atlântico", clinic: "Clínica Dental", patient: "J. Carter", value: "€140", status: "Pendente" },
  { hotel: "Urgimed Hospitality", clinic: "Medicentro", patient: "S. Rossi", value: "€60", status: "Pago" },
];

function ParceriasPage() {
  return (
    <DashboardLayout title="Parcerias" subtitle="Hotéis ↔ Clínicas · Comissões e relatórios">
      <div className="space-y-6">
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map(p => (
            <div key={p.name} className={`rounded-xl border p-5 ${p.featured ? "bg-gradient-to-br from-accent to-card border-primary/30" : "bg-card"}`} style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="size-10 rounded-lg bg-primary/10 grid place-items-center mb-3">
                <Building2 className="size-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm leading-tight">{p.name}</h4>
              <div className="mt-2 flex items-start gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 mt-0.5 shrink-0" /> {p.address}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{p.referrals}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Encaminhados/sem</div>
                </div>
                <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded">{p.commission}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Relatórios de Comissão</h3>
              <p className="text-xs text-muted-foreground">Pacientes encaminhados de hotéis para clínicas parceiras</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="size-3" /> +18% mês
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Hotel Origem</th>
                <th className="text-left px-5 py-3 font-medium">Clínica</th>
                <th className="text-left px-5 py-3 font-medium">Paciente</th>
                <th className="text-left px-5 py-3 font-medium">Valor</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((r, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-3">{r.hotel}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.clinic}</td>
                  <td className="px-5 py-3 font-medium">{r.patient}</td>
                  <td className="px-5 py-3 font-semibold">{r.value}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === "Pago" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{r.status}</span>
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