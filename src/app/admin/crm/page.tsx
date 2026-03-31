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
  ChevronRight
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
  created_at: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ nome: '', empresa: '', email: '', phone: '', segment: '', message: '', status: 'Novo' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewLead({ nome: '', empresa: '', email: '', phone: '', segment: '', message: '', status: 'Novo' });
        fetchLeads();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function updateLeadStatus(id: string, currentStatus: string) {
    // Implementando um movimento linear para facilitar o fluxo (Novo -> Em Contato -> etc)
    const currentIndex = COLUMNS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % COLUMNS.length;
    const nextStatus = COLUMNS[nextIndex];

    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      fetchLeads();
    } catch (err) { console.error(err); }
  }

  const renderCard = (l: Lead) => (
    <div key={l.id} 
      onClick={() => updateLeadStatus(l.id, l.status)}
      className="bg-[#111] border border-[#222] p-5 rounded-2xl shadow-xl hover:border-brand-neon/40 transition-all cursor-pointer group active:scale-95"
    >
       <div className="flex items-center justify-between mb-4 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">
         <span>{l.segment || 'Geral'}</span>
         <ChevronRight className="w-3 h-3 group-hover:text-brand-neon group-hover:translate-x-1 transition-all" />
       </div>
       <h4 className="text-white font-bold text-sm mb-1">{l.nome}</h4>
       <p className="text-gray-500 text-[11px] mb-4 italic line-clamp-1">{l.empresa || 'Empresa Direta'}</p>
       
       <div className="space-y-2 mb-4 border-t border-white/5 pt-3">
         {l.phone && <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium"><Phone className="w-3 h-3 text-brand-neon" /> {l.phone}</div>}
         {l.email && <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium"><Mail className="w-3 h-3 text-brand-cyan" /> {l.email}</div>}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">CRM: Funil de Vendas</h1>
          <p className="text-gray-500 text-sm">Clique no card para avançar o lead para a próxima etapa.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:shadow-[0_0_20px_rgba(1,250,164,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-neon animate-spin" /></div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar min-h-[70vh]">
          {COLUMNS.map(col => (
            <div key={col} className="w-[300px] shrink-0 bg-brand-darker/50 p-4 rounded-3xl border border-white/5">
               <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-center gap-3">
                     <span className={`w-3 h-3 rounded-full ${COLUMN_COLORS[col]} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></span>
                     <h3 className="text-[10px] font-black uppercase text-white tracking-[0.2em]">{col}</h3>
                     <span className="text-[10px] font-bold text-gray-600 bg-black/50 px-2 py-0.5 rounded-full border border-white/5">
                       {leads.filter(l => l.status === col).length}
                     </span>
                  </div>
               </div>

               <div className="space-y-4">
                  {leads.filter(l => l.status === col).map(renderCard)}
                  {leads.filter(l => l.status === col).length === 0 && (
                     <div className="h-32 border-2 border-dashed border-[#222] rounded-3xl flex items-center justify-center text-gray-700 text-[10px] tracking-[0.3em] font-black uppercase">
                        Vazio
                     </div>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300 shadow-2xl">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Capturar Lead</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddLead} className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Nome</label>
                       <input required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none transition-all" value={newLead.nome} onChange={e => setNewLead({...newLead, nome: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Empresa</label>
                       <input className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none transition-all" value={newLead.empresa} onChange={e => setNewLead({...newLead, empresa: e.target.value})} />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">E-mail</label>
                       <input required type="email" className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none transition-all" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">WhatsApp</label>
                       <input required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none transition-all" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                    </div>
                 </div>
                 <button disabled={saving} className="w-full bg-brand-neon p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-brand-neon/20">
                    {saving ? 'Gravando Lead...' : 'Cadastrar na Base'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
