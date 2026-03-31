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
  Gem,
  UploadCloud,
  ImageIcon
} from 'lucide-react';
import { uploadMedia } from '@/lib/storage';

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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadMedia(file, 'media');
      setNewClient({ ...newClient, logo_url: url });
      setMessage('Logo Enviado! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Falha no upload ❌');
    } finally {
      setUploading(false);
    }
  };

  async function handleAddClient(e: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newClient) });
      if (res.ok) {
        setIsModalOpen(false);
        setNewClient({ name: '', company: '', logo_url: '', status: 'Ativo' });
        fetchClients();
        setMessage('Novo Parceiro Integrado! 🚀');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (_) {}
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esse parceiro estratégico definitivamente?')) return;
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
    } catch (_) {}
  }

  return (
    <div className="space-y-14 animate-in fade-in duration-[1500ms] pb-24 relative">
      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-purple text-white font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

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
                    <div className="flex-1 min-w-0">
                       <h3 className="text-xl font-black italic tracking-tight text-white uppercase leading-none truncate">{client.name}</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mt-2 truncate">{client.company || 'Corporate'}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 mb-10 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.3em]">Cadastro</p>
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
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-darker/95 backdrop-blur-2xl p-6">
           <div className="w-full max-w-xl rounded-[4rem] border border-white/10 bg-[#0a0a0a] p-12 space-y-10 animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden shadow-brand-purple/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-blue"></div>
              <div className={uploading ? "opacity-30 pointer-events-none" : ""}>
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Novo Parceiro</h2>
                    <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 text-gray-500"><X className="w-6 h-6" /></button>
                 </div>
                 <form onSubmit={handleAddClient} className="space-y-6">
                    {/* NOVO: Upload Real de Logo */}
                    <div className="relative group/logo h-32 w-32 mx-auto rounded-[2rem] border-2 border-dashed border-white/10 hover:border-brand-purple/40 transition-all flex flex-col items-center justify-center gap-2 bg-white/[0.01] overflow-hidden mb-8">
                       {newClient.logo_url ? (
                         <>
                           <img src={newClient.logo_url} className="absolute inset-0 w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-[8px] font-black uppercase tracking-widest text-white">Trocar Logo</p>
                              <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                         </>
                       ) : (
                         <>
                           {uploading ? (
                             <Loader2 className="w-6 h-6 text-brand-purple animate-spin" />
                           ) : (
                             <>
                               <UploadCloud className="w-6 h-6 text-gray-700 group-hover/logo:text-brand-purple transition-all" />
                               <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest text-center px-4">Subir Logo</span>
                               <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                             </>
                           )}
                         </>
                       )}
                    </div>

                    <input placeholder="Responsável Centumilia" required className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-purple outline-none text-white transition-all underline-none" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                    <input placeholder="Razão Social / Empresa" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-purple outline-none text-white transition-all underline-none" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
                    
                    <button disabled={saving || uploading} className="w-full btn-elite-neon bg-brand-purple shadow-brand-purple/20 scale-y-110 disabled:opacity-30">
                       {saving ? 'Sincronizando...' : 'Integrar Parceiro Elite'}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
