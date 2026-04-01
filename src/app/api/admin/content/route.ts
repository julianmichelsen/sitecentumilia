import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAuthenticated } from '@/lib/auth';
import { validate } from '@/lib/validation';

const ALLOWED_STATUSES = ['Em Análise', 'Em Produção', 'Aguardando Cliente', 'Aprovado', 'Ajuste Solicitado'];

const contentCreateSchema = z.object({
  client_id: z.coerce.number().int().positive(),
  title: z.string().min(1, 'título obrigatório'),
  media_url: z.string().min(1, 'mídia obrigatória'),
  caption: z.string().optional(),
  status: z.enum(ALLOWED_STATUSES as [string, ...string[]]).optional(),
  scheduled_at: z.string().optional()
});

const contentPatchSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  magic_link: z.string().uuid().optional(),
  status: z.enum(ALLOWED_STATUSES as [string, ...string[]]).optional(),
  feedback: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  media_url: z.string().optional(),
  scheduled_at: z.string().optional(),
  client_id: z.coerce.number().int().positive().optional()
});

const deleteQuerySchema = z.object({
  id: z.coerce.number().int().positive()
});

const getQuerySchema = z.object({
  magic_link: z.string().uuid().optional()
});

// GET: Lista todos os posts OU filtra por um magic_link específico
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsedQuery = validate(getQuerySchema, Object.fromEntries(searchParams.entries()));
  if (!parsedQuery.success) {
    return NextResponse.json({ error: 'Parâmetros inválidos', details: parsedQuery.errors }, { status: 400 });
  }
  const { magic_link: magicLink } = parsedQuery.data;

  if (!magicLink && !isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let query = supabaseAdmin
    .from('content_posts')
    .select('*');

  if (magicLink) {
    query = query.eq('magic_link', magicLink);
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (magicLink && (!data || data.length === 0)) {
    return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 404 });
  }
  return NextResponse.json(data);
}

// POST: Envia um novo criativo
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = validate(contentCreateSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
    }
    const { client_id, title, media_url, caption, status, scheduled_at } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('content_posts')
      .insert([{ 
        client_id, 
        title, 
        media_url, 
        caption, 
        status: status || 'Aguardando Cliente',
        scheduled_at: scheduled_at || null, 
        magic_link: crypto.randomUUID()
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PATCH: Atualiza post
export async function PATCH(request: NextRequest) {
  try {
    const parsed = validate(contentPatchSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
    }
    const { id, magic_link, ...payloadUpdates } = parsed.data;
    const isAdmin = isAuthenticated();
    let updates = payloadUpdates;

    if (!id && !magic_link) {
      return NextResponse.json({ error: 'ID or Magic Link is required' }, { status: 400 });
    }

    if (!isAdmin && !magic_link) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!isAdmin && magic_link) {
      updates = { status: payloadUpdates.status, feedback: payloadUpdates.feedback };
      if (!updates.status) {
        return NextResponse.json({ error: 'Status is required' }, { status: 400 });
      }
    }

    if (!id && magic_link) {
      const { data, error } = await supabaseAdmin
        .from('content_posts')
        .update(updates)
        .eq('magic_link', magic_link)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 404 });
      return NextResponse.json(data);
    }

    if (id) {
       const { data, error } = await supabaseAdmin
        .from('content_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
       if (error) return NextResponse.json({ error: error.message }, { status: 500 });
       if (!data) return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
       return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'ID or Magic Link is required' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE: Remove um post
export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = validate(deleteQuerySchema, Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const { id } = parsed.data;

    const { error } = await supabaseAdmin
      .from('content_posts')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
