import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, getAuthToken, getCookieName } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Credenciais obrigatórias' }, { status: 400 });
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: 'Login realizado com sucesso' });
    
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
