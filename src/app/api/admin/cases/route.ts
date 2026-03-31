import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { data, error } = await supabase.from('cases').select('*').order('date', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar cases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, created_at, ...updateData } = body; // Removemos o ID se estivermos criando novo
    
    // Mapeamos para os nomes de colunas do banco (snake_case)
    const dbData = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      cover_image: body.coverImage || body.cover_image,
      client: body.client,
      segment: body.segment,
      location: body.location,
      period: body.period,
      services: body.services,
      results: body.results,
      video_url: body.videoUrl || body.video_url,
      testimonial: body.testimonial,
      testimonial_author: body.testimonialAuthor || body.testimonial_author,
      metrics: body.metrics,
      date: body.date
    };

    const { error } = await supabase
      .from('cases')
      .upsert(dbData, { onConflict: 'slug' });
    
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Case salvo no Supabase' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar no banco' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  const { error } = await supabase.from('cases').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
