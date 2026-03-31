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
  AlertCircle,
  Activity
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

  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('taskId', id); };
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const id = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== newStatus) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await fetch('/api/admin/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
    }
  };

  async function handleSaveTask(e: React.FormEvent) {
    if (e) e.preventDefault();
    const isEdit = !!editTask;
    try {
      const res = await fetch('/api/admin/tasks', { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(isEdit ? editTask : newTask) });
      if (res.ok) {
        setIsModalOpen(false);
        setEditTask(null);
        fetchData();
        setMessage(isEdit ? 'Sincronização OK! ✅' : 'Nova Demanda Lançada 🚀');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (_) {}
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir essa tarefa definitivamente?')) return;
    try {
      const res = await fetch(`/api/admin/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (_) {}
  }

  const renderTaskCard = (t: Task) => (
    <div key={t.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, t.id)}
      className="glass-card mb-4 p-5 rounded-[2rem] hover:border-brand-neon/30 hover:scale-[1.02] transition-all duration-500 cursor-move group relative active:scale-95 shadow-inner"
    >
       <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black uppercase text-brand-neon tracking-widest italic flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-brand-neon rounded-full animate-pulse shadow-[0_0_10px_rgba(1,250,164,0.5)]"></div>
            {clients.find(c => c.id === t.client_id)?.name || 'Cliente'}
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => { setEditTask(t); setIsModalOpen(true); }} className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-brand-cyan transition-all">
                <Edit3 className="w-3.5 h-3.5" />
             </button>
             <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>
       </div>

       <h4 className="text-[14px] font-black italic tracking-tighter text-white mb-6 uppercase leading-tight">{t.title}</h4>

       <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex items-center gap-3">
             <Clock className="w-3 h-3 text-brand-cyan" />
             <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : 'No Date'}</span>
          </div>
          <div className="flex -space-x-2">
             <div className="h-6 w-6 rounded-full bg-brand-neon/20 border border-brand-neon/40 flex items-center justify-center text-[8px] font-black text-brand-neon">{t.assignee.charAt(0)}</div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-[1500ms] pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <div className="flex items-center gap-3 bg-brand-neon/5 w-fit px-4 py-2 rounded-full border border-brand-neon/20 animate-in slide-in-from-left-4 duration-1000">
               <Activity className="w-4 h-4 text-brand-neon" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-neon">Sistemas Ativos.</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">Demanda <br/><span className="text-brand-neon">Operação</span> Centumilia.</h1>
         </div>
         <button onClick={() => { setEditTask(null); setIsModalOpen(true); }} className="btn-elite-neon">
            <Plus className="w-4 h-4 inline mr-2" /> Gerar Demanda
         </button>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-neon text-black font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      <div className="flex gap-10 overflow-x-auto pb-12 custom-scrollbar min-h-[75vh]">
           {TASK_COLUMNS.map(col => (
              <div key={col} 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => handleDrop(e, col)}
                className="w-[320px] shrink-0 space-y-6"
              >
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-[11px] font-black uppercase text-white tracking-[0.3em]">{col}</h3>
                    <span className="text-[10px] font-black text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                       {tasks.filter(t => t.status === col).length}
                    </span>
                 </div>
                 <div className="min-h-[600px] rounded-[3rem] bg-white/[0.01] p-4 border border-white/[0.03]">
                    {tasks.filter(t => t.status === col).map(renderTaskCard)}
                 </div>
              </div>
           ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-darker/95 backdrop-blur-2xl p-6">
           <div className="w-full max-w-xl rounded-[3.5rem] border border-white/10 bg-[#0a0a0a] p-12 space-y-10 animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden shadow-brand-neon/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-neon to-brand-cyan"></div>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Gerar Demanda</h2>
                 <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveTask} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-3">Sócio Centumilia (Cliente)</label>
                    <select required className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editTask ? editTask.client_id : newTask.client_id} onChange={e => editTask ? setEditTask({...editTask, client_id: e.target.value}) : setNewTask({...newTask, client_id: e.target.value})}>
                       <option value="">Escolher Cliente Ativo</option>
                       {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <input placeholder="Título da Ação Estratégica" required className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editTask ? editTask.title : newTask.title} onChange={e => editTask ? setEditTask({...editTask, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})} />
                 <div className="grid grid-cols-2 gap-6">
                    <input placeholder="Analista Responsável" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editTask ? editTask.assignee : newTask.assignee} onChange={e => editTask ? setEditTask({...editTask, assignee: e.target.value}) : setNewTask({...newTask, assignee: e.target.value})} />
                    <input type="date" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editTask ? editTask.deadline : newTask.deadline} onChange={e => editTask ? setEditTask({...editTask, deadline: e.target.value}) : setNewTask({...newTask, deadline: e.target.value})} />
                 </div>
                 <button className="w-full btn-elite-neon scale-y-110">
                    {editTask ? 'Atualizar Sistema' : 'Sincronizar no Kanban'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
