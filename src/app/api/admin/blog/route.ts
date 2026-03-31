import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { data, error } = await supabase.from('blog').select('*').order('date', { ascending: false });
  if (error) return NextResponse.json({ error: 'Erro ao listar' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const body = await request.json();
  const dbData = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    cover_image: body.coverImage || body.cover_image,
    date: body.date
  };

  const { error } = await supabase.from('blog').upsert(dbData, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const { error } = await supabase.from('blog').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  return NextResponse.json({ success: true });
}
