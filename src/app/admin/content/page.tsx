'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Send, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  ExternalLink, 
  Trash2, 
  Loader2,
  Calendar,
  Eye,
  Copy
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

export default function ContentApprovalPage() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const examplePosts: ContentPost[] = [
    {
      id: '1',
      client_id: '1',
      title: 'Reels - Por que importar demora?',
      media_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600',
      caption: 'Você sabia que o porto de Xangai... #importação #comercioexterior',
      scheduled_at: '2026-04-10T10:00:00',
      status: 'Em Análise',
      magic_link: 'magic-link-123'
    },
    {
      id: '2',
      client_id: '1',
      title: 'Post Estático - 3 Passos para Exportar',
      media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
      caption: '🚀 Quer levar seu produto para o mundo? Confira esses 3 passos essenciais.',
      scheduled_at: '2026-04-12T18:00:00',
      status: 'Aprovado',
      magic_link: 'magic-link-456'
    }
  ];

  useEffect(() => {
    setPosts(examplePosts);
    setLoading(false);
  }, []);

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`https://sitecentumilia.vercel.app/p/${id}`);
    setMessage('Link copiado para o WhatsApp!');
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
             <FileCheck className="w-8 h-8 text-brand-cyan" /> Pode Postar: Aprovação
          </h1>
          <p className="text-gray-500 text-sm">Controle de aprovação de criativos e legendas</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-black font-black rounded-xl text-sm hover:shadow-[0_0_20px_rgba(0,222,254,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Novo Conteúdo
        </button>
      </div>

      {message && <div className="px-5 py-3 bg-brand-neon/10 border border-brand-neon/20 text-brand-neon rounded-xl text-sm animate-pulse">{message}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-[#111] border border-[#222] rounded-2xl p-6 flex gap-6 hover:border-brand-cyan/30 transition-all group relative overflow-hidden">
             {/* Preview Image */}
             <div className="w-32 h-44 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0 border border-[#222] relative">
                <img src={post.media_url} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                   <span className="text-[9px] font-bold text-brand-cyan uppercase tracking-widest">{post.status}</span>
                </div>
             </div>

             {/* Post details */}
             <div className="flex-1 space-y-4">
                <div>
                   <h3 className="text-white font-bold leading-none mb-2">{post.title}</h3>
                   <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(post.status)}`}>
                      {post.status}
                   </span>
                </div>

                <div className="space-y-1.5">
                   <p className="text-gray-500 text-[11px] line-clamp-2 italic leading-relaxed">"{post.caption}"</p>
                   <div className="flex items-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(post.scheduled_at).toLocaleDateString('pt-BR')} - {new Date(post.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                   </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                   <button onClick={() => copyLink(post.magic_link)} className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-[11px] font-bold text-gray-400 hover:text-brand-neon hover:border-brand-neon/40 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copiar Link WhatsApp
                   </button>
                   <a href={`/p/${post.magic_link}`} target="_blank" className="p-2 text-gray-500 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all">
                      <Eye className="w-5 h-5" />
                   </a>
                   <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all ml-auto">
                      <Trash2 className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-2 h-64 border-2 border-dashed border-[#222] rounded-3xl flex flex-col items-center justify-center text-gray-600 space-y-4">
             <ImageIcon className="w-12 h-12 opacity-20" />
             <p className="text-sm font-bold uppercase tracking-widest opacity-50">Nenhum post em aprovação</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { FileCheck } from 'lucide-react';
