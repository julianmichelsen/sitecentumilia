'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Send, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Loader2,
  Calendar,
  Eye,
  Copy,
  X,
  Upload
} from 'lucide-react';

interface ContentPost {
  id: string;
  client_id: string;
  title: string;
  media_url: string;
  caption: string;
  scheduled_at: string;
  status: string;
  magic_link: string;
}

interface Client {
  id: string;
  name: string;
}

export default function ContentApprovalPage() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPost, setNewPost] = useState({ client_id: '', title: '', media_url: '', caption: '', scheduled_at: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/content'),
        fetch('/api/admin/clients')
      ]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setPosts(Array.isArray(pData) ? pData : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleAddPost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewPost({ client_id: '', title: '', media_url: '', caption: '', scheduled_at: '' });
        fetchData();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  const copyLink = (id: string) => {
    // Pegar o ID do magic link
    const url = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(url);
    setMessage('Link do WhatsApp copiado!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Aprovado': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Ajuste Solicitado': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2">
             <Send className="w-8 h-8 text-brand-cyan" /> Pode Postar: Aprovação
          </h1>
          <p className="text-gray-500 text-sm">Gerencie o fluxo de aprovação com seus clientes</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-black font-black rounded-xl text-sm hover:shadow-[0_0_20px_rgba(0,222,254,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Novo Conteúdo
        </button>
      </div>

      {message && <div className="px-5 py-3 bg-brand-neon/10 border border-brand-neon/20 text-brand-neon rounded-xl text-sm animate-pulse">{message}</div>}

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-cyan animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {posts.map(post => {
            const clientName = clients.find(c => c.id === post.client_id)?.name || 'Cliente';
            return (
              <div key={post.id} className="bg-[#111] border border-[#222] rounded-3xl p-6 flex gap-6 hover:border-brand-cyan/30 transition-all group relative overflow-hidden">
                <div className="w-32 h-44 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0 border border-[#222] relative">
                   <img src={post.media_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 px-3">
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest line-clamp-1">{clientName.split(' ')[0]}</span>
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                   <div>
                      <h3 className="text-white font-bold leading-none mb-2">{post.title}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(post.status)}`}>
                         {post.status}
                      </span>
                   </div>

                   <div className="space-y-1.5 opacity-60">
                      <p className="text-gray-400 text-[11px] line-clamp-2 italic leading-relaxed">"{post.caption}"</p>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
                         <Calendar className="w-3 h-3" /> 
                         {new Date(post.scheduled_at).toLocaleDateString('pt-BR')} - {new Date(post.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                   </div>

                   <div className="flex items-center gap-2 pt-2">
                      <button onClick={() => copyLink(post.magic_link)} className="flex items-center gap-2 px-3 py-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-cyan hover:bg-brand-cyan hover:text-black transition-all">
                         <Copy className="w-3.5 h-3.5" /> Copiar Link
                      </button>
                      <a href={`/p/${post.magic_link}`} target="_blank" className="p-2 text-gray-500 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all border border-[#222] hover:border-brand-cyan/20">
                         <Eye className="w-5 h-5" />
                      </a>
                   </div>
                </div>
              </div>
            );
          })}

          {posts.length === 0 && (
            <div className="col-span-2 h-64 border-2 border-dashed border-[#222] rounded-3xl flex flex-col items-center justify-center text-gray-600 gap-3">
               <ImageIcon className="w-10 h-10 opacity-20" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Nenhum post em aprovação</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Novo Post */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-3xl p-8 space-y-6 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Novo Criativo</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddPost} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cliente</label>
                    <select required className="w-full bg-black border border-[#222] p-4 rounded-xl text-sm text-white" value={newPost.client_id} onChange={e => setNewPost({...newPost, client_id: e.target.value})}>
                       <option value="">Selecione o Cliente</option>
                       {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Título do Post</label>
                    <input required className="w-full bg-black border border-[#222] p-4 rounded-xl text-sm text-white" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL da Imagem/Vídeo</label>
                    <input required className="w-full bg-black border border-[#222] p-4 rounded-xl text-sm text-white" value={newPost.media_url} onChange={e => setNewPost({...newPost, media_url: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Legenda</label>
                    <textarea className="w-full bg-black border border-[#222] p-4 rounded-xl text-sm text-white h-24" value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} />
                 </div>
                 <button disabled={saving} className="w-full bg-brand-cyan p-4 rounded-xl text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-brand-cyan/20">
                    {saving ? 'Criando link mágico...' : 'Enviar para Aprovação'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
