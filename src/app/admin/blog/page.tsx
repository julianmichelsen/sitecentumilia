'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, FileText, Loader2, Check, Eye, Layout } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  content: string;
}

const emptyPostData: PostData = {
  slug: '',
  title: '',
  excerpt: '',
  date: new Date().toISOString().split('T')[0],
  coverImage: '',
  content: '',
};

function AdminBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<PostData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadPosts();
    if (searchParams.get('new') === 'true') {
      setEditing({ ...emptyPostData });
    }
  }, [searchParams]);

  async function loadPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.slug || !editing.title) {
      setMessage('Slug e título são obrigatórios');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        setMessage('Post salvo com sucesso!');
        setEditing(null);
        loadPosts();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erro ao salvar');
      }
    } catch (err) {
      setMessage('Erro de conexão');
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setEditing({ ...editing, coverImage: data.url });
        setMessage('Imagem enviada!');
      }
    } catch (err) {
      setMessage('Erro no upload');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Deseja deletar "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Deletado com sucesso');
        loadPosts();
      }
    } catch (err) { setMessage('Erro ao deletar'); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#01FAA4]/30 border-t-[#01FAA4] rounded-full animate-spin" />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Barra Superior Fixa no Post */}
        <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 bg-brand-dark/80 backdrop-blur py-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white max-w-[200px] truncate">{editing.title || 'Novo Artigo'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)} 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showPreview ? 'bg-brand-neon text-black' : 'bg-[#1a1a1a] text-gray-400 border border-[#333]'}`}>
              <Eye className="w-4 h-4" />
              {showPreview ? 'Esconder Preview' : 'Preview'}
            </button>
            {editing.slug && (
               <a href={`/blog/${editing.slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-gray-300 border border-[#333] rounded-xl text-sm font-medium">
                 <Layout className="w-4 h-4" /> Ver Site
               </a>
            )}
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#01FAA4] text-black font-bold rounded-xl disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar
            </button>
          </div>
        </div>

        {message && (
          <div className="px-4 py-3 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon rounded-xl text-sm">
            {message}
          </div>
        )}

        <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : ''} gap-8`}>
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Slug (URL)</span>
                  <input value={editing.slug} onChange={(e) => setEditing({...editing, slug: e.target.value.replace(/[^a-z0-9-]/g, '-')})} className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-brand-neon" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Título</span>
                  <input value={editing.title} onChange={(e) => setEditing({...editing, title: e.target.value})} className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-brand-neon" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Capa (URL)</span>
                <div className="flex gap-2">
                  <input value={editing.coverImage || ''} onChange={(e) => setEditing({...editing, coverImage: e.target.value})} className="flex-1 h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-brand-neon" />
                  <label className={`h-11 px-4 rounded-xl flex items-center justify-center cursor-pointer text-xs font-bold transition-all ${uploading ? 'bg-[#333] text-gray-500' : 'bg-[#222] hover:bg-[#333] text-gray-300'}`}>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {uploading ? 'Subindo...' : 'Fazer Upload'}
                  <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={handleFileUpload} />
                </label>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Resumo</span>
                <textarea value={editing.excerpt} onChange={(e) => setEditing({...editing, excerpt: e.target.value})} className="w-full h-24 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-brand-neon resize-none" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Conteúdo Markdown</span>
                <textarea value={editing.content || ''} onChange={(e) => setEditing({...editing, content: e.target.value})} className="w-full h-[500px] px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-brand-neon font-mono text-sm" />
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="bg-[#111] border border-[#222] rounded-2xl p-8 sticky top-24 overflow-y-auto max-h-[800px] custom-scrollbar">
              <h1 className="text-3xl font-bold text-white mb-6 leading-tight">{editing.title || 'Título do Post'}</h1>
              <div className="prose prose-invert prose-brand prose-lg max-w-none">
                <ReactMarkdown>{editing.content || 'Escreva o post para ver o preview aqui...'}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Administrar Blog</h1>
        <button onClick={() => setEditing({ ...emptyPostData })} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#01FAA4] text-black font-bold rounded-xl">
          <Plus className="w-4 h-4" /> Novo Artigo
        </button>
      </div>

      <div className="grid gap-3">
        {posts.map((p) => (
          <div key={p.slug} className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-center justify-between group hover:border-[#333]">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate mb-1">{p.title}</h3>
              <p className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
               <a href={`/blog/${p.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-brand-neon"><Eye className="w-4 h-4" /></a>
               <button onClick={() => setEditing(p)} className="p-2 text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
               <button onClick={() => handleDelete(p.slug)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminBlog() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Carregando painel de blog...</div>}>
      <AdminBlogContent />
    </Suspense>
  );
}
