import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validate } from '@/lib/validation';

const configSchema = z.object({
  siteName: z.string().min(1, 'siteName obrigatório'),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional()
});

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin.from('config').select('*').single();
  if (error) return NextResponse.json({ siteName: 'Centumilia' });
  return NextResponse.json({
    siteName: data.site_name,
    tagline: data.tagline,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    location: data.location,
    instagram: data.instagram,
    linkedin: data.linkedin
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const parsed = validate(configSchema, await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.errors }, { status: 400 });
  }
  const body = parsed.data;
  const dbData = {
    id: 1,
    site_name: body.siteName,
    tagline: body.tagline,
    phone: body.phone,
    whatsapp: body.whatsapp,
    email: body.email,
    location: body.location,
    instagram: body.instagram,
    linkedin: body.linkedin
  };
  const { error } = await supabaseAdmin.from('config').upsert(dbData);
  if (error) return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
