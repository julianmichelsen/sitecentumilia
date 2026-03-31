'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  User, 
  CheckCircle2, 
  MoreVertical, 
  Briefcase, 
  Clock, 
  Tag,
  Layout
} from 'lucide-react';

interface Task {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  deadline: string;
  tags: string[];
  checklist: { item: string; done: boolean }[];
}

const TASK_COLUMNS = ['Backlog', 'Produção', 'Revisão', 'Concluído'];

const PRIORITY_COLORS: Record<string, string> = {
  'Baixa': 'text-green-500 bg-green-500/10',
  'Média': 'text-brand-cyan bg-brand-cyan/10',
  'Alta': 'text-red-500 bg-red-500/10',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Exemplo de dados iniciais para preencher o visual
  const exampleTasks: Task[] = [
    {
      id: '1',
      client_id: '1',
      title: 'Campanha Meta Ads - Lançamento Abril',
      description: 'Configurar novos criativos e público de remarketing',
      status: 'Produção',
      priority: 'Alta',
      assignee: 'Julian',
      deadline: '2026-04-05',
      tags: ['Tráfego', 'Performance'],
      checklist: [{ item: 'Configurar Pixel', done: true }, { item: 'Criativos A/B', done: false }]
    },
    {
      id: '2',
      client_id: '1',
      title: 'Roteiro de 5 Reels Institucionais',
      description: 'Roteiros focados em Metodologia CENTUM',
      status: 'Revisão',
      priority: 'Média',
      assignee: 'Freelancer Design',
      deadline: '2026-04-02',
      tags: ['Social Media', 'Copy'],
      checklist: []
    }
  ];

  useEffect(() => {
    // Simulação de fetch (Vou conectar ao Supabase em seguida)
    setTasks(exampleTasks);
    setLoading(false);
  }, []);

  const renderTaskCard = (t: Task) => (
    <div key={t.id} className="bg-[#111] border border-[#222] p-4 rounded-2xl shadow-xl hover:border-brand-neon/40 transition-all cursor-pointer group space-y-4">
       <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
             {t.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-[#1a1a1a] text-[9px] text-gray-500 font-bold uppercase rounded border border-[#333] tracking-wide">
                   {tag}
                </span>
             ))}
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${PRIORITY_COLORS[t.priority]}`}>
             {t.priority}
          </span>
       </div>

       <h4 className="text-white font-bold leading-snug group-hover:text-brand-neon transition-colors">{t.title}</h4>
       
       <div className="flex items-center gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
             <Clock className="w-3.5 h-3.5 text-brand-cyan" />
             {new Date(t.deadline).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center gap-1.5">
             <User className="w-3.5 h-3.5 text-brand-purple" />
             {t.assignee}
          </div>
       </div>

       {t.checklist.length > 0 && (
          <div className="pt-3 border-t border-[#222]">
             <div className="flex items-center justify-between text-[10px] font-bold mb-2">
                <span className="text-gray-600 uppercase tracking-widest">Progresso</span>
                <span className="text-brand-neon">{t.checklist.filter(c => c.done).length}/{t.checklist.length}</span>
             </div>
             <div className="w-full bg-[#1a1a1a] h-1 rounded-full overflow-hidden">
                <div className="bg-brand-neon h-full transition-all" style={{ width: `${(t.checklist.filter(c => c.done).length / t.checklist.length) * 100}%` }}></div>
             </div>
          </div>
       )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2">
             <Layout className="w-8 h-8 text-brand-neon" /> Operação: Demandas
          </h1>
          <p className="text-gray-500 text-sm">Gerenciamento interno de entregas por cliente</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-[#111] border border-[#222] rounded-xl px-4 py-2 text-sm text-gray-400">
              Todos os Clientes
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:scale-105 active:scale-95 transition-all">
             <Plus className="w-4 h-4" /> Criar Demanda
           </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[75vh]">
         {TASK_COLUMNS.map(col => (
            <div key={col} className="w-[320px] shrink-0 space-y-4">
               <div className="flex items-center justify-between px-2 text-gray-500">
                  <div className="flex items-center gap-2">
                     <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">{col}</h3>
                     <span className="text-[10px] font-bold bg-[#111] px-2 py-0.5 rounded border border-[#222]">
                        {tasks.filter(t => t.status === col).length}
                     </span>
                  </div>
                  <MoreVertical className="w-3.5 h-3.5" />
               </div>

               <div className="space-y-4 min-h-[500px] p-1">
                  {tasks.filter(t => t.status === col).map(renderTaskCard)}
                  <button className="w-full h-11 border-2 border-dashed border-[#222] hover:border-brand-neon/30 hover:bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-[11px] font-bold text-gray-500 transition-all gap-2 group">
                     <Plus className="w-4 h-4 group-hover:text-brand-neon" /> Adicionar
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
