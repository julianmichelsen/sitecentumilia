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
  X
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

  async function updateLeadStatus(id: string, status: string) {
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchLeads();
    } catch (err) { console.error(err); }
  }

  const renderCard = (l: Lead) => (
    <div key={l.id} className="bg-[#1a1a1a] border border-[#222] p-4 rounded-xl shadow-lg hover:border-brand-neon/30 transition-all cursor-pointer group">
       <div className="flex items-center justify-between mb-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
         <span>{l.segment || 'Geral'}</span>
         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {COLUMNS.map(col => (
               <button key={col} onClick={() => updateLeadStatus(l.id, col)} className={`w-2 h-2 rounded-full ${COLUMN_COLORS[col]} hover:scale-150 transition-transform`} title={col}></button>
            ))}
         </div>
       </div>
       <h4 className="text-white font-bold text-sm mb-1">{l.nome}</h4>
       <p className="text-gray-500 text-xs mb-3 italic">{l.empresa || 'Empresa não informada'}</p>
       
       <div className="space-y-2 mb-4">
         {l.phone && <div className="flex items-center gap-2 text-xs text-gray-400"><Phone className="w-3 h-3 text-brand-neon" /> {l.phone}</div>}
         {l.email && <div className="flex items-center gap-2 text-xs text-gray-400"><Mail className="w-3 h-3 text-brand-cyan" /> {l.email}</div>}
       </div>

       <div className="flex items-center justify-between border-t border-[#222] pt-3 mt-1">
         <span className="text-[10px] text-gray-600">{new Date(l.created_at).toLocaleDateString('pt-BR')}</span>
         <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-brand-dark border border-[#222] flex items-center justify-center text-[10px] font-bold text-gray-400">
               {l.nome.charAt(0)}
            </div>
         </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">CRM de Vendas</h1>
          <p className="text-gray-500 text-sm">Metodologia CENTUM de Prospecção</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:shadow-[0_0_20px_rgba(1,250,164,0.3)] transition-all">
             <Plus className="w-4 h-4" /> Novo Lead
           </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-neon animate-spin" /></div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar min-h-[70vh]">
          {COLUMNS.map(col => (
            <div key={col} className="flex-1 min-w-[280px] bg-brand-darker p-3 rounded-2xl border border-transparent">
               <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${COLUMN_COLORS[col]}`}></span>
                     <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">{col}</h3>
                     <span className="bg-[#1a1a1a] text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                       {leads.filter(l => l.status === col).length}
                     </span>
                  </div>
               </div>

               <div className="space-y-4">
                  {leads.filter(l => l.status === col).map(renderCard)}
                  {leads.filter(l => l.status === col).length === 0 && (
                     <div className="h-32 border-2 border-dashed border-[#222] rounded-2xl flex items-center justify-center text-gray-600 text-[10px] tracking-widest uppercase">
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
           <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-3xl p-8 space-y-6 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Novo Lead</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddLead} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Nome do Responsável" className="bg-black border border-[#222] p-3 rounded-xl text-sm text-white" value={newLead.nome} onChange={e => setNewLead({...newLead, nome: e.target.value})} />
                    <input placeholder="Empresa" className="bg-black border border-[#222] p-3 rounded-xl text-sm text-white" value={newLead.empresa} onChange={e => setNewLead({...newLead, empresa: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="E-mail" className="bg-black border border-[#222] p-3 rounded-xl text-sm text-white" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                    <input required placeholder="Telefone/Zap" className="bg-black border border-[#222] p-3 rounded-xl text-sm text-white" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                 </div>
                 <input placeholder="Segmento (ex: E-commerce, TI)" className="w-full bg-black border border-[#222] p-3 rounded-xl text-sm text-white" value={newLead.segment} onChange={e => setNewLead({...newLead, segment: e.target.value})} />
                 <textarea placeholder="Observações iniciais" className="w-full bg-black border border-[#222] p-3 rounded-xl text-sm text-white h-24" value={newLead.message} onChange={e => setNewLead({...newLead, message: e.target.value})} />
                 <button disabled={saving} className="w-full bg-brand-neon p-4 rounded-xl text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform disabled:opacity-50">
                    {saving ? 'Gravando...' : 'Cadastrar Lead'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
