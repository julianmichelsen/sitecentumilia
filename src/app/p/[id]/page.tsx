'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  media_url: string;
  caption: string;
  status: string;
  scheduled_at: string;
}

export default function ClientApprovalPortal({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchPost();
  }, []);

  async function fetchPost() {
    try {
      // Como o ID da URL é o magic_link, vamos buscar por ele
      const res = await fetch(`/api/admin/content?magic_link=${params.id}`);
      const data = await res.json();
      
      // Se a listagem retornar array, pegamos o post com esse magic_link
      if (Array.isArray(data)) {
        const found = data.find(p => p.magic_link === params.id);
        setPost(found || null);
        setStatus(found?.status || '');
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleApprove() {
    await updateStatus('Aprovado');
    alert('Conteúdo APROVADO! ✅ Nossa equipe já foi notificada.');
  }

  async function handleDecline() {
    if (!feedback) return alert('Por favor, descreva o ajuste.');
    await updateStatus('Ajuste Solicitado', feedback);
    setShowFeedbackModal(false);
    alert('Solicitação de ajuste enviada! 🚀');
  }

  async function updateStatus(newStatus: string, fb: string = '') {
    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magic_link: params.id, status: newStatus, feedback: fb }),
      });
      fetchPost();
    } catch (err) { console.error(err); }
  }

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-neon animate-spin" /></div>;
  if (!post) return <div className="h-screen bg-black flex items-center justify-center text-gray-500">Post não encontrado ou link expirado.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-start pb-32">
      {/* Header Mobile */}
      <header className="w-full h-16 bg-black border-b border-[#111] flex items-center justify-between px-6 sticky top-0 z-40">
         <div className="text-xl font-black text-white/50 tracking-tighter uppercase italic">Centumilia</div>
         <div className="flex items-center gap-2 text-[8px] font-black uppercase text-brand-neon bg-brand-neon/10 px-2 py-1 rounded border border-brand-neon/20 tracking-[0.2em]">
            <ShieldCheck className="w-3 h-3" /> Link Privado
         </div>
      </header>

      <main className="w-full max-w-sm px-4 pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="text-center space-y-2">
            <h1 className="text-lg font-black font-syne text-white uppercase tracking-tighter">Pode Postar?</h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Confirmação de conteúdo estratégico</p>
         </div>

         {/* Instagram Mockup */}
         <div className="bg-[#0a0a0a] border border-[#222] rounded-[2rem] overflow-hidden shadow-2xl relative">
            <div className="flex items-center gap-3 p-4 border-b border-[#111]">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-neon to-brand-cyan p-[1.5px]">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-black">C</div>
               </div>
               <div className="flex-1">
                  <p className="text-[11px] font-bold text-white leading-none">@centumilia</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Patrocinado</p>
               </div>
            </div>

            <div className="aspect-square w-full bg-[#111] relative">
               <img src={post.media_url} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="p-4 space-y-3">
               <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                     <Heart className="w-6 h-6" />
                     <MessageCircle className="w-6 h-6" />
                     <Send className="w-6 h-6" />
                  </div>
                  <Bookmark className="w-6 h-6" />
               </div>
               
               <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  <span className="font-bold mr-2 text-white">centumilia</span>
                  {post.caption}
               </p>

               <div className="flex items-center gap-2 pt-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] border-t border-white/5">
                  <Calendar className="w-3.5 h-3.5" /> 
                  {new Date(post.scheduled_at).toLocaleDateString('pt-BR')} 
                  <Clock className="w-3.5 h-3.5 ml-2" /> 
                  {new Date(post.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
               </div>
            </div>
         </div>

         {status !== 'Em Análise' && (
           <div className={`p-4 rounded-xl border text-center font-black text-[10px] uppercase tracking-[0.3em] ${status === 'Aprovado' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
              {status === 'Aprovado' ? 'Conteúdo Aprovado ✅' : 'Solicitado Ajustes ❌'}
           </div>
         )}
      </main>

      {/* Botões Centumilia */}
      {status === 'Em Análise' && (
        <footer className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-3xl border-t border-[#222] p-6 pb-12 flex gap-4 z-50 shadow-[0_-10px_50px_rgba(0,0,0,1)]">
           <button onClick={() => setShowFeedbackModal(true)} className="flex-1 h-14 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center gap-2 text-gray-500 font-bold text-xs tracking-widest active:scale-95 transition-transform uppercase">
              <XCircle className="w-4 h-4" /> Ajuste
           </button>
           <button onClick={handleApprove} className="flex-[2] h-14 rounded-xl bg-brand-neon flex items-center justify-center gap-2 text-black font-black text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(1,250,164,0.3)] active:scale-95 transition-transform uppercase">
              <CheckCircle2 className="w-4 h-4" /> APROVAR
           </button>
        </footer>
      )}

      {/* Modal Ajuste */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-[2rem] p-8 space-y-6 shadow-2xl">
              <div className="text-center">
                 <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-tighter">O que ajustar?</h2>
                 <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Seu feedback garante a excelência.</p>
              </div>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Ex: Mudar a cor do texto no criativo..." className="w-full h-32 bg-black border border-[#222] rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors resize-none" />
              <div className="flex flex-col gap-2">
                 <button onClick={handleDecline} className="h-14 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform">Enviar Feedback</button>
                 <button onClick={() => setShowFeedbackModal(false)} className="h-10 text-gray-600 font-bold text-[10px] uppercase tracking-widest">Voltar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
