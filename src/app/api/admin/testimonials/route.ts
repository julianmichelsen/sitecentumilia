import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const body = await request.json(); // Array de depoimentos
  
  await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await supabase.from('testimonials').insert(
    body.map((t: any) => ({
      author: t.author,
      role: t.role,
      quote: t.quote,
      rating: t.rating || 5
    }))
  );
  
  if (error) return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  return NextResponse.json({ success: true });
}
