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
  Trash2
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
  const [newTask, setNewTask] = useState({ 
    client_id: '', title: '', description: '', status: 'Backlog', priority: 'Média', assignee: 'Julian', deadline: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [tRes, cRes] = await Promise.all([fetch('/api/admin/tasks'), fetch('/api/admin/clients')]);
      const [tData, cData] = await Promise.all([tRes.json(), cRes.json()]);
      setTasks(Array.isArray(tData) ? tData : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch (_) {} finally { setLoading(false); }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
    }
  };

  async function handleSaveTask(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = !!editTask;
    const res = await fetch('/api/admin/tasks', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? editTask : newTask),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setEditTask(null);
      fetchData();
    }
  }

  const renderTaskCard = (t: Task) => (
    <div key={t.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, t.id)}
      className="bg-[#111] border border-[#222] p-5 rounded-2xl shadow-xl hover:border-brand-neon/40 transition-all cursor-move group space-y-4"
    >
       <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-brand-neon tracking-widest">
            {clients.find(c => c.id === t.client_id)?.name || 'Cliente'}
          </span>
          <button onClick={() => { setEditTask(t); setIsModalOpen(true); }} className="p-1.5 bg-[#1a1a1a] rounded-lg text-gray-500 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all">
             <Edit3 className="w-3.5 h-3.5" />
          </button>
       </div>
       <h4 className="text-white font-bold text-sm leading-snug">{t.title}</h4>
       <div className="flex items-center gap-3 text-[9px] text-gray-500 font-bold uppercase tracking-widest pt-2 border-t border-white/5">
          <Clock className="w-3 h-3 text-brand-cyan" /> {t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : 'Sem data'}
          <User className="w-3 h-3 text-brand-purple" /> {t.assignee}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2">
             <Layout className="w-8 h-8 text-brand-neon" /> Operação: Demandas
          </h1>
          <p className="text-gray-500 text-sm">Arraste os cards para mudar o status ou clique no ícone para editar.</p>
        </div>
        <button onClick={() => { setEditTask(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> Criar Demanda
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-neon animate-spin" /></div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[75vh]">
           {TASK_COLUMNS.map(col => (
              <div key={col} 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => handleDrop(e, col)}
                className="w-[320px] shrink-0 space-y-4"
              >
                 <div className="flex items-center justify-between px-2 text-gray-500 mb-2">
                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${col === 'Concluído' ? 'bg-green-500' : 'bg-brand-neon'}`}></div>
                       {col}
                    </h3>
                    <span className="text-[10px] font-bold bg-[#111] px-2 py-0.5 rounded border border-[#222]">
                       {tasks.filter(t => t.status === col).length}
                    </span>
                 </div>
                 <div className="space-y-4 min-h-[500px] border border-dashed border-white/5 rounded-3xl p-1">
                    {tasks.filter(t => t.status === col).map(renderTaskCard)}
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Modal Nova/Editar Demanda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
           <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{editTask ? 'Editar Demanda' : 'Nova Demanda'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveTask} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Cliente</label>
                    <select required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={editTask ? editTask.client_id : newTask.client_id} onChange={e => editTask ? setEditTask({...editTask, client_id: e.target.value}) : setNewTask({...newTask, client_id: e.target.value})}>
                       <option value="">Selecione o Cliente</option>
                       {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Título</label>
                    <input required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={editTask ? editTask.title : newTask.title} onChange={e => editTask ? setEditTask({...editTask, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Responsável</label>
                       <input className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={editTask ? editTask.assignee : newTask.assignee} onChange={e => editTask ? setEditTask({...editTask, assignee: e.target.value}) : setNewTask({...newTask, assignee: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Prazo</label>
                       <input type="date" className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white" value={editTask ? editTask.deadline : newTask.deadline} onChange={e => editTask ? setEditTask({...editTask, deadline: e.target.value}) : setNewTask({...newTask, deadline: e.target.value})} />
                    </div>
                 </div>
                 <button className="w-full bg-brand-neon p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-neon/20">
                    {editTask ? 'Salvar Alterações' : 'Adicionar ao Kanban'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
