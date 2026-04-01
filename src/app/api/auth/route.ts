import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, getAuthToken, getCookieName, isAuthConfigured } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    if (!isAuthConfigured()) {
      console.error('Auth configuration missing:', {
        hasUser: !!process.env.ADMIN_USERNAME,
        hasPass: !!process.env.ADMIN_PASSWORD,
        hasToken: !!process.env.ADMIN_AUTH_TOKEN
      });
      return NextResponse.json({ 
        error: 'Servidor não configurado corretamente. Verifique as variáveis de ambiente.' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios' }, { status: 400 });
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 });
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Login realizado com sucesso' 
    });
    
    // Set authentication cookie
    response.cookies.set(getCookieName(), getAuthToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logout realizado' });
  response.cookies.delete(getCookieName());
  return response;
}
