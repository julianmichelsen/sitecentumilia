import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validate } from '@/lib/validation';

const blogSchema = z.object({
  slug: z.string().min(1, 'slug obrigatório'),
  title: z.string().min(1, 'título obrigatório'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'conteúdo obrigatório'),
  coverImage: z.string().optional(),
  cover_image: z.string().optional(),
  date: z.string().optional()
});

const slugQuerySchema = z.object({
  slug: z.string().min(1, 'slug obrigatório')
});

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin.from('blog').select('*').order('date', { ascending: false });
  if (error) return NextResponse.json({ error: 'Erro ao listar' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const parsed = validate(blogSchema, await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
  }
  const body = parsed.data;
  const dbData = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    cover_image: body.coverImage || body.cover_image,
    date: body.date
  };

  const { error } = await supabaseAdmin.from('blog').upsert(dbData, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  return NextResponse.json({ success: true });
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
  const { error } = await supabaseAdmin.from('blog').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  return NextResponse.json({ success: true });
}
