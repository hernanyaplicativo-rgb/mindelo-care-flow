import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, ShieldCheck, Menu, X, ChevronRight, Home, Siren } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

const ROUTE_LABELS: Record<string, string> = {
  "": "Recepção",
  "agendamentos": "Agendamentos",
  "marcacao-online": "Marcação Online",
  "triagem": "Triagem Manchester",
  "prontuario": "Prontuário (EMR)",
  "ditado": "Ditado IA",
  "telemedicina": "Telemedicina",
  "farmacia": "Farmácia & Stock",
  "faturacao": "Faturação & Caixa",
  "parcerias": "Parcerias & Seguros",
  "escala": "Gestão de Escalas",
  "analytics": "Analytics & BI",
  "comunicacao": "WhatsApp & SMS",
  "mobile": "Quiosque (Tablet)",
  "portal": "Portal do Paciente",
  "sos": "SOS · Emergência",
};

export function DashboardLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const now = new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const currentLabel = segments.length === 0 ? "Recepção" : (ROUTE_LABELS[segments[0]] ?? segments[0]);
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — desktop & tablet */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      {/* Sidebar — drawer for tablet/mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full animate-in slide-in-from-left duration-200">
            <Sidebar />
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 -right-12 size-10 rounded-full bg-card border grid place-items-center shadow-lg">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/60 bg-card/70 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
          <div className="min-w-0 flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden size-9 rounded-md hover:bg-muted grid place-items-center text-muted-foreground transition-colors shrink-0">
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-success font-semibold bg-success/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="size-3" /> HIPAA · RGPD
              </span>
            </div>
            {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle} · <span className="capitalize">{now}</span></p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md border border-border/60 bg-muted/40 text-xs text-muted-foreground w-64">
              <Search className="size-3.5" />
              <input placeholder="Buscar paciente, NIF, agendamento…" className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground/70" />
              <kbd className="text-[10px] border rounded px-1 py-0.5 bg-card">⌘K</kbd>
            </div>
            <Link to="/sos" className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <Siren className="size-3.5" /> SOS
            </Link>
            <button className="size-9 rounded-md hover:bg-muted grid place-items-center text-muted-foreground relative transition-colors">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary ring-2 ring-card" />
            </button>
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border/60">
              <div className="size-9 rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] grid place-items-center text-primary-foreground text-sm font-semibold ring-2 ring-card shadow-sm">
                H
              </div>
              <div className="hidden lg:block leading-tight">
                <div className="text-xs font-semibold">Dr. Hernâni</div>
                <div className="text-[10px] text-muted-foreground">Administrador · Medicentro</div>
              </div>
            </div>
          </div>
        </header>
        {/* Breadcrumbs sub-bar (sticky) */}
        <div className="h-10 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-16 z-[9] flex items-center px-4 lg:px-8 text-xs">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-muted-foreground min-w-0 overflow-x-auto custom-scrollbar">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground font-medium shrink-0">
              <Home className="size-3" /> Medicentro
            </Link>
            {segments.length > 0 && (
              <>
                <ChevronRight className="size-3 opacity-50 shrink-0" />
                <span className="font-semibold text-foreground truncate">{currentLabel}</span>
              </>
            )}
          </nav>
        </div>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}