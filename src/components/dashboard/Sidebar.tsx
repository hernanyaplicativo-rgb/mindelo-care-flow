import { Link } from "@tanstack/react-router";
import { Activity, Calendar, Building2, QrCode, LayoutDashboard, UserCircle, MessageCircle, Video, BarChart3, Mic, Users, MapPin, HeartPulse, Smartphone, Receipt, Pill, FileHeart, ShieldCheck, Stethoscope, Headset, User, Siren, UserCheck } from "lucide-react";
import { useRole, Unit } from "@/hooks/useRole";

import logoImg from "@/assets/medicentro-logo.jpg";

type Role = 'admin' | 'doctor' | 'reception' | 'patient' | 'nurse';

const roles = [
  { id: 'admin', label: 'Gerente / Admin', icon: ShieldCheck },
  { id: 'doctor', label: 'Médico', icon: Stethoscope },
  { id: 'nurse', label: 'Enfermeiro', icon: Activity },
  { id: 'reception', label: 'Receção', icon: Headset },
  { id: 'patient', label: 'Paciente', icon: User },
] as const;

const allItems = [
  // Admin
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ['admin'] },
  { to: "/analytics", label: "Analytics & BI", icon: BarChart3, roles: ['admin'] },
  { to: "/escala", label: "Gestão de Escalas", icon: Users, roles: ['admin', 'nurse'] },
  { to: "/profissionais", label: "Profissionais", icon: UserCheck, roles: ['admin'] },
  { to: "/farmacia", label: "Farmácia & Stock", icon: Pill, roles: ['admin', 'reception'] },
  { to: "/faturacao", label: "Faturação & Caixa", icon: Receipt, roles: ['admin', 'reception'] },
  { to: "/parcerias", label: "Parcerias", icon: Building2, roles: ['admin'] },

  // Médico & Enfermagem
  { to: "/prontuario", label: "Prontuário (EMR)", icon: FileHeart, roles: ['doctor', 'nurse'] },
  { to: "/triagem", label: "Triagem Manchester", icon: Activity, roles: ['doctor', 'reception', 'nurse'] },
  { to: "/ditado", label: "Ditado IA (EMR)", icon: Mic, roles: ['doctor'] },
  { to: "/telemedicina", label: "Telemedicina", icon: Video, roles: ['doctor', 'patient'] },

  // Receção
  { to: "/pacientes", label: "Utentes", icon: Users, roles: ['reception', 'admin', 'doctor', 'nurse'] },
  { to: "/agendamentos", label: "Agendamentos", icon: Calendar, roles: ['reception', 'admin'] },
  { to: "/documentos", label: "Documentos", icon: Receipt, roles: ['reception', 'admin'] },
  { to: "/comunicacao", label: "WhatsApp & SMS", icon: MessageCircle, roles: ['reception', 'admin'] },
  { to: "/mobile", label: "Quiosque (Tablet)", icon: QrCode, roles: ['reception'] },

  // Paciente
  { to: "/portal", label: "Portal do Paciente", icon: UserCircle, roles: ['patient'] },
  { to: "/marcacao-online", label: "Marcação Online", icon: Smartphone, roles: ['patient'] },
  { to: "/sos", label: "SOS · Emergência", icon: Siren, roles: ['admin', 'reception', 'doctor', 'patient', 'nurse'] },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const { currentRole, setRole: setCurrentRole, currentUnit, setUnit } = useRole();
  
  const filteredItems = allItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className={`flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative h-full ${className}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[var(--primary-glow)] to-primary" />
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-white overflow-hidden flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]">
            <img src={logoImg} alt="Logo" className="size-full object-cover" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-base font-[var(--font-display)]">Medicentro</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60">Clínica Privada</div>
          </div>
        </div>
      </div>

      {/* Role & Unit Selectors */}
      <div className="px-4 pt-4 pb-2 space-y-4 border-b border-sidebar-border">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40 font-semibold mb-2 px-2">Unidade</div>
          <select 
            value={currentUnit} 
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-full bg-sidebar-accent/50 text-xs font-semibold text-sidebar-foreground border border-sidebar-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
          >
            <option value="Clínica Sede (Madeiralzinho)">Sede (Madeiralzinho)</option>
            <option value="Unidade Monte Sossego">Monte Sossego</option>
          </select>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40 font-semibold mb-2 px-2">Simular Perfil</div>
          <div className="grid grid-cols-2 gap-1.5">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id as Role)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentRole === role.id 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-sidebar-accent/50 text-sidebar-foreground/60 border border-transparent hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <role.icon className="size-3" />
                <span className="truncate">{role.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-2 text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40 font-semibold">
        Navegação ({roles.find(r => r.id === currentRole)?.label})
      </div>
      
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {filteredItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-sidebar-foreground/70 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground transition-all duration-200"
            activeProps={{ className: "bg-sidebar-accent/80 text-sidebar-foreground font-semibold shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1.5 before:rounded-r-full before:bg-primary before:shadow-[0_0_8px_var(--primary)]" }}
          >
            <Icon className="size-4 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="m-3 p-4 rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-accent/40 border border-sidebar-border text-xs shrink-0 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 size-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
        <div className="flex items-center gap-2 relative z-10">
          <MapPin className="size-3.5 text-primary" />
          <span className="font-semibold text-sidebar-foreground truncate" title={currentUnit}>{currentUnit.includes('Madeiralzinho') ? 'Mindelo · Sede' : 'Mindelo · M. Sossego'}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 relative z-10">
          <span className="size-2 rounded-full bg-success animate-pulse shadow-[0_0_8px] shadow-success" />
          <span className="text-sidebar-foreground/70">Operacional 24/7</span>
        </div>
        <div className="mt-2 text-sidebar-foreground/40 text-[10px] relative z-10">v3.0 · Role Based</div>
      </div>
    </aside>
  );
}