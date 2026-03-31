'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  ArrowRight,
  TrendingUp,
  MessageSquare
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

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads'); // Vou criar essa API em seguida
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(true); } // Simulação por enquanto
  }

  // Kanban Drag and Drop Logic (Resumida para MVP rápido)
  const renderCard = (l: Lead) => (
    <div key={l.id} className="bg-[#1a1a1a] border border-[#222] p-4 rounded-xl shadow-lg hover:border-brand-neon/30 transition-all cursor-grab active:cursor-grabbing group">
       <div className="flex items-center justify-between mb-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
         <span>{l.segment || 'Geral'}</span>
         <MoreVertical className="w-3 h-3 group-hover:text-white" />
       </div>
       <h4 className="text-white font-bold text-sm mb-1">{l.nome}</h4>
       <p className="text-gray-500 text-xs mb-3 italic">{l.empresa || 'Empresa não informada'}</p>
       
       <div className="space-y-2 mb-4">
         <div className="flex items-center gap-2 text-xs text-gray-400">
           <Phone className="w-3 h-3 text-brand-neon" /> {l.phone}
         </div>
         <div className="flex items-center gap-2 text-xs text-gray-400">
           <Mail className="w-3 h-3 text-brand-cyan" /> {l.email}
         </div>
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
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input placeholder="Buscar lead..." className="pl-9 pr-4 py-2 bg-[#111] border border-[#222] rounded-xl text-sm text-white focus:outline-none focus:border-brand-neon w-full sm:w-64" />
           </div>
           <button className="p-2 bg-[#111] border border-[#222] rounded-xl text-gray-400 hover:text-white">
             <Filter className="w-5 h-5" />
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:shadow-[0_0_20px_rgba(1,250,164,0.3)] transition-all">
             <Plus className="w-4 h-4" /> Novo Lead
           </button>
        </div>
      </div>

      {/* Kanban Board */}
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
                <MoreVertical className="w-4 h-4 text-gray-600" />
             </div>

             <div className="space-y-4">
                {leads.filter(l => l.status === col).map(renderCard)}
                {leads.filter(l => l.status === col).length === 0 && (
                   <div className="h-32 border-2 border-dashed border-[#222] rounded-2xl flex items-center justify-center text-gray-600 text-xs">
                     Nenhum lead aqui
                   </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
