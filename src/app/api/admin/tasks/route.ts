import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Lista todas as tarefas
export async function GET() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('deadline', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Cria uma nova tarefa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id, title, description, status, priority, assignee, deadline, tags, checklist } = body;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ client_id, title, description, status, priority, assignee, deadline: deadline || null, tags, checklist }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
