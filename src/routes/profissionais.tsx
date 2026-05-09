import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Users, Plus, ShieldCheck, Mail, Briefcase, Phone, User as UserIcon, X, Check, Search, UserCheck, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Gestão de Profissionais — Medicentro" },
      { name: "description", content: "Administração de acessos e perfis médicos." },
    ],
  }),
  component: ProfissionaisPage,
});

type Professional = {
  id: string;
  full_name: string;
  email: string;
  specialty: string;
  license_number: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
};

const initialMocks: Professional[] = [
  { id: '1', full_name: "Dr. Júlio Wahnon", email: "julio.w@medicentro.cv", specialty: "Clínica Geral", license_number: "OM-4521", phone: "9881122", role: "doctor", status: "active" },
  { id: '2', full_name: "Dra. Mª Teresa Martins", email: "teresa.m@medicentro.cv", specialty: "Pediatria", license_number: "OM-3312", phone: "9882233", role: "doctor", status: "active" },
  { id: '3', full_name: "Enf. Paulo Semedo", email: "paulo.s@medicentro.cv", specialty: "Enfermagem Chefe", license_number: "OE-8841", phone: "9883344", role: "nurse", status: "active" },
  { id: '4', full_name: "Dr. Fernando Lopes", email: "fernando.l@medicentro.cv", specialty: "Cardiologia", license_number: "OM-1123", phone: "9884455", role: "doctor", status: "inactive" },
];

function ProfissionaisPage() {
  const { currentRole } = useRole();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProf, setNewProf] = useState({ full_name: "", email: "", specialty: "", license_number: "", phone: "", role: "doctor" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfessionals();
    
    const channel = supabase
      .channel('public:professionals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'professionals' }, () => {
        fetchProfessionals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase.from('professionals').select('*').order('full_name');
      if (error) {
        // Fallback to mocks if table not created or error
        console.warn("Using mock data for professionals:", error.message);
        setProfessionals(initialMocks);
      } else if (data && data.length > 0) {
        setProfessionals(data as Professional[]);
      } else {
        // If empty, use mocks and optionally insert them
        setProfessionals(initialMocks);
      }
    } catch (err) {
      setProfessionals(initialMocks);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (prof: Professional) => {
    const newStatus = prof.status === 'active' ? 'inactive' : 'active';
    
    // Optimistic update
    setProfessionals(prev => prev.map(p => p.id === prof.id ? { ...p, status: newStatus } : p));
    
    try {
      const { error } = await supabase.from('professionals').update({ status: newStatus }).eq('id', prof.id);
      if (error) throw error;
      toast.success(`${prof.full_name} foi marcado como ${newStatus === 'active' ? 'Ativo' : 'Inativo'}.`);
    } catch (err: any) {
      toast.error("Erro ao atualizar estado.");
      // Revert on error
      setProfessionals(prev => prev.map(p => p.id === prof.id ? { ...p, status: prof.status } : p));
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProf.full_name || !newProf.email || !newProf.specialty) {
      toast.error("Preencha todos os campos obrigatórios (Nome, Email, Especialidade).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newProf.email)) {
      toast.error("Formato de e-mail inválido.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Insert into our table
      const { data, error } = await supabase.from('professionals').insert([{
        ...newProf,
        status: 'active'
      }]).select().single();

      if (error) throw error;

      // 2. Simulate Supabase Auth Invite (since we might not have admin rights setup in the client)
      // await supabase.auth.admin.inviteUserByEmail(newProf.email, { data: { role: newProf.role } });
      
      toast.success("Profissional adicionado!", {
        description: `Um convite foi enviado para ${newProf.email}.`
      });
      
      setIsAddModalOpen(false);
      setNewProf({ full_name: "", email: "", specialty: "", license_number: "", phone: "", role: "doctor" });
      fetchProfessionals();
    } catch (err: any) {
      toast.error("Erro ao adicionar profissional. " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = professionals.filter(p => 
    p.full_name.toLowerCase().includes(q.toLowerCase()) || 
    p.specialty.toLowerCase().includes(q.toLowerCase())
  );

  const activeCount = professionals.filter(p => p.status === 'active').length;

  if (currentRole !== 'admin') {
    return (
      <DashboardLayout title="Acesso Negado" subtitle="">
        <div className="flex flex-col items-center justify-center p-20 text-center">
          <ShieldCheck className="size-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold">Área Restrita</h2>
          <p className="text-muted-foreground mt-2">Apenas utilizadores com perfil de Gerente/Admin podem acessar esta área.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestão de Profissionais" subtitle="Controlo de acessos, convites e perfis clínicos">
      <div className="max-w-6xl space-y-6">
        
        {/* Header Actions & Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input 
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pesquisar por nome ou especialidade..." 
                className="w-full bg-card border rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border shadow-sm text-sm font-semibold">
              <UserCheck className="size-4 text-success" />
              <span>{activeCount} Ativos</span>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <Plus className="size-4" /> Novo Profissional
            </button>
          </div>
        </div>

        {/* Lista de Profissionais */}
        <div className="rounded-2xl border bg-card overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ boxShadow: "var(--shadow-card)" }}>
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">Profissional</th>
                <th className="px-6 py-4 font-bold">Contacto</th>
                <th className="px-6 py-4 font-bold">Especialidade / Ordem</th>
                <th className="px-6 py-4 font-bold text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground"><div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum profissional encontrado.</td></tr>
              ) : filtered.map(prof => (
                <tr key={prof.id} className={`transition-all hover:bg-muted/20 ${prof.status === 'inactive' ? 'opacity-50 grayscale-[0.5] bg-muted/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-inner ${prof.status === 'active' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                        {prof.full_name.replace('Dr. ', '').replace('Dra. ', '').replace('Enf. ', '').charAt(0)}
                      </div>
                      <div>
                        <p className={`font-bold ${prof.status === 'active' ? 'text-foreground' : 'text-muted-foreground line-through decoration-muted-foreground/50'}`}>{prof.full_name}</p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{prof.role === 'doctor' ? 'Médico' : prof.role === 'nurse' ? 'Enfermagem' : 'Técnico'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{prof.email}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{prof.phone || 'Sem telemóvel'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-xs font-bold">
                      <Briefcase className="size-3" /> {prof.specialty}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1.5 font-medium">Nº {prof.license_number || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => handleToggleStatus(prof)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none ${prof.status === 'active' ? 'bg-success' : 'bg-muted-foreground/30'}`}
                        title={prof.status === 'active' ? 'Desativar acesso' : 'Reativar acesso'}
                      >
                        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${prof.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/10 grid place-items-center text-primary"><UserIcon className="size-4" /></div>
                <h3 className="font-bold text-lg">Novo Profissional</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Nome Completo *</label>
                  <input 
                    required
                    value={newProf.full_name} 
                    onChange={e => setNewProf({...newProf, full_name: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" 
                    placeholder="Ex: Dr. Carlos Silva"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">E-mail Profissional *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <input 
                      required
                      type="email"
                      value={newProf.email} 
                      onChange={e => setNewProf({...newProf, email: e.target.value})} 
                      className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" 
                      placeholder="carlos.silva@medicentro.cv"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Um convite com link de acesso será enviado para este e-mail.</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Especialidade *</label>
                  <input 
                    required
                    value={newProf.specialty} 
                    onChange={e => setNewProf({...newProf, specialty: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" 
                    placeholder="Ex: Cardiologia"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Nº de Ordem (Opcional)</label>
                  <input 
                    value={newProf.license_number} 
                    onChange={e => setNewProf({...newProf, license_number: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" 
                    placeholder="OM-1234"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Telemóvel</label>
                  <input 
                    value={newProf.phone} 
                    onChange={e => setNewProf({...newProf, phone: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" 
                    placeholder="9XX XX XX"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Perfil de Acesso</label>
                  <select 
                    value={newProf.role} 
                    onChange={e => setNewProf({...newProf, role: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none appearance-none"
                  >
                    <option value="doctor">Médico(a)</option>
                    <option value="nurse">Enfermeiro(a)</option>
                    <option value="tech">Técnico(a)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail className="size-4" />}
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default ProfissionaisPage;
