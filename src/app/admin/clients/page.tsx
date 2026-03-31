'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  MoreVertical, 
  Trash2, 
  Calendar, 
  ExternalLink,
  Briefcase,
  X,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Gem
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  company: string;
  logo_url: string;
  status: string;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', company: '', logo_url: '', status: 'Ativo' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (_) {}
    finally { setLoading(false); }
  }

  async function handleAddClient(e: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newClient) });
      if (res.ok) {
        setIsModalOpen(false);
        setNewClient({ name: '', company: '', logo_url: '', status: 'Ativo' });
        fetchClients();
      }
    } catch (_) {}
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esse parceiro estratégico?')) return;
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
    } catch (_) {}
  }

  return (
    <div className="space-y-14 animate-in fade-in duration-[1500ms] pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <div className="flex items-center gap-3 bg-brand-purple/5 w-fit px-4 py-2 rounded-full border border-brand-purple/20">
               <Gem className="w-4 h-4 text-brand-purple" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-purple">Parceiros Elite.</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">Base de <br/><span className="text-brand-purple">Clientes</span> Centumilia.</h1>
         </div>
         <button onClick={() => setIsModalOpen(true)} className="btn-elite-neon bg-brand-purple shadow-brand-purple/20">
            <Plus className="w-4 h-4 inline mr-2" /> Novo Parceiro
         </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-purple animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
           {clients.map(client => (
              <div key={client.id} className="glass-card p-10 rounded-[3.5rem] hover:border-brand-purple/30 transition-all duration-500 group relative overflow-hidden active:scale-[0.98]">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-[80px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-brand-purple/10 transition-colors"></div>
                 
                 <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center text-2xl font-black text-gray-700 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
                       {client.logo_url ? <img src={client.logo_url} className="w-full h-full object-cover" /> : <Building2 className="w-8 h-8 opacity-20" />}
                    </div>
                    <div>
                       <h3 className="text-xl font-black italic tracking-tight text-white uppercase leading-none">{client.name}</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mt-2">{client.company || 'Corporate'}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 mb-10 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.3em]">Data Base</p>
                       <p className="text-white text-xs font-bold uppercase">{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.3em]">Status</p>
                       <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> {client.status}
                       </span>
                    </div>
                 </div>

                 <div className="flex gap-3 relative z-10">
                    <button className="flex-1 btn-elite-outline py-2.5">Dossiê</button>
                    <button onClick={() => handleDelete(client.id)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5">
                       <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           ))}

           {clients.length === 0 && (
              <div className="col-span-full h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-gray-700 gap-4 opacity-50">
                 <Briefcase className="w-12 h-12 opacity-10" />
                 <p className="text-[10px] font-black uppercase tracking-[0.5em]">Base Estratégica Vazia</p>
              </div>
           )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-darker/95 backdrop-blur-2xl p-6">
           <div className="w-full max-w-xl rounded-[4rem] border border-white/10 bg-[#0a0a0a] p-12 space-y-10 animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden shadow-brand-purple/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-blue"></div>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Novo Parceiro</h2>
                 <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddClient} className="space-y-6">
                 <input placeholder="Responsável Centumilia" required className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-purple outline-none text-white transition-all" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                 <input placeholder="Razão Social / Nome Fantasia" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-purple outline-none text-white transition-all" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
                 <input placeholder="URL da Identidade Visual" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-purple outline-none text-white transition-all" value={newClient.logo_url} onChange={e => setNewClient({...newClient, logo_url: e.target.value})} />
                 <button disabled={saving} className="w-full btn-elite-neon bg-brand-purple shadow-brand-purple/20 scale-y-110">
                    {saving ? 'Validando...' : 'Integrar Parceiro Elite'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
