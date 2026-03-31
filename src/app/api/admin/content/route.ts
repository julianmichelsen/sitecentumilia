import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Lista todos os posts OU filtra por um magic_link específico
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const magicLink = searchParams.get('magic_link');

  let query = supabase
    .from('content_posts')
    .select('*');

  if (magicLink) {
    query = query.eq('magic_link', magicLink);
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Envia um novo criativo para aprovação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id, title, media_url, caption, scheduled_at } = body;

    const { data, error } = await supabase
      .from('content_posts')
      .insert([{ 
        client_id, 
        title, 
        media_url, 
        caption, 
        scheduled_at: scheduled_at || null, 
        status: 'Em Análise',
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

// PATCH: Edição COMPLETA do post de aprovação
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, magic_link, ...updates } = body;

    // Se temos magic_link mas não id (vindo do portal do cliente)
    if (!id && magic_link) {
      const { data, error } = await supabase
        .from('content_posts')
        .update(updates)
        .eq('magic_link', magic_link)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    // Se temos ID (vindo do painel admin)
    if (id) {
       const { data, error } = await supabase
        .from('content_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
       if (error) return NextResponse.json({ error: error.message }, { status: 500 });
       return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'ID or Magic Link is required' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
