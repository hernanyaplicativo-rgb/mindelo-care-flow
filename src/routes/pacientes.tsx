import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Search, UserPlus, FileText, CreditCard, 
  Trash2, Edit3, Save, X, Upload, Link as LinkIcon, 
  ChevronRight, Phone, MapPin, Calendar, Droplet,
  MoreVertical, FileCheck, CheckCircle2, Loader2,
  Users2, UserCheck, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pacientes")({
  component: Pacientes,
});

interface Paciente {
  id: string;
  nome_completo: string;
  morada?: string;
  telemovel?: string;
  data_nascimento?: string;
  grupo_sanguineo?: string;
  nif?: string;
  n_beneficiario?: string;
  seguradora?: string;
  document_url?: string;
  responsavel_id?: string;
  created_at: string;
}

function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPacientes();

    const channel = supabase
      .channel('pacientes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pacientes' }, () => {
        fetchPacientes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPacientes = async () => {
    console.log("[App Debug] Carregando lista de utentes (CRM)...");
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('nome_completo', { ascending: true });

      if (error) {
        console.error("[App Debug] Erro ao carregar utentes:", error);
        throw error;
      }
      setPacientes(data || []);
      console.log(`[App Debug] ${data?.length || 0} utentes carregados com sucesso.`);
    } catch (error: any) {
      let msg = error.message;
      if (error.code === '42501' || error.message?.includes('RLS')) {
        msg = "Precisa de fazer login primeiro. Permissão negada (RLS).";
      }
      toast.error(`Falha no CRM: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePatient = async () => {
    console.log('Botão clicado! Iniciando processo de salvamento...');
    if (!editingPaciente) return;

    // Verificação de Estado (Campos Obrigatórios)
    if (!editingPaciente.nome_completo || editingPaciente.nome_completo.trim() === '') {
      toast.error("O campo 'Nome Completo' é obrigatório.");
      return;
    }

    try {
      setIsSaving(true);
      console.log('Dados a enviar:', editingPaciente);
      
      // Clean data for Supabase
      const isNew = !editingPaciente.id || editingPaciente.id === '';
      const { id, created_at, ...updateData } = editingPaciente;
      
      const { error } = isNew 
        ? await supabase.from('pacientes').insert(updateData)
        : await supabase.from('pacientes').update(updateData).eq('id', id);

      if (error) {
        console.error('Erro retornado pelo Supabase:', error);
        throw error;
      }
      
      toast.success(isNew ? "Cadastro salvo!" : "Paciente atualizado!");
      setIsModalOpen(false);
      setEditingPaciente(null);
      await fetchPacientes(); // Refresh list on background
    } catch (error: any) {
      console.error("Erro fatal ao salvar paciente:", error);
      toast.error(`Falha no processamento: ${error.message || 'Erro de conexão'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este paciente?")) return;
    
    try {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Paciente removido.");
    } catch (error: any) {
      toast.error("Erro ao remover: " + error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, pacienteId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${pacienteId}-${Math.random()}.${fileExt}`;
      const filePath = `docs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pacientes_docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pacientes_docs')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('pacientes')
        .update({ document_url: publicUrl })
        .eq('id', pacienteId);

      if (updateError) throw updateError;

      toast.success("Documento enviado com sucesso!");
      fetchPacientes();
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredPacientes = pacientes.filter(p => 
    p.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.telemovel && p.telemovel.includes(searchTerm))
  );

  return (
    <DashboardLayout title="Ficheiro de Utentes (CRM)" subtitle="Gestão completa de pacientes e convénios">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              placeholder="Buscar por nome ou telemóvel..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 ring-primary/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingPaciente({ id: '', nome_completo: '', created_at: '' });
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus className="size-4" /> Novo Paciente
          </button>
        </div>

        {/* Patient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && pacientes.length === 0 ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl border" />
            ))
          ) : filteredPacientes.map((paciente) => (
            <div key={paciente.id} className="group relative bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 grid place-items-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {paciente.nome_completo.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate pr-6">{paciente.nome_completo}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 flex items-center gap-1">
                      <UserCheck className="size-3" /> Ativo
                    </span>
                    {paciente.seguradora && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {paciente.seguradora}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Phone className="size-3.5 text-primary" />
                  <span>{paciente.telemovel || 'Sem contacto'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  <span className="truncate">{paciente.morada || 'Cabo Verde'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  <span>{paciente.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString() : '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Droplet className="size-3.5 text-destructive" />
                  <span className="font-semibold text-destructive">{paciente.grupo_sanguineo || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingPaciente(paciente);
                      setIsModalOpen(true);
                    }}
                    className="size-8 rounded-lg border bg-muted/30 grid place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    title="Editar Perfil"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(paciente.id)}
                    className="size-8 rounded-lg border bg-muted/30 grid place-items-center hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                    title="Remover"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {paciente.document_url ? (
                    <a 
                      href={paciente.document_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success text-[11px] font-bold border border-success/20 hover:bg-success hover:text-white transition-all"
                    >
                      <FileCheck className="size-3.5" /> Cartão ID
                    </a>
                  ) : (
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-[11px] font-bold border hover:bg-primary hover:text-white hover:border-primary transition-all">
                      {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />} Enviar ID
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, paciente.id)} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredPacientes.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="size-20 bg-muted rounded-full grid place-items-center mx-auto opacity-40">
                <Users className="size-10" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground">Nenhum utente encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Tente ajustar a sua busca ou adicione um novo paciente ao sistema.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Edit/New Paciente */}
      {isModalOpen && editingPaciente && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-2xl bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                {editingPaciente.id ? <Edit3 className="size-4 text-primary" /> : <UserPlus className="size-4 text-primary" />}
                {editingPaciente.id ? "Editar Utente" : "Novo Cadastro"}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="size-8 rounded-full hover:bg-muted grid place-items-center">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Profile Management */}
              <div className="col-span-full text-[10px] font-bold uppercase tracking-wider text-primary border-b pb-2 mb-2">Dados Pessoais</div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Nome Completo</label>
                <input 
                  required
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.nome_completo}
                  onChange={(e) => setEditingPaciente({...editingPaciente, nome_completo: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Telemóvel</label>
                <input 
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.telemovel || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, telemovel: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Data de Nascimento</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.data_nascimento || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, data_nascimento: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Grupo Sanguíneo</label>
                <select 
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.grupo_sanguineo || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, grupo_sanguineo: e.target.value})}
                >
                  <option value="">Selecione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="col-span-full space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Morada</label>
                <input 
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.morada || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, morada: e.target.value})}
                />
              </div>

              {/* Insurance Management */}
              <div className="col-span-full text-[10px] font-bold uppercase tracking-wider text-primary border-b pb-2 mt-4 mb-2">Convénios e Seguradora</div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Nº Beneficiário INPS</label>
                <input 
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.n_beneficiario || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, n_beneficiario: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Seguradora</label>
                <select 
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.seguradora || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, seguradora: e.target.value})}
                >
                  <option value="">Nenhum / Particular</option>
                  <option value="Garantia">Garantia</option>
                  <option value="Ímpar">Ímpar</option>
                  <option value="Inspecção de Mar">Inspecção de Mar</option>
                  <option value="Enapor">Enapor</option>
                  <option value="Electra">Electra</option>
                </select>
              </div>

              {/* Family Linkage */}
              <div className="col-span-full text-[10px] font-bold uppercase tracking-wider text-primary border-b pb-2 mt-4 mb-2">Vínculo Familiar</div>
              <div className="col-span-full space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase text-xs">Vincular a Responsável (Dependente de...)</label>
                <select 
                  className="w-full px-3 py-2 bg-muted/30 border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={editingPaciente.responsavel_id || ''}
                  onChange={(e) => setEditingPaciente({...editingPaciente, responsavel_id: e.target.value})}
                >
                  <option value="">Nenhum (Titular)</option>
                  {pacientes.filter(p => p.id !== editingPaciente.id).map(p => (
                    <option key={p.id} value={p.id}>{p.nome_completo}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 italic"><LinkIcon className="size-3" /> Use esta opção para vincular filhos ao responsável financeiro.</p>
              </div>
            </div>

            <div className="p-6 bg-muted/30 border-t flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSavePatient}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all min-w-[140px] justify-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>A Guardar...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span>Salvar Cadastro</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
