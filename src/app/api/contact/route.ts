import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { consumeContactRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limitResult = consumeContactRateLimit(request);
  if (!limitResult.ok) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um momento.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { 
      nome, 
      email, 
      telefone: phone, 
      empresa, 
      segmento: segment, 
      mensagem: message 
    } = body;

    // 1. Grava o lead na tabela 'leads' do CRM Centumilia
    const { error: leadError } = await supabase
      .from('leads')
      .insert([
        { 
          nome, 
          email, 
          phone, 
          empresa: empresa || 'N/A', 
          segment: segment || 'Geral', 
          message,
          status: 'Novo' 
        }
      ]);

    if (leadError) {
      console.error('Erro ao salvar lead no banco:', leadError);
      return NextResponse.json({ error: 'Erro ao processar sua solicitação.' }, { status: 500 });
    }

    // 2. Aqui você poderia adicionar um envio de e-mail (Resend/Nodemailer)
    // Por enquanto, o lead já está seguro no seu ERP Centumilia.

    return NextResponse.json({ 
      success: true, 
      message: 'Sua solicitação foi enviada com sucesso! Nossa equipe entrará em contato em breve.' 
    });

  } catch (error) {
    console.error('Erro na API de contato:', error);
    return NextResponse.json({ error: 'Ocorreu um erro inesperado.' }, { status: 500 });
  }
}
