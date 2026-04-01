import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { data, error } = await supabase.from('logos').select('*').order('order_index', { ascending: true });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data.map(l => ({ name: l.name, logo: l.logo, order: l.order_index })));
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const body = await request.json(); // Array de logos
  
  // Para logos, deletamos os antigos e inserimos os novos (simples)
  await supabase.from('logos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await supabase.from('logos').insert(
    body.map((l: any, i: number) => ({ 
      name: l.name, 
      logo: l.logo, 
      order_index: l.order || i 
    }))
  );
  
  if (error) return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
