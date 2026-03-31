'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Loader2,
  X,
  Edit2,
  CheckCircle2,
  Trash2,
  Briefcase,
  TrendingUp,
  Target,
  ArrowUpRight
} from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  phone: string;
  segment: string;
  message: string;
  status: string;
}

const COLUMNS = ['Novo', 'Em Contato', 'Diagnóstico', 'Proposta', 'Fechado', 'Perdido'];

const COLUMN_COLORS: Record<string, string> = {
  'Novo': 'bg-brand-neon shadow-brand-neon/40',
  'Em Contato': 'bg-brand-cyan shadow-brand-cyan/40',
  'Diagnóstico': 'bg-brand-blue shadow-brand-blue/40',
  'Proposta': 'bg-brand-purple shadow-brand-purple/40',
  'Fechado': 'bg-green-500 shadow-green-500/40',
  'Perdido': 'bg-red-500 shadow-red-500/40',
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ nome: '', empresa: '', email: '', phone: '', segment: '', message: '', status: 'Novo' });
  const [message, setMessage] = useState('');

  useEffect(() => {
     fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (_) { 
       setMessage('Erro sistêmico ao carregar dados ❌');
    } finally { setLoading(false); }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const id = e.dataTransfer.getData('leadId');
    const lead = leads.find(l => l.id === id);
    if (lead && lead.status !== newStatus) {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    }
  };

  async function handleSaveLead(e: React.FormEvent) {
    if (e) e.preventDefault();
    const isEdit = !!editLead;
    try {
       const res = await fetch('/api/admin/leads', {
         method: isEdit ? 'PATCH' : 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(isEdit ? editLead : newLead),
       });
       if (res.ok) {
         setIsModalOpen(false);
         setEditLead(null);
         fetchLeads();
       }
    } catch (_) {}
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente apagar esse lead da base de dados?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchLeads();
    } catch (_) {}
  }

  const renderCard = (l: Lead) => (
    <div key={l.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, l.id)}
      className="group relative mb-4 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-[#111] p-6 transition-all duration-500 hover:border-brand-neon/30 hover:shadow-[0_0_30px_rgba(1,250,164,0.05)] cursor-move active:scale-95"
    >
       <div className="mb-4 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em]">{l.segment || 'Growth B2B'}</span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => { setEditLead(l); setIsModalOpen(true); }} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                <Edit2 className="w-3.5 h-3.5" />
             </button>
             <button onClick={() => handleDelete(l.id)} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>
       </div>

       <div className="mb-6 space-y-1">
          <h4 className="text-[15px] font-black tracking-tight text-white">{l.nome}</h4>
          <p className="text-[11px] font-medium text-gray-500">{l.empresa || 'Empresa Direta'}</p>
       </div>

       <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-brand-neon animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{l.phone || 'N/A'}</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-700" />
       </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-[2000ms]">
      {/* Metric Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <div className="flex items-center gap-3 bg-brand-neon/5 w-fit px-4 py-2 rounded-full border border-brand-neon/20 animate-in slide-in-from-left-4 duration-1000">
               <Target className="w-4 h-4 text-brand-neon" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-neon">Funil Global CENTUM.</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase md:text-7xl">Pipeline de <br/><span className="text-brand-neon">Vendas</span> Centumilia.</h1>
         </div>
         <div className="flex flex-row gap-4">
            <button onClick={() => { setEditLead(null); setIsModalOpen(true); }} className="btn-elite-neon">
              <Plus className="w-4 h-4 inline mr-2" /> Novo Lead
            </button>
         </div>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-blue text-white font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      <div className="flex gap-10 overflow-x-auto pb-12 custom-scrollbar min-h-[75vh]">
         {COLUMNS.map(col => (
            <div key={col} 
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => handleDrop(e, col)}
              className="w-[320px] shrink-0 space-y-6"
            >
               <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                     <div className={`h-1.5 w-1.5 rounded-full ${COLUMN_COLORS[col]} shadow-[0_0_15px_inherit]`}></div>
                     <h3 className="text-[11px] font-black uppercase text-white tracking-[0.3em]">{col}</h3>
                  </div>
                  <span className="text-[10px] font-black text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {leads.filter(l => l.status === col).length}
                  </span>
               </div>
               <div className="min-h-[600px] rounded-[3rem] bg-white/[0.01] p-4 border border-white/[0.03]">
                  {leads.filter(l => l.status === col).map(renderCard)}
                  {leads.filter(l => l.status === col).length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/5 opacity-20">
                       <Search className="w-6 h-6 mb-2" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Sem Oportunidades</span>
                    </div>
                  )}
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-darker/95 backdrop-blur-2xl p-6">
           <div className="w-full max-w-xl rounded-[3.5rem] border border-white/10 bg-[#0a0a0a] p-12 space-y-10 animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-neon to-brand-cyan"></div>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Capturar Lead</h2>
                 <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveLead} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <input placeholder="Nome" required className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editLead ? editLead.nome : newLead.nome} onChange={e => editLead ? setEditLead({...editLead, nome: e.target.value}) : setNewLead({...newLead, nome: e.target.value})} />
                    <input placeholder="Empresa" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editLead ? editLead.empresa : newLead.empresa} onChange={e => editLead ? setEditLead({...editLead, empresa: e.target.value}) : setNewLead({...newLead, empresa: e.target.value})} />
                 </div>
                 <input placeholder="WhatsApp com DDD" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-neon outline-none text-white transition-all" value={editLead ? editLead.phone : newLead.phone} onChange={e => editLead ? setEditLead({...editLead, phone: e.target.value}) : setNewLead({...newLead, phone: e.target.value})} />
                 <textarea placeholder="Relatório Sistêmico do Lead" className="w-full bg-white/5 border border-white/5 p-6 rounded-[2rem] text-sm focus:border-brand-neon outline-none text-white transition-all h-32 resize-none" value={editLead ? editLead.message : newLead.message} onChange={e => editLead ? setEditLead({...editLead, message: e.target.value}) : setNewLead({...newLead, message: e.target.value})} />
                 <button className="w-full btn-elite-neon scale-y-110">
                    {editLead ? 'Salvar Edição Sistêmica' : 'Registrar Oportunidade'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
