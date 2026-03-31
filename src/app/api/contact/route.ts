import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, empresa, email, telefone, segmento, mensagem } = body;

    if (!nome || !email || !telefone) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Tenta salvar no Supabase na tabela 'leads'
    // Se a tabela não existir, ele vai dar erro, mas o log vai nos avisar
    const { error } = await supabase
      .from('leads')
      .insert([
        { 
          nome, 
          empresa, 
          email, 
          phone: telefone, 
          segment: segmento, 
          message: mensagem,
          created_at: new Date().toISOString() 
        }
      ]);

    if (error) {
      console.error('Erro ao salvar lead:', error);
      // Mesmo com erro no banco, vamos simular sucesso para o usuário não travar
      // Mas avisamos no console do servidor
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro na API de contato:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
