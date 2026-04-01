import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

// GET: Lista todos os posts OU filtra por um magic_link específico
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const magicLink = searchParams.get('magic_link');

  if (!magicLink && !isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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

// POST: Envia um novo criativo
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { client_id, title, media_url, caption, status, scheduled_at } = body;

    const { data, error } = await supabase
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
    const body = await request.json();
    const { id, magic_link, ...payloadUpdates } = body;
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
      const { data, error } = await supabase
        .from('content_posts')
        .update(updates)
        .eq('magic_link', magic_link)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

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

// DELETE: Remove um post
export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabase
      .from('content_posts')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
