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
  Layout,
  X,
  Loader2,
  ChevronRight
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

interface Client {
  id: string;
  name: string;
}

const TASK_COLUMNS = ['Backlog', 'Produção', 'Revisão', 'Concluído'];

const PRIORITY_COLORS: Record<string, string> = {
  'Baixa': 'text-green-500 bg-green-500/10',
  'Média': 'text-brand-cyan bg-brand-cyan/10',
  'Alta': 'text-red-500 bg-red-500/10',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [newTask, setNewTask] = useState({ 
    client_id: '', title: '', description: '', status: 'Backlog', priority: 'Média', assignee: 'Julian', deadline: '', tags: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [tRes, cRes] = await Promise.all([
        fetch('/api/admin/tasks'),
        fetch('/api/admin/clients')
      ]);
      const [tData, cData] = await Promise.all([tRes.json(), cRes.json()]);
      setTasks(Array.isArray(tData) ? tData : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTask({ client_id: '', title: '', description: '', status: 'Backlog', priority: 'Média', assignee: 'Julian', deadline: '', tags: [] });
        fetchData();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function updateTaskStatus(id: string, currentStatus: string) {
    const nextIndex = (TASK_COLUMNS.indexOf(currentStatus) + 1) % TASK_COLUMNS.length;
    const nextStatus = TASK_COLUMNS[nextIndex];
    try {
      await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      fetchData();
    } catch (err) { console.error(err); }
  }

  const renderTaskCard = (t: Task) => {
    const clientName = clients.find(c => c.id === t.client_id)?.name || 'Cliente';
    return (
      <div key={t.id} 
        onClick={() => updateTaskStatus(t.id, t.status)}
        className="bg-[#111] border border-[#222] p-5 rounded-2xl shadow-xl hover:border-brand-neon/40 transition-all cursor-pointer group space-y-4 active:scale-95"
      >
         <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase text-brand-neon tracking-widest">{clientName}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${PRIORITY_COLORS[t.priority]}`}>
               {t.priority}
            </span>
         </div>

         <h4 className="text-white font-bold leading-snug group-hover:text-brand-neon transition-colors text-sm">{t.title}</h4>
         
         <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-brand-cyan" /> {t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : 'No Date'}</div>
            <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-brand-purple" /> {t.assignee}</div>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2">
             <Layout className="w-8 h-8 text-brand-neon" /> Operação: Demandas
          </h1>
          <p className="text-gray-500 text-sm">Clique na tarefa para avançar o status (Backlog → Concluído)</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> Criar Demanda
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-neon animate-spin" /></div>
      ) : (
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
                 </div>

                 <div className="space-y-4 min-h-[400px]">
                    {tasks.filter(t => t.status === col).map(renderTaskCard)}
                    {tasks.filter(t => t.status === col).length === 0 && (
                       <div className="h-32 border-2 border-dashed border-[#222] rounded-2xl flex items-center justify-center text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">
                          Vazio
                       </div>
                    )}
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Modal Nova Demanda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Nova Demanda</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Cliente Ativo</label>
                    <select required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={newTask.client_id} onChange={e => setNewTask({...newTask, client_id: e.target.value})}>
                       <option value="">Selecione o Cliente</option>
                       {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Título da Tarefa</label>
                    <input required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Prioridade</label>
                       <select className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                          <option value="Baixa">Baixa</option>
                          <option value="Média">Média</option>
                          <option value="Alta">Alta</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Responsável</label>
                       <input className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Deadline</label>
                    <input type="date" required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                 </div>
                 <button disabled={saving} className="w-full bg-brand-neon p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-neon/20">
                    {saving ? 'Criando Demanda...' : 'Adicionar ao Kanban'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
