import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, QrCode, Stethoscope, LayoutDashboard, Hotel, UserCircle, MessageCircle, Video, BarChart3, Mic, Users } from "lucide-react";

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
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <Stethoscope className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-base">Urgimed</div>
            <div className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">Health & Hospitality</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none pb-8">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground font-medium" }}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 m-3 rounded-lg bg-sidebar-accent text-xs shrink-0">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Hotel className="size-4 text-primary" />
          <span className="font-semibold text-sidebar-foreground">Mindelo, CV</span>
        </div>
        <p className="mt-2 text-sidebar-foreground/60">Operacional 24/7</p>
      </div>
    </aside>
  );
}