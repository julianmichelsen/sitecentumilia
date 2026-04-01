import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Tenta o upload
    const { data, error } = await supabaseAdmin.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
       // Se der erro aqui, é provável que o bucket 'media' não exista ou não seja público
       console.error('Erro Supabase Storage:', error);
       return NextResponse.json({ 
         error: `Erro no banco: ${error.message}. Verifique se o bucket 'media' foi criado no Supabase.`,
         details: error 
       }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: publicUrl, path: publicUrl });
  } catch (err: any) {
    console.error('Erro interno:', err);
    return NextResponse.json({ error: err.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
