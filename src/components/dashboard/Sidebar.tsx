import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, QrCode, LayoutDashboard, UserCircle, MessageCircle, Video, BarChart3, Mic, Users, MapPin, HeartPulse } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/triagem", label: "Triagem IA", icon: Activity },
  { to: "/parcerias", label: "Parcerias", icon: Building2 },
  { to: "/agendamentos", label: "Agendamentos", icon: Calendar },
  { to: "/mobile", label: "Quiosque (Tablet)", icon: QrCode },
  { to: "/portal", label: "Portal do Paciente", icon: UserCircle },
  { to: "/telemedicina", label: "Telemedicina", icon: Video },
  { to: "/comunicacao", label: "WhatsApp & SMS", icon: MessageCircle },
  { to: "/analytics", label: "Analytics & BI", icon: BarChart3 },
  { to: "/ditado", label: "Ditado IA (EMR)", icon: Mic },
  { to: "/escala", label: "Escalas 24/7", icon: Users },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[var(--primary-glow)] to-primary" />
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-gradient-to-br from-primary to-[var(--primary-glow)] flex items-center justify-center shadow-[0_8px_24px_-8px_var(--primary)]">
            <HeartPulse className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-base font-[var(--font-display)]">Medicentro</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60">Clínica Privada · 20 anos</div>
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2 text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40 font-semibold">Navegação</div>
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto scrollbar-none">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="group relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r-full before:bg-primary" }}
          >
            <Icon className="size-4 shrink-0 opacity-80 group-hover:opacity-100" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="m-3 p-4 rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-accent/40 border border-sidebar-border text-xs shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-primary" />
          <span className="font-semibold text-sidebar-foreground">Mindelo · Cabo Verde</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="size-2 rounded-full bg-success animate-pulse shadow-[0_0_8px] shadow-success" />
          <span className="text-sidebar-foreground/70">Operacional 24/7</span>
        </div>
        <div className="mt-1 text-sidebar-foreground/40 text-[10px]">v2.4 · build 1024</div>
      </div>
    </aside>
  );
}