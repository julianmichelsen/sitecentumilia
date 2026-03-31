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
  const [saving, setSaving] = useState(false);
  const [newPost, setNewPost] = useState({ client_id: '', title: '', media_url: '', caption: '', scheduled_at: '' });
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
    } catch (_) {} finally { setLoading(false); }
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
    e.preventDefault();
    setSaving(true);
    const isEdit = !!editPost;
    const res = await fetch('/api/admin/content', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? editPost : newPost),
    });
    if (res.ok) {
       setIsModalOpen(false);
       setEditPost(null);
       fetchData();
    }
    setSaving(false);
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
      className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-cyan/40 transition-all cursor-move group mb-4 shadow-xl"
    >
       <div className="aspect-square relative w-full bg-brand-dark">
          <img src={post.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-2 right-2 flex gap-1">
             <button onClick={() => { setEditPost(post); setIsModalOpen(true); }} className="w-7 h-7 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black transition-all">
                <Edit3 className="w-3.5 h-3.5" />
             </button>
             <button onClick={() => copyLink(post.magic_link)} className="w-7 h-7 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-brand-neon hover:text-black transition-all">
                <Copy className="w-3.5 h-3.5" />
             </button>
          </div>
       </div>
       <div className="p-4 space-y-2">
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-[0.2em]">
             {clients.find(c => c.id === post.client_id)?.name || 'Cliente'}
          </p>
          <h4 className="text-white font-bold text-[11px] leading-snug line-clamp-2">{post.title}</h4>
          <div className="flex items-center gap-2 pt-2 text-[9px] text-gray-600 font-bold">
             <Instagram className="w-3 h-3" /> Instagram Feed
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-2 italic">
             <Instagram className="w-8 h-8 text-brand-cyan" /> Pode Postar?
          </h1>
          <p className="text-gray-500 text-sm">Gestão de Criativos & Aprovação Centumilia</p>
        </div>
        <button onClick={() => { setEditPost(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-brand-cyan/20">
          <Plus className="w-4 h-4" /> Novo Criativo
        </button>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-neon text-black font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-cyan animate-spin" /></div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[80vh]">
          {CONTENT_COLUMNS.map(col => (
             <div key={col} 
               onDragOver={(e) => e.preventDefault()} 
               onDrop={(e) => handleDrop(e, col)}
               className="w-[280px] shrink-0 space-y-4"
             >
                <div className="flex items-center justify-between px-2 mb-2">
                   <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col === 'Aprovado' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-brand-cyan shadow-[0_0_10px_rgba(0,222,254,0.5)]'}`}></div>
                      {col}
                   </h3>
                   <span className="text-[9px] font-bold text-gray-600 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/5">
                      {posts.filter(p => p.status === col).length}
                   </span>
                </div>
                <div className="space-y-4 min-h-[550px] bg-[#0a0a0a] rounded-[2.5rem] p-3 border border-white/5 scroll-py-4">
                   {posts.filter(p => p.status === col).map(renderPostCard)}
                </div>
             </div>
          ))}
        </div>
      )}

      {/* Modal Novo/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
           <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[3rem] p-10 space-y-8 animate-in zoom-in duration-300 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                       {editPost ? 'Refinar Post' : 'Subir Criativo'}
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Conectando Ideias ao Cliente</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSavePost} className="space-y-6">
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Para qual Cliente?</label>
                       <select required className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-cyan transition-all outline-none" value={editPost ? editPost.client_id : newPost.client_id} onChange={e => editPost ? setEditPost({...editPost, client_id: e.target.value}) : setNewPost({...newPost, client_id: e.target.value})}>
                          <option value="">Escolher Cliente Ativo</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Nome do Criativo</label>
                       <input required placeholder="Ex: Campanha Abril - Reel 01" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-cyan transition-all outline-none" value={editPost ? editPost.title : newPost.title} onChange={e => editPost ? setEditPost({...editPost, title: e.target.value}) : setNewPost({...newPost, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Link da Mídia (URL)</label>
                       <input required placeholder="Cole a URL da Imagem/Vídeo" className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white focus:border-brand-cyan transition-all outline-none" value={editPost ? editPost.media_url : newPost.media_url} onChange={e => editPost ? setEditPost({...editPost, media_url: e.target.value}) : setNewPost({...newPost, media_url: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Legenda Final</label>
                       <textarea className="w-full bg-black border border-white/5 p-4 rounded-2xl text-sm text-white h-24 focus:border-brand-cyan transition-all outline-none resize-none" value={editPost ? editPost.caption : newPost.caption} onChange={e => editPost ? setEditPost({...editPost, caption: e.target.value}) : setNewPost({...newPost, caption: e.target.value})} />
                    </div>
                 </div>
                 <button className="w-full bg-brand-cyan p-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,222,254,0.3)]">
                    {editPost ? 'Atualizar e Notificar' : 'Subir e Gerar Link de Venda'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
