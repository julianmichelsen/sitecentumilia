import { supabase } from './supabase';

// ===== CONFIG =====
export async function getConfig() {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .single();
  
  if (error) return { siteName: 'Centumilia', tagline: 'Crescimento com Direção' };
  
  return {
    siteName: data.site_name,
    tagline: data.tagline,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    location: data.location,
    instagram: data.instagram,
    linkedin: data.linkedin,
  };
}

export async function saveConfig(data: any) {
  const { error } = await supabase
    .from('config')
    .upsert({
      id: 1,
      site_name: data.siteName,
      tagline: data.tagline,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      location: data.location,
      instagram: data.instagram,
      linkedin: data.linkedin,
    });
  return !error;
}

export async function saveLogos(data: any[]) {
  const { error: deleteError } = await supabase.from('logos').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError && deleteError.code !== 'PGRST116') {
    console.error('Erro ao limpar logos:', deleteError);
  }
  const { error } = await supabase.from('logos').insert(
    data.map(l => ({ name: l.name, logo: l.logo, order_index: l.order }))
  );
  return !error;
}

// ===== TESTIMONIALS =====
export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data;
}

export async function saveTestimonials(data: any[]) {
  const { error: deleteError } = await supabase.from('testimonials').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError && deleteError.code !== 'PGRST116') {
    console.error('Erro ao limpar depoimentos:', deleteError);
  }
  const { error } = await supabase.from('testimonials').insert(data);
  return !error;
}
