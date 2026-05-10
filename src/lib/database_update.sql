-- 1. Create the patients (pacientes) table
CREATE TABLE IF NOT EXISTS public.pacientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  morada TEXT,
  telemovel TEXT,
  data_nascimento DATE,
  grupo_sanguineo TEXT,
  nif TEXT,
  n_beneficiario TEXT, -- INPS Number
  seguradora TEXT,
  document_url TEXT, -- Link to Supabase Storage
  responsavel_id UUID REFERENCES public.pacientes(id), -- Family linkage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS for pacientes
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for pacientes
CREATE POLICY "Anyone can view patients" ON public.pacientes FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Anyone can insert/update patients" ON public.pacientes FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 4. Create exames_pendentes table (Central de Guias)
CREATE TABLE IF NOT EXISTS public.exames_pendentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  medico_id UUID REFERENCES public.professionals(id),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluido')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS for exames_pendentes
ALTER TABLE public.exames_pendentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage exames_pendentes" ON public.exames_pendentes FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 6. Create faturas table (Receipts)
CREATE TABLE IF NOT EXISTS public.faturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  valor NUMERIC(10,2) NOT NULL,
  data_emissao TIMESTAMPTZ DEFAULT NOW(),
  descricao TEXT,
  status TEXT DEFAULT 'pago' CHECK (status IN ('pago', 'pendente', 'cancelado')),
  unidade_id INT
);

-- 7. Enable RLS for faturas
ALTER TABLE public.faturas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage faturas" ON public.faturas FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 8. Create documentos_emitidos table (Logs for Dr. Anderson)
CREATE TABLE IF NOT EXISTS public.documentos_emitidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE SET NULL,
  tipo_documento TEXT NOT NULL, -- ex: 'Declaração de Presença'
  emitido_por TEXT, -- User ID or Name
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documentos_emitidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage documentos_emitidos" ON public.documentos_emitidos FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 9. Enable Realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.pacientes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exames_pendentes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faturas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documentos_emitidos;

-- 9. Create Storage Bucket for Patient Documents
-- (This usually needs to be done via dashboard or API, but we can't do it here)
-- Please create a bucket named 'pacientes_docs' in Supabase Storage with public access for this demo.
