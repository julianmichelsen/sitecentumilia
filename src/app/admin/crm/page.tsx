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
  AlertCircle
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
  'Novo': 'bg-brand-neon',
  'Em Contato': 'bg-brand-cyan',
  'Diagnóstico': 'bg-brand-blue',
  'Proposta': 'bg-brand-purple',
  'Fechado': 'bg-green-500',
  'Perdido': 'bg-red-500',
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ nome: '', empresa: '', email: '', phone: '', segment: '', message: '', status: 'Novo' });
  const [saving, setSaving] = useState(false);
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
       setMessage('Erro ao carregar leads ❌');
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
    e.preventDefault();
    setSaving(true);
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
    } catch (_) {
       setMessage('Erro ao gravar dados ❌');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente apagar esse lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
         fetchLeads();
         setMessage('Lead removido ✅');
         setTimeout(() => setMessage(''), 3000);
      }
    } catch (_) {}
  }

  const renderCard = (l: Lead) => (
    <div key={l.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, l.id)}
      className="bg-[#111] border border-white/5 p-5 rounded-2xl shadow-xl hover:border-brand-neon/40 transition-all cursor-move group mb-4"
    >
       <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em]">{l.segment || 'Geral'}</span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => { setEditLead(l); setIsModalOpen(true); }} className="p-1 px-2 border border-white/5 rounded-lg text-gray-500 hover:text-brand-neon hover:bg-brand-neon/10 transition-all text-[8px] font-black uppercase tracking-widest">
                EDITAR
             </button>
             <button onClick={() => handleDelete(l.id)} className="p-1 px-2 border border-white/5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>
       </div>
       <h4 className="text-white font-bold text-sm mb-1">{l.nome}</h4>
       <p className="text-gray-500 text-[10px] mb-4">{l.empresa || 'Sem Empresa'}</p>
       
       <div className="space-y-2 mb-2 border-t border-white/5 pt-3">
         {l.phone && <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium"><Phone className="w-3 h-3 text-brand-neon" /> {l.phone}</div>}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-3 italic">
             CRM de Vendas
          </h1>
          <p className="text-gray-500 text-sm">Arraste os cards para avançar no funil ou gerencie leads.</p>
        </div>
        <button onClick={() => { setEditLead(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-brand-neon/20">
          <Plus className="w-4 h-4" /> Novo Lead B2B
        </button>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-blue text-white font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[75vh]">
         {COLUMNS.map(col => (
            <div key={col} 
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => handleDrop(e, col)}
              className="w-[300px] shrink-0 space-y-4"
            >
               <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-3">
                     <span className={`w-2.5 h-2.5 rounded-full ${COLUMN_COLORS[col]} shadow-[0_0_10px_rgba(0,0,0,1)]`}></span>
                     <h3 className="text-[11px] font-black uppercase text-white tracking-[0.2em]">{col}</h3>
                     <span className="text-[9px] font-bold text-gray-500 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/5">
                        {leads.filter(l => l.status === col).length}
                     </span>
                  </div>
               </div>
               <div className="space-y-4 min-h-[500px] bg-black/20 rounded-[2.5rem] p-3 border border-white/5">
                  {leads.filter(l => l.status === col).map(renderCard)}
                  {leads.filter(l => l.status === col).length === 0 && (
                    <div className="h-32 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">Vazio</div>
                  )}
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
           <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{editLead ? 'Ajustar Lead' : 'Captação Manual'}</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Conectando Ideias ao Crescimento</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveLead} className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Nome" required className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm text-white focus:border-brand-neon outline-none" value={editLead ? editLead.nome : newLead.nome} onChange={e => editLead ? setEditLead({...editLead, nome: e.target.value}) : setNewLead({...newLead, nome: e.target.value})} />
                    <input placeholder="Empresa" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm text-white focus:border-brand-neon outline-none" value={editLead ? editLead.empresa : newLead.empresa} onChange={e => editLead ? setEditLead({...editLead, empresa: e.target.value}) : setNewLead({...newLead, empresa: e.target.value})} />
                 </div>
                 <input placeholder="WhatsApp" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm text-white focus:border-brand-neon outline-none" value={editLead ? editLead.phone : newLead.phone} onChange={e => editLead ? setEditLead({...editLead, phone: e.target.value}) : setNewLead({...newLead, phone: e.target.value})} />
                 <textarea placeholder="Observações" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm text-white h-24 rounded-2xl resize-none outline-none" value={editLead ? editLead.message : newLead.message} onChange={e => editLead ? setEditLead({...editLead, message: e.target.value}) : setNewLead({...newLead, message: e.target.value})} />
                 <button className="w-full bg-brand-neon p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(1,250,164,0.3)]">
                    {editLead ? 'Salvar Alterações' : 'Cadastrar na Base'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
