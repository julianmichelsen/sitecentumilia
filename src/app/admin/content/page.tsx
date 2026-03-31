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
  Edit3,
  ExternalLink,
  Instagram,
  CheckCircle2,
  AlertCircle
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

const CONTENT_COLUMNS = ['Em Produção', 'Aguardando Cliente', 'Aprovado', 'Ajuste Solicitado'];

export default function ContentApprovalPage() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPost, setEditPost] = useState<ContentPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ client_id: '', title: '', media_url: '', caption: '', scheduled_at: '', status: 'Aguardando Cliente' });
  const [message, setMessage] = useState('');

  useEffect(() => {
     fetchData();
  }, []);

  async function fetchData() {
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/admin/content'), fetch('/api/admin/clients')]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setPosts(Array.isArray(pData) ? pData : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch (_) {}
    finally { setLoading(false); }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('postId', id);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const id = e.dataTransfer.getData('postId');
    const post = posts.find(p => p.id === id);
    if (post && post.status !== newStatus) {
      setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    }
  };

  async function handleSavePost(e: React.FormEvent) {
    if (e) e.preventDefault();
    const isEdit = !!editPost;
    try {
       const res = await fetch('/api/admin/content', {
         method: isEdit ? 'PATCH' : 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(isEdit ? editPost : newPost),
       });
       if (res.ok) {
         setIsModalOpen(false);
         setEditPost(null);
         fetchData();
         setMessage(isEdit ? 'Post atualizado 📤' : 'Post enviado para aprovação 🚀');
         setTimeout(() => setMessage(''), 3000);
       }
    } catch (_) {}
  }

  async function handleDelete(id: string) {
     if (!confirm('Deseja excluir esse criativo da base?')) return;
     try {
       const res = await fetch(`/api/admin/content?id=${id}`, { method: 'DELETE' });
       if (res.ok) {
          fetchData();
          setMessage('Criativo removido ✅');
          setTimeout(() => setMessage(''), 3000);
       }
     } catch (_) {}
  }

  const copyLink = (link: string) => {
    const url = `${window.location.origin}/p/${link}`;
    navigator.clipboard.writeText(url);
    setMessage('Link do WhatsApp Gerado! 📤');
    setTimeout(() => setMessage(''), 3000);
  };

  const renderPostCard = (post: ContentPost) => (
    <div key={post.id} 
      draggable 
      onDragStart={(e) => handleDragStart(e, post.id)}
      className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-cyan/40 transition-all cursor-move group mb-4 shadow-xl"
    >
       <div className="aspect-square relative w-full bg-brand-dark">
          <img src={post.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => { setEditPost(post); setIsModalOpen(true); }} className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black transition-all">
                <Edit3 className="w-4 h-4" />
             </button>
             <button onClick={() => handleDelete(post.id)} className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all">
                <Trash2 className="w-4 h-4" />
             </button>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
             <button onClick={() => copyLink(post.magic_link)} className="px-3 h-8 bg-black/60 backdrop-blur-md rounded-xl flex items-center gap-2 text-[10px] font-black uppercase text-white hover:bg-brand-neon hover:text-black transition-all">
                <Copy className="w-3.5 h-3.5" /> LINK WHATS
             </button>
          </div>
       </div>
       <div className="p-5 space-y-2">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">
             {clients.find(c => c.id === post.client_id)?.name || 'Cliente'}
          </p>
          <h4 className="text-white font-bold text-[13px] leading-snug line-clamp-1">{post.title}</h4>
          <div className="flex items-center gap-3 pt-3 text-[10px] text-gray-600 font-black uppercase tracking-widest">
             <Instagram className="w-3.5 h-3.5 text-brand-cyan" /> FEED INSTAGRAM
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2 italic">
             Aprovação Centum
          </h1>
          <p className="text-gray-500 text-sm">Arraste os criativos ou gerencie links mágicos.</p>
        </div>
        <button onClick={() => { setEditPost(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-brand-cyan/20">
          <Plus className="w-4 h-4" /> Novo Criativo
        </button>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-cyan text-black font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[80vh]">
          {CONTENT_COLUMNS.map(col => (
             <div key={col} 
               onDragOver={(e) => e.preventDefault()} 
               onDrop={(e) => handleDrop(e, col)}
               className="w-[300px] shrink-0 space-y-4"
             >
                <div className="flex items-center justify-between px-2 mb-2">
                   <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">{col}</h3>
                   <span className="text-[9px] font-bold text-gray-600 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/5">
                      {posts.filter(p => p.status === col).length}
                   </span>
                </div>
                <div className="space-y-4 min-h-[550px] bg-black/10 rounded-[2.5rem] p-3 border border-white/5">
                   {posts.filter(p => p.status === col).map(renderPostCard)}
                   {posts.filter(p => p.status === col).length === 0 && (
                     <div className="h-32 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">Vazio</div>
                   )}
                </div>
             </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
           <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-300 shadow-2xl relative shadow-brand-cyan/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                       {editPost ? 'Refinar Criativo' : 'Subir Criativo'}
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Alta Performance Visual</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSavePost} className="space-y-6">
                 <select required className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-cyan outline-none transition-all" value={editPost ? editPost.client_id : newPost.client_id} onChange={e => editPost ? setEditPost({...editPost, client_id: e.target.value}) : setNewPost({...newPost, client_id: e.target.value})}>
                    <option value="">Selecione o Cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
                 <input required placeholder="Título interno" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-cyan outline-none" value={editPost ? editPost.title : newPost.title} onChange={e => editPost ? setEditPost({...editPost, title: e.target.value}) : setNewPost({...newPost, title: e.target.value})} />
                 <input required placeholder="URL da Mídia (Bucket Supabase)" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-cyan outline-none" value={editPost ? editPost.media_url : newPost.media_url} onChange={e => editPost ? setEditPost({...editPost, media_url: e.target.value}) : setNewPost({...newPost, media_url: e.target.value})} />
                 <textarea placeholder="Texto da Legenda" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white h-24 rounded-2xl resize-none outline-none" value={editPost ? editPost.caption : newPost.caption} onChange={e => editPost ? setEditPost({...editPost, caption: e.target.value}) : setNewPost({...newPost, caption: e.target.value})} />
                 <button className="w-full bg-brand-cyan p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-cyan/30">
                    {editPost ? 'Atualizar Criativo' : 'Gerar Link de Aprovação'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
