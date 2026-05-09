-- 1. Create the appointments table
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Nullable se permitir marcações anónimas
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  professional TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  unit TEXT NOT NULL,
  insurance TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rescheduled', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Policy for patients to read their own appointments
CREATE POLICY "Patients can view their own appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for patients to insert their own appointments
CREATE POLICY "Patients can insert their own appointments"
ON public.appointments FOR INSERT
TO authenticated, anon
WITH CHECK (true); -- Permitir inserts para a demo (ajustar auth.uid() se houver login obrigatório)

-- Policy for Receptionists (admin/staff) to read and update all appointments
CREATE POLICY "Receptionist can view all appointments"
ON public.appointments FOR SELECT
TO authenticated, anon
USING (true); -- Para efeitos de demo, permitimos leitura (ajustar com roles para prod)

CREATE POLICY "Receptionist can update any appointment"
ON public.appointments FOR UPDATE
TO authenticated, anon
USING (true); -- Para efeitos de demo (ajustar com roles para prod)

-- 4. Enable Realtime for the appointments table
-- Se a publication não existir, criá-la
-- CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- 5. Create professionals table
CREATE TABLE public.professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  specialty TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  role TEXT DEFAULT 'doctor' CHECK (role IN ('doctor', 'nurse', 'admin', 'tech')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) for professionals
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for professionals
-- Anyone can view active professionals (for scheduling, scaling)
CREATE POLICY "Anyone can view active professionals"
ON public.professionals FOR SELECT
TO authenticated, anon
USING (status = 'active');

-- Only admins can view inactive professionals, insert, update, or delete
-- (Since we do not have strict JWT role checking in this demo, we simulate it via app logic or permit all for demo purposes, 
-- but ideally we would check (auth.jwt() ->> 'role') = 'admin' or similar)
CREATE POLICY "Admins can manage professionals"
ON public.professionals FOR ALL
TO authenticated, anon
USING (true) WITH CHECK (true); -- For demo purposes. In production: USING (auth.jwt()->>'role' = 'admin')

-- 8. Add to Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.professionals;
