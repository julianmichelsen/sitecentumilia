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
  AlertCircle,
  Gem,
  UploadCloud
} from 'lucide-react';
import { uploadMedia } from '@/lib/storage';

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
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/admin/content'), fetch('/api/admin/clients')]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setPosts(Array.isArray(pData) ? pData : []);
      setClients(Array.isArray(cData) ? cData : []);
    } catch (_) {}
    finally { setLoading(false); }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadMedia(file, 'media');
      if (editPost) {
        setEditPost({ ...editPost, media_url: url });
      } else {
        setNewPost({ ...newPost, media_url: url });
      }
      setMessage('Upload Concluído! 📁✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Falha no upload ❌');
    } finally {
      setUploading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('postId', id); };
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const id = e.dataTransfer.getData('postId');
    const post = posts.find(p => p.id === id);
    if (post && post.status !== newStatus) {
      setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
      await fetch('/api/admin/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
    }
  };

  async function handleSavePost(e: React.FormEvent) {
    if (e) e.preventDefault();
    const isEdit = !!editPost;
    try {
      const res = await fetch('/api/admin/content', { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(isEdit ? editPost : newPost) });
      if (res.ok) {
        setIsModalOpen(false);
        setEditPost(null);
        fetchData();
        setMessage('Sincronização Ativa! 🛰️');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (_) {}
  }

  async function handleDelete(id: string) {
     if (!confirm('Deseja excluir esse criativo permanentemente?')) return;
     try {
       const res = await fetch(`/api/admin/content?id=${id}`, { method: 'DELETE' });
       if (res.ok) fetchData();
     } catch (_) {}
  }

  const generateMagicLink = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  };

  const ensureMagicLink = async (post: ContentPost) => {
    if (post.magic_link) return post.magic_link;

    const generated = generateMagicLink();
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, magic_link: generated }),
    });

    if (!res.ok) {
      throw new Error('Falha ao gerar link');
    }

    setPosts((current) => current.map((item) => (item.id === post.id ? { ...item, magic_link: generated } : item)));
    return generated;
  };

  const copyLink = async (post: ContentPost) => {
    try {
      const link = await ensureMagicLink(post);
      const url = `${window.location.origin}/p/${link}`;
      await navigator.clipboard.writeText(url);
      setMessage('Link de Aprovação Copiado! 📤');
    } catch (_) {
      setMessage('Não foi possível copiar o link ❌');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-[1500ms] pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-4">
            <div className="flex items-center gap-3 bg-brand-cyan/5 w-fit px-4 py-2 rounded-full border border-brand-cyan/20">
               <Gem className="w-4 h-4 text-brand-cyan" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-cyan">Sincronização Global.</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase">Pode <br/><span className="text-brand-cyan">Postar?</span> Centumilia.</h1>
         </div>
         <button onClick={() => { setEditPost(null); setIsModalOpen(true); }} className="btn-elite-neon bg-brand-cyan shadow-brand-cyan/20">
            <Plus className="w-4 h-4 inline mr-2" /> Subir Criativo
         </button>
      </div>

      {message && <div className="fixed top-24 right-8 z-[100] px-6 py-3 bg-brand-cyan text-black font-black rounded-full shadow-2xl animate-in slide-in-from-right-4">{message}</div>}

      <div className="flex gap-10 overflow-x-auto pb-12 custom-scrollbar min-h-[80vh]">
          {CONTENT_COLUMNS.map(col => (
             <div key={col} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, col)} className="w-[320px] shrink-0 space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="text-[11px] font-black uppercase text-white tracking-[0.3em]">{col}</h3>
                   <span className="text-[10px] font-black text-gray-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      {posts.filter(p => p.status === col).length}
                   </span>
                </div>
                <div className="min-h-[600px] rounded-[3.5rem] bg-white/[0.01] p-4 border border-white/[0.03]">
                   {posts.filter(p => p.status === col).map(post => (
                     <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post.id)} className="glass-card mb-6 rounded-[2.5rem] overflow-hidden hover:border-brand-cyan/40 transition-all duration-700 cursor-move group relative shadow-2xl active:scale-95">
                        <div className="aspect-[4/5] relative w-full overflow-hidden bg-brand-dark">
                           <img src={post.media_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditPost(post); setIsModalOpen(true); }} className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black transition-all">
                                 <Edit3 className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="absolute bottom-5 left-5 right-5">
                               <button onClick={() => copyLink(post)} className="w-full btn-elite-outline glass-card py-2.5 flex items-center justify-center gap-3 backdrop-blur-3xl group-hover:bg-brand-neon group-hover:text-black group-hover:border-transparent transition-all">
                                  <Copy className="w-3.5 h-3.5" /> LINK APROVAÇÃO
                               </button>
                           </div>
                        </div>
                        <div className="p-6 space-y-2">
                           <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest italic">{clients.find(c => c.id === post.client_id)?.name || 'Cliente'}</p>
                           <h4 className="text-[14px] font-black italic tracking-tighter text-white uppercase leading-tight line-clamp-1">{post.title}</h4>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-darker/95 backdrop-blur-2xl p-6">
           <div className="w-full max-w-xl rounded-[4rem] border border-white/10 bg-[#0a0a0a] p-12 space-y-10 animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden shadow-brand-cyan/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan to-brand-blue"></div>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Lançar Criativo</h2>
                 <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 text-gray-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSavePost} className="space-y-6">
                 <select required className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm text-white focus:border-brand-cyan outline-none transition-all" value={editPost ? editPost.client_id : newPost.client_id} onChange={e => editPost ? setEditPost({...editPost, client_id: e.target.value}) : setNewPost({...newPost, client_id: e.target.value})}>
                    <option value="">Selecione o Cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
                 <input required placeholder="Título estratégico" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm focus:border-brand-cyan outline-none text-white transition-all" value={editPost ? editPost.title : newPost.title} onChange={e => editPost ? setEditPost({...editPost, title: e.target.value}) : setNewPost({...newPost, title: e.target.value})} />
                 
                 {/* NOVO: Campo de Upload Real */}
                 <div className="relative group/upload h-48 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-brand-cyan/40 transition-all flex flex-col items-center justify-center gap-4 bg-white/[0.01] overflow-hidden">
                    {(editPost?.media_url || newPost.media_url) ? (
                      <>
                        <img src={editPost ? editPost.media_url : newPost.media_url} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                        <div className="relative z-10 flex flex-col items-center">
                           <CheckCircle2 className="w-8 h-8 text-brand-neon mb-2" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-white">Criativo Carregado</p>
                           <button type="button" onClick={() => editPost ? setEditPost({...editPost, media_url: ''}) : setNewPost({...newPost, media_url: ''})} className="mt-2 text-[8px] font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors">Trocar Mídia</button>
                        </div>
                      </>
                    ) : (
                      <>
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                             <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
                             <p className="text-[9px] font-black uppercase tracking-widest text-brand-cyan">Sincronizando Arquivo...</p>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-gray-700 group-hover/upload:text-brand-cyan group-hover/upload:scale-110 transition-all duration-500" />
                            <div className="text-center">
                               <p className="text-[10px] font-black text-white uppercase tracking-widest">Clique para subir a mídia</p>
                               <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">Imagens ou Vídeos suportados</p>
                            </div>
                            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </>
                        )}
                      </>
                    )}
                 </div>

                 <textarea placeholder="Copywriting estratégico" className="w-full bg-white/5 border border-white/5 p-6 rounded-[2.5rem] text-sm focus:border-brand-cyan outline-none text-white h-24 resize-none" value={editPost ? editPost.caption : newPost.caption} onChange={e => editPost ? setEditPost({...editPost, caption: e.target.value}) : setNewPost({...newPost, caption: e.target.value})} />
                 <button disabled={uploading || (!editPost?.media_url && !newPost.media_url)} className="w-full btn-elite-neon bg-brand-cyan shadow-brand-cyan/20 scale-y-110 disabled:opacity-30 disabled:hover:scale-100">
                    {editPost ? 'Refinar Entrega' : 'Sincronizar com Cliente'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
