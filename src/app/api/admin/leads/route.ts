import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAuthenticated } from '@/lib/auth';
import { validate } from '@/lib/validation';

const leadCreateSchema = z.object({
  nome: z.string().min(1, 'nome obrigatório'),
  empresa: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  segment: z.string().optional(),
  message: z.string().optional(),
  status: z.string().optional()
});

const leadUpdateSchema = leadCreateSchema.merge(z.object({
  id: z.string().min(1, 'id obrigatório')
}));

const idQuerySchema = z.object({
  id: z.string().min(1, 'id obrigatório')
});

// GET: Lista todos os leads
export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Cria um novo lead
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const parsed = validate(leadCreateSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
    }
    const { nome, empresa, email, phone, segment, message, status } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([{ nome, empresa, email, phone, segment, message, status: status || 'Novo' }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PATCH: Atualiza lead
export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const parsed = validate(leadUpdateSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
    }
    const { id, ...updates } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE: Remove um lead da base
export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = validate(idQuerySchema, Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const { id } = parsed.data;

    const { error } = await supabaseAdmin
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
