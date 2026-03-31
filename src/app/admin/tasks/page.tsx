'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  User, 
  CheckCircle2, 
  Edit3, 
  Briefcase, 
  Clock, 
  Tag,
  Layout,
  X,
  Loader2,
  Trash2,
  AlertCircle
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
}

interface Client {
  id: string;
  name: string;
}

const TASK_COLUMNS = ['Backlog', 'Produção', 'Revisão', 'Concluído'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ client_id: '', title: '', description: '', status: 'Backlog', priority: 'Média', assignee: 'Julian', deadline: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [tRes, cRes] = await Promise.all([fetch('/api/admin/tasks'), fetch('/api/admin/clients')]);
      const [tData, cData] = await Promise.all([tRes.json(), cRes.json()]);
      setTasks(Array.isArray(tData) ? tData : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch (_) {}
    finally { setLoading(false); }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const id = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== newStatus) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    }
  };

  async function handleSaveTask(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = !!editTask;
    try {
      const res = await fetch('/api/admin/tasks', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? editTask : newTask),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditTask(null);
        fetchData();
        setMessage(isEdit ? 'Demanda atualizada ✅' : 'Demanda criada 🚀');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (_) {}
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir essa tarefa definitivamente?')) return;
    try {
      const res = await fetch(`/api/admin/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        setMessage('Tarefa removida ✅');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (_) {}
  }

  const renderTaskCard = (t: Task) => (
    <div key={t.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, t.id)}
      className="bg-[#111] border border-white/5 p-5 rounded-2xl shadow-xl hover:border-brand-neon/40 transition-all cursor-move group mb-4"
    >
       <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black uppercase text-brand-neon tracking-widest italic">
            {clients.find(c => c.id === t.client_id)?.name || 'Cliente'}
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => { setEditTask(t); setIsModalOpen(true); }} className="p-1 px-2 border border-white/5 rounded-lg text-gray-500 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all text-[8px] font-black uppercase">EDI</button>
             <button onClick={() => handleDelete(t.id)} className="p-1 px-2 border border-white/5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>
       </div>
       <h4 className="text-white font-bold text-sm leading-snug">{t.title}</h4>
       <div className="flex items-center gap-3 text-[9px] text-gray-500 font-black uppercase tracking-widest pt-3 border-t border-white/5 mt-2">
          <Calendar className="w-3 h-3 text-brand-cyan" /> {t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : 'Sem data'}
          <User className="w-3 h-3 text-brand-purple" /> {t.assignee}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2 italic">
             Demandas Centum
          </h1>
          <p className="text-gray-500 text-sm">Operação interna e gestão de entregas.</p>
        </div>
        <button onClick={() => { setEditTask(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-brand-neon/20">
          <Plus className="w-4 h-4" /> Criar Demanda
        </button>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-neon text-black font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[75vh]">
           {TASK_COLUMNS.map(col => (
              <div key={col} 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => handleDrop(e, col)}
                className="w-[320px] shrink-0 space-y-4"
              >
                 <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">{col}</h3>
                    <span className="text-[9px] font-bold text-gray-600 bg-black/50 px-2 py-0.5 rounded-full border border-white/5">
                       {tasks.filter(t => t.status === col).length}
                    </span>
                 </div>
                 <div className="space-y-4 min-h-[500px] bg-black/10 rounded-[2.5rem] p-3 border border-white/5">
                    {tasks.filter(t => t.status === col).map(renderTaskCard)}
                 </div>
              </div>
           ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
           <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{editTask ? 'Editar Demanda' : 'Nova Demanda'}</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Metodologia Centumilia de Entrega</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveTask} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Cliente</label>
                    <select required className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none transition-all" value={editTask ? editTask.client_id : newTask.client_id} onChange={e => editTask ? setEditTask({...editTask, client_id: e.target.value}) : setNewTask({...newTask, client_id: e.target.value})}>
                       <option value="">Selecione o Cliente</option>
                       {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <input placeholder="Título da Tarefa" required className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none" value={editTask ? editTask.title : newTask.title} onChange={e => editTask ? setEditTask({...editTask, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Responsável" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none" value={editTask ? editTask.assignee : newTask.assignee} onChange={e => editTask ? setEditTask({...editTask, assignee: e.target.value}) : setNewTask({...newTask, assignee: e.target.value})} />
                    <input type="date" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none" value={editTask ? editTask.deadline : newTask.deadline} onChange={e => editTask ? setEditTask({...editTask, deadline: e.target.value}) : setNewTask({...newTask, deadline: e.target.value})} />
                 </div>
                 <button className="w-full bg-brand-neon p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(1,250,164,0.3)]">
                    {editTask ? 'Salvar Edição' : 'Lançar no Kanban'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
