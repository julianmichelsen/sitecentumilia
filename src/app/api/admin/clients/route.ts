import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAuthenticated } from '@/lib/auth';
import { validate } from '@/lib/validation';

const clientSchema = z.object({
  name: z.string().min(1, 'nome obrigatório'),
  company: z.string().min(1, 'empresa obrigatória'),
  logo_url: z.string().optional(),
  status: z.string().optional()
});

const idQuerySchema = z.object({
  id: z.string().min(1, 'id obrigatório')
});

// GET: Lista todos os clientes
export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Cria um novo cliente
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const parsed = validate(clientSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
    }
    const { name, company, logo_url, status } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert([{ name, company, logo_url, status }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE: Remove um cliente
export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = validate(idQuerySchema, Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    }
    const { id } = parsed.data;

    const { error } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
