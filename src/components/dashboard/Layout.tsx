import { ReactNode, useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, ShieldCheck, Menu, X, ChevronRight, Home, Siren, Loader2, User, Monitor, MonitorOff, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

const ROUTE_LABELS: Record<string, string> = {
  "": "Recepção",
  "agendamentos": "Agendamentos",
  "pacientes": "Utentes & CRM",
  "documentos": "Documentos & Saídas",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const now = new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kioskMode, setKioskMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const currentLabel = segments.length === 0 ? "Recepção" : (ROUTE_LABELS[segments[0]] ?? segments[0]);

  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const connectionLabel = dbConnectionError?.replace("Erro de Conexão com a Base de Dados: ", "").replace("Erro Crítico de Rede: ", "");

  // Ping de Base de Dados (Teste de Conetividade Local -> Supabase)
  useEffect(() => {
    const pingDatabase = async () => {
      console.log("[App Debug] Executando Ping de Base de Dados ao Supabase...");
      try {
        const { error } = await supabase.from('pacientes').select('id').limit(1);
        if (error) {
          console.error("[App Debug] Falha no Ping:", error);
          let errorMessage = "Acesso Negado (Verifique Login/RLS)";
          if (error.code === '42P01') errorMessage = "Tabela inexistente";
          if (error.code === 'PGRST301') errorMessage = "Sessão expirada ou JWT inválido";
          setDbConnectionError(`Erro de Conexão com a Base de Dados: ${errorMessage}`);
        } else {
          console.log("[App Debug] Conexão com Supabase OK!");
          setDbConnectionError(null);
        }
      } catch (err: any) {
        console.error("[App Debug] Erro fatal de rede:", err);
        setDbConnectionError("Erro Crítico de Rede: Não foi possível alcançar o Supabase.");
      }
    };
    pingDatabase();
  }, []);

  // Hydrate kiosk preference from localStorage
  useEffect(() => {
    try {
      setKioskMode(localStorage.getItem("medicentro:kiosk") === "1");
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("medicentro:kiosk", kioskMode ? "1" : "0"); } catch {}
  }, [kioskMode, hydrated]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data: pacientes } = await supabase
          .from('pacientes')
          .select('id, nome_completo, nif')
          .ilike('nome_completo', `%${searchTerm}%`)
          .limit(3);
          
        const { data: professionals } = await supabase
          .from('professionals')
          .select('id, full_name, specialty')
          .ilike('full_name', `%${searchTerm}%`)
          .limit(2);
          
        const results = [
          ...(pacientes?.map(p => ({ ...p, name: p.nome_completo, type: 'Paciente' })) || []),
          ...(professionals?.map(m => ({ ...m, name: m.full_name, type: 'Médico' })) || [])
        ];
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  return (
    <div className={`min-h-screen flex bg-background ${kioskMode ? "kiosk-mode" : ""}`} data-kiosk={kioskMode ? "on" : "off"}>
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
        <header className="h-16 border-b border-border/60 bg-card/90 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between gap-2 px-3 sm:px-4 lg:px-8">
          <div className="min-w-0 flex flex-1 items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden size-9 rounded-md hover:bg-muted grid place-items-center text-muted-foreground transition-colors shrink-0">
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[14px] sm:text-[15px] font-semibold tracking-tight truncate max-w-[13rem] sm:max-w-[18rem] lg:max-w-none">{title}</h1>
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-success font-semibold bg-success/10 px-2 py-0.5 rounded-full shrink-0">
                <ShieldCheck className="size-3" /> HIPAA · RGPD
              </span>
            </div>
            {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle} · <span className="capitalize">{now}</span></p>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {dbConnectionError && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                title={dbConnectionError}
                className="hidden sm:inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-warning/30 bg-warning/10 px-2 text-xs font-semibold text-warning transition-colors hover:bg-warning/15"
              >
                <AlertTriangle className="size-3.5" />
                <span className="hidden lg:inline">{connectionLabel}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setKioskMode((v) => !v)}
              aria-pressed={kioskMode}
              aria-label={kioskMode ? "Desativar modo recepção" : "Ativar modo recepção"}
              title={kioskMode ? "Sair do modo recepção" : "Modo recepção (ecrã grande)"}
              className={`hidden md:inline-flex items-center justify-center gap-1.5 h-9 px-2 rounded-md border text-xs font-semibold transition-colors ${kioskMode ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted"}`}
            >
              {kioskMode ? <MonitorOff className="size-3.5" /> : <Monitor className="size-3.5" />}
              <span className="hidden lg:inline">{kioskMode ? "Sair" : "Recepção"}</span>
            </button>
            <div ref={searchRef} className="relative hidden xl:flex items-center gap-2 h-9 px-3 rounded-md border border-border/60 bg-muted/40 text-xs text-muted-foreground w-64 focus-within:ring-2 ring-primary/20 transition-all">
              <Search className="size-3.5" />
              <input 
                placeholder="Buscar paciente ou médico…" 
                className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground/70" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => { if(searchTerm) setShowResults(true); }}
              />
              {isSearching ? <Loader2 className="size-3.5 animate-spin text-primary" /> : <kbd className="text-[10px] border rounded px-1 py-0.5 bg-card">⌘K</kbd>}
              
              {/* Search Dropdown */}
              {showResults && searchTerm && (
                <div className="absolute top-11 left-0 w-full lg:w-[350px] bg-card border shadow-xl rounded-lg overflow-hidden z-50 flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase bg-muted/30 border-b">
                    Resultados da Busca
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {searchResults.length === 0 && !isSearching ? (
                      <li className="p-4 text-center text-xs text-muted-foreground">Nenhum resultado encontrado.</li>
                    ) : (
                      searchResults.map((item, idx) => (
                        <li key={`${item.type}-${item.id || idx}`} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer border-b last:border-0 transition-colors">
                          <div className="size-8 rounded-full bg-primary/10 grid place-items-center text-primary">
                            <User className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">{item.nome || item.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{item.type} · {item.nif || item.especialidade || 'N/A'}</p>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
            <Link to="/sos" className="inline-flex items-center justify-center gap-1.5 h-9 min-w-9 px-2 sm:px-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <Siren className="size-3.5 shrink-0" /> <span className="hidden sm:inline">SOS</span>
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
        <main className="flex-1 min-w-0 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}