import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Lista todos os posts
export async function GET() {
  const { data, error } = await supabase
    .from('content_posts')
    .select('*')
    .order('created_at', { ascending: false });

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
        scheduled_at, 
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

// PATCH: Atualiza aprovado/ajuste (pelo magic link)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { magic_link, status, feedback } = body;

    const { data, error } = await supabase
      .from('content_posts')
      .update({ status, client_feedback: feedback })
      .eq('magic_link', magic_link)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
