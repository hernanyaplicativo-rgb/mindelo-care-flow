import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { FileHeart, Search, Pill, Activity, Stethoscope, ClipboardList } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/prontuario")({
  head: () => ({
    meta: [
      { title: "Prontuário Eletrónico — Medicentro" },
      { name: "description", content: "Histórico clínico unificado dos pacientes." },
    ],
  }),
  component: ProntuarioPage,
});

const patients = [
  { id: 1, name: "Maria Évora", age: 42, doc: "1234567", insurance: "INPS", risk: "Hipertensa" },
  { id: 2, name: "João Silva", age: 58, doc: "8765432", insurance: "Garantia", risk: "Diabético tipo 2" },
  { id: 3, name: "Ana Tavares", age: 7, doc: "5552233", insurance: "IMPAR", risk: "Asma leve" },
  { id: 4, name: "Pedro Lima", age: 31, doc: "4445566", insurance: "Particular", risk: "—" },
];

const history = [
  { d: "2026-05-02", t: "Consulta · Cardiologia", who: "Dr. Fernando Lopes", note: "TA 145/95. Ajuste de losartan 50mg." },
  { d: "2026-04-18", t: "Análises", who: "Lab. Medicentro", note: "Glicemia 132mg/dl. HbA1c 6.8%." },
  { d: "2026-03-10", t: "Ecografia abdominal", who: "Imagem", note: "Sem alterações significativas." },
  { d: "2025-12-04", t: "Triagem urgência", who: "Manchester · Amarelo", note: "Cefaleia. Resolução com analgésico." },
];

function ProntuarioPage() {
  const [sel, setSel] = useState(patients[0]);
  const [q, setQ] = useState("");
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.doc.includes(q));

  return (
    <DashboardLayout title="Prontuário Eletrónico" subtitle="Histórico clínico unificado · RGPD">
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 max-w-7xl">
        <aside className="rounded-xl border bg-card p-4 space-y-3 h-fit" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome ou nº doc…" className="w-full bg-background border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => setSel(p)} className={`w-full text-left rounded-lg p-3 border transition ${sel.id === p.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/40"}`}>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-accent grid place-items-center text-accent-foreground text-xs font-bold">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.age}a · {p.insurance}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="rounded-xl border bg-card p-5 flex items-start gap-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-[var(--primary-glow)] grid place-items-center text-primary-foreground text-lg font-bold">
              {sel.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">{sel.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-warning/15 text-warning px-2 py-0.5 rounded-full">{sel.risk}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{sel.age} anos · Doc {sel.doc} · {sel.insurance}</div>
            </div>
            <button className="text-xs font-semibold text-primary hover:underline">Nova nota clínica →</button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { i: Activity, l: "Sinais vitais", v: "TA 145/95 · FC 78" },
              { i: Pill, l: "Medicação activa", v: "3 fármacos" },
              { i: ClipboardList, l: "Alergias", v: "Penicilina" },
            ].map(({ i: I, l, v }) => (
              <div key={l} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <I className="size-3.5 text-primary" /> {l}
                </div>
                <div className="mt-1.5 font-semibold text-sm">{v}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="px-5 py-4 border-b flex items-center gap-2">
              <FileHeart className="size-4 text-primary" />
              <h4 className="font-semibold text-sm">Histórico clínico</h4>
            </div>
            <ol className="divide-y">
              {history.map((h) => (
                <li key={h.d} className="px-5 py-4 flex gap-4">
                  <div className="text-[11px] text-muted-foreground tabular-nums w-24 shrink-0 font-mono">{h.d}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <Stethoscope className="size-3.5 text-primary" /> {h.t}
                    </div>
                    <div className="text-xs text-muted-foreground">{h.who}</div>
                    <div className="text-sm mt-1">{h.note}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ProntuarioPage;