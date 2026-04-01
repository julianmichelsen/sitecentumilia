import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validate } from '@/lib/validation';

const caseSchema = z.object({
  slug: z.string().min(1, 'slug obrigatório'),
  title: z.string().min(1, 'título obrigatório'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'conteúdo obrigatório'),
  coverImage: z.string().optional(),
  cover_image: z.string().optional(),
  client: z.string().optional(),
  segment: z.string().optional(),
  location: z.string().optional(),
  period: z.string().optional(),
  services: z.union([z.string(), z.array(z.string())]).optional(),
  results: z.union([z.string(), z.array(z.string())]).optional(),
  videoUrl: z.string().optional(),
  video_url: z.string().optional(),
  testimonial: z.string().optional(),
  testimonialAuthor: z.string().optional(),
  testimonial_author: z.string().optional(),
  metrics: z.unknown().optional(),
  date: z.string().optional()
});

const slugQuerySchema = z.object({
  slug: z.string().min(1, 'slug obrigatório')
});

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { data, error } = await supabaseAdmin.from('cases').select('*').order('date', { ascending: false });
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
    const parsed = validate(caseSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
    }
    const body = parsed.data;
    
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

    const { error } = await supabaseAdmin
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
  const parsed = validate(slugQuerySchema, Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Slug obrigatório' }, { status: 400 });
  }
  const { slug } = parsed.data;
  
  const { error } = await supabaseAdmin.from('cases').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
