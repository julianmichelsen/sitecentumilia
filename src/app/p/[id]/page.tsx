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
  Loader2,
  Instagram,
  MoreHorizontal,
  ChevronLeft,
  Share2
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  media_url: string;
  caption: string;
  status: string;
  scheduled_at: string;
}

const STATUS_PENDING = 'Aguardando Cliente';
const STATUS_APPROVED = 'Aprovado';
const STATUS_ADJUST = 'Ajuste Solicitado';
const STATUS_PRODUCTION = 'Em Produção';

export default function ClientApprovalPortal({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const statusInfo = (() => {
    if (!status || status === STATUS_PENDING) return null;

    if (status === STATUS_APPROVED) {
      return {
        text: 'Criativo Aprovado com Sucesso ✅',
        className: 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
      };
    }

    if (status === STATUS_ADJUST) {
      return {
        text: 'Ajustes Solicitados pelo Cliente ❌',
        className: 'bg-red-500/10 text-red-500 border-red-500/20'
      };
    }

    if (status === STATUS_PRODUCTION) {
      return {
        text: 'Criativo em produção. Você será avisado quando estiver pronto.',
        className: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
      };
    }

    return {
      text: `Status atual: ${status}`,
      className: 'bg-white/5 text-gray-300 border-white/10'
    };
  })();

  useEffect(() => {
    fetchPost();
  }, []);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/admin/content?magic_link=${params.id}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPost(data[0]);
        setStatus(data[0].status);
      }
    } catch (_) {} finally { setLoading(false); }
  }

  const handleAction = async (newStatus: string, fb: string = '') => {
    await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ magic_link: params.id, status: newStatus, feedback: fb }),
    });
    fetchPost();
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-cyan animate-spin" /></div>;
  if (!post) return <div className="h-screen bg-black flex items-center justify-center text-gray-400">Post não encontrado ou link expirado.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center">
      {/* Header Premium */}
      <header className="w-full h-14 bg-black/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50">
         <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-brand-cyan" />
            <span className="text-xs font-black uppercase tracking-widest text-white/50">Centumilia.</span>
         </div>
         <div className="flex items-center gap-1.5 bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
            <ShieldCheck className="w-3 h-3 text-brand-cyan" />
            <span className="text-[8px] font-black uppercase text-brand-cyan tracking-widest">Portal Seguro</span>
         </div>
      </header>

      <main className="w-full max-w-lg px-4 py-8 md:py-12 space-y-8 pb-32 animate-in fade-in duration-1000">
         <div className="text-center space-y-1">
            <h1 className="text-2xl font-black font-syne tracking-tighter italic">PODE POSTAR?</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Confirmação de Ativo Estratégico</p>
         </div>

         {/* Instagram Post Mockup */}
         <div className="bg-black border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative">
            <div className="flex items-center justify-between p-5">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-neon p-[1.5px]">
                     <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-black italic">C.</div>
                  </div>
                  <div>
                     <p className="text-[12px] font-bold text-white tracking-tight">centumilia_agencial</p>
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Publicação Patrocinada</p>
                  </div>
               </div>
               <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </div>

            <div className="aspect-square w-full bg-[#111] relative group cursor-zoom-in">
               <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                {status === STATUS_APPROVED && (
                  <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px] flex items-center justify-center animate-in zoom-in">
                     <div className="bg-white/10 backdrop-blur-3xl p-6 rounded-full border border-white/20 shadow-2xl">
                        <CheckCircle2 className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                     </div>
                  </div>
                )}
            </div>

            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-5">
                     <Heart className="w-7 h-7 hover:text-red-500 transition-colors" />
                     <MessageCircle className="w-7 h-7" />
                     <Share2 className="w-7 h-7" />
                  </div>
                  <Bookmark className="w-7 h-7" />
               </div>
               
               <p className="text-[13px] leading-relaxed text-gray-200">
                  <span className="font-black mr-2 text-white">centumilia_agencia</span>
                  {post.caption}
               </p>

               <div className="flex items-center gap-3 pt-4 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] border-t border-white/5">
                  <Calendar className="w-3.5 h-3.5" /> {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString('pt-BR') : 'Agendamento Flexível'}
               </div>
            </div>
         </div>

          {statusInfo && (
            <div className={`p-6 rounded-[2rem] border text-center animate-in zoom-in duration-500 ${statusInfo.className}`}>
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                 {statusInfo.text}
               </p>
            </div>
          )}
      </main>

      {/* Footer Minimal Centumilia */}
      {status === STATUS_PENDING && (
        <footer className="fixed bottom-8 inset-x-0 mx-auto w-full max-w-sm flex gap-3 px-6 z-50">
           <button onClick={() => setShowFeedbackModal(true)} className="flex-1 h-16 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all hover:bg-red-500/10 hover:text-red-500 group">
              <XCircle className="w-4 h-4 group-hover:scale-110" /> AJUSTE
           </button>
           <button onClick={() => handleAction(STATUS_APPROVED)} className="flex-[2] h-16 rounded-2xl bg-brand-cyan flex items-center justify-center gap-3 text-black font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(0,222,254,0.4)] active:scale-95 transition-all group">
              <CheckCircle2 className="w-5 h-5 group-hover:scale-125" /> APROVAR AGORA
           </button>
        </footer>
      )}

      {/* Modal Feedback (Mobile First) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-500">
           <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative">
              <div className="text-center">
                 <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Solicitar Ajuste</h2>
                 <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">O que devemos mudar no criativo?</p>
              </div>
              <textarea autoFocus value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Ex: Mudar a cor do texto para azul ou trocar a legenda." className="w-full h-40 bg-black border border-white/5 rounded-3xl p-6 text-sm text-gray-200 outline-none focus:border-red-500 transition-colors resize-none leading-relaxed" />
              <div className="flex flex-col gap-3">
                  <button onClick={() => handleAction(STATUS_ADJUST, feedback)} className="h-16 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-lg shadow-red-600/20">Enviar Feedback</button>
                 <button onClick={() => setShowFeedbackModal(false)} className="h-12 text-gray-600 font-bold text-[10px] uppercase tracking-widest">Cancelar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
