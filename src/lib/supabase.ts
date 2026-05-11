import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fdmipjwbukuzdqdwwegg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Xx3gJ0oEFzXAZy9oedZtIg_I_6cIEmF';

export const supabase = createClient(supabaseUrl, supabaseKey);
