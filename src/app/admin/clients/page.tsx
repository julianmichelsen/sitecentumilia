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
  CheckCircle2
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewClient({ name: '', company: '', logo_url: '', status: 'Ativo' });
        fetchClients();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Putz, tem certeza? Isso vai remover esse cliente e todo o histórico dele da Centumilia.')) return;
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
    } catch (err) { console.error(err); }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2">
             <Users className="w-8 h-8 text-brand-neon" /> Clientes Ativos
          </h1>
          <p className="text-gray-500 text-sm">Controle de contratos e parceiros da Centumilia</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-neon text-black font-black rounded-xl text-sm hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-neon animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {clients.map(client => (
              <div key={client.id} className="bg-[#111] border border-[#222] rounded-3xl p-6 hover:border-brand-neon/30 transition-all group relative overflow-hidden active:scale-[0.98]">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-brand-neon/5 blur-3xl rounded-full"></div>
                 
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-dark border border-[#222] flex items-center justify-center text-xl font-black text-gray-500 overflow-hidden">
                       {client.logo_url ? <img src={client.logo_url} className="w-full h-full object-cover" /> : client.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-white font-bold tracking-tight">{client.name}</h3>
                       <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">{client.company || 'Empresa'}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 border-t border-[#222] pt-6 mb-6">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest pl-1">Desde</p>
                       <p className="text-white text-sm font-medium pl-1">{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Contrato</p>
                       <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded border border-green-500/20 w-fit">{client.status}</span>
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-brand-neon transition-all">Configurar</button>
                    <button onClick={() => handleDelete(client.id)} className="p-2 bg-[#1a1a1a] border border-[#222] rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                       <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </button>
                 </div>
              </div>
           ))}

           {clients.length === 0 && (
              <div className="col-span-full h-64 border-2 border-dashed border-[#222] rounded-3xl flex flex-col items-center justify-center text-gray-600 gap-4">
                 <Briefcase className="w-12 h-12 opacity-20" />
                 <p className="text-sm font-bold uppercase tracking-widest opacity-50">Nenhum cliente cadastrado ainda</p>
              </div>
           )}
        </div>
      )}

      {/* Modal Novo Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Novo Cliente</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddClient} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Nome do Responsável</label>
                    <input required className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Nome da Empresa</label>
                    <input className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">URL do Logo (Opcional)</label>
                    <input className="w-full bg-black border border-[#222] p-4 rounded-2xl text-sm text-white focus:border-brand-neon outline-none" value={newClient.logo_url} onChange={e => setNewClient({...newClient, logo_url: e.target.value})} />
                 </div>
                 <button disabled={saving} className="w-full bg-brand-neon p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-neon/20">
                    {saving ? 'Cadastrando...' : 'Finalizar Cadastro'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
