import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, ShieldCheck } from "lucide-react";

export function DashboardLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const now = new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long" });
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/60 bg-card/70 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-success font-semibold bg-success/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="size-3" /> HIPAA · RGPD
              </span>
            </div>
            {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle} · <span className="capitalize">{now}</span></p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md border border-border/60 bg-muted/40 text-xs text-muted-foreground w-64">
              <Search className="size-3.5" />
              <input placeholder="Buscar paciente, NIF, agendamento…" className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground/70" />
              <kbd className="text-[10px] border rounded px-1 py-0.5 bg-card">⌘K</kbd>
            </div>
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
                <div className="text-[10px] text-muted-foreground">Administrador</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}