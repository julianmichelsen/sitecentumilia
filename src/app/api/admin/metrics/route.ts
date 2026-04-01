import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function count(table: string, status?: { column: string; value: string }) {
  const query = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
  const { count, error } = status ? await query.eq(status.column, status.value) : await query;
  if (error) throw error;
  return count || 0;
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const [leads, tasks, pending, clients] = await Promise.all([
      count('leads'),
      count('tasks', { column: 'status', value: 'Produção' }),
      count('content_posts', { column: 'status', value: 'Aguardando Cliente' }),
      count('clients')
    ]);

    return NextResponse.json({ leads, tasks, pending, clients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao calcular métricas' }, { status: 500 });
  }
}
