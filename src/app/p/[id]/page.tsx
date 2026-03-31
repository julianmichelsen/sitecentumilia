'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Instagram,
  Heart,
  MessageSquare,
  Send,
  Bookmark
} from 'lucide-react';
import Image from 'next/image';

export default function ClientApprovalPortal({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<'pendente' | 'aprovado' | 'ajuste'>('pendente');
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Mock de dados do post
  const post = {
    client: 'Centumilia',
    logo: '/logo.png',
    media: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800',
    title: 'Reels - Por que importar demora?',
    caption: 'Você sabia que o porto de Xangai... #importação #comercioexterior',
    date: '10/04/2026',
    time: '18:00',
  };

  const handleApprove = () => {
    setStatus('aprovado');
    alert('Conteúdo APROVADO com sucesso! Já vamos agendar para publicação. ✅');
  };

  const handleDecline = () => {
    if (!feedback) {
      alert('Por favor, descreva o ajuste necessário.');
      return;
    }
    setStatus('ajuste');
    setShowFeedbackModal(false);
    alert('Solicitação de ajuste enviada para a agência. 🚀');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-start pb-32">
      {/* Header Mobile-First */}
      <header className="w-full h-16 bg-black border-b border-[#111] flex items-center justify-between px-6 sticky top-0 z-40">
         <Image src="/logo.png" alt="Centumilia" width={120} height={30} className="h-6 w-auto opacity-80" />
         <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-neon bg-brand-neon/10 px-2 py-1 rounded border border-brand-neon/20">
            <ShieldCheck className="w-3 h-3" /> Link Seguro
         </div>
      </header>

      <main className="w-full max-w-sm px-4 pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="text-center space-y-2">
            <h1 className="text-xl font-bold font-syne text-white tracking-tight">Análise de Conteúdo</h1>
            <p className="text-gray-500 text-xs">Olá! Analise o criativo e a legenda abaixo para aprovação.</p>
         </div>

         {/* Instagram Mockup Card */}
         <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Insta Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#1a1a1a]">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                  <div className="w-full h-full bg-[#111] rounded-full border border-black flex items-center justify-center p-1">
                     <Image src="/logo.png" alt="Client Logo" width={20} height={20} className="w-full h-full object-contain" />
                  </div>
               </div>
               <div className="flex-1">
                  <p className="text-[11px] font-bold text-white leading-none">centumilia_oficial</p>
                  <p className="text-[9px] text-gray-500">Suggested post</p>
               </div>
               <button className="text-white text-xs font-bold px-3 py-1.5 bg-brand-dark rounded-lg">Follow</button>
            </div>

            {/* Content Image */}
            <div className="aspect-square w-full bg-[#161616] relative">
               <img src={post.media} alt="Preview" className="w-full h-full object-cover" />
            </div>

            {/* Insta Actions */}
            <div className="p-4 space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white">
                     <Heart className="w-6 h-6 hover:text-red-500 transition-colors" />
                     <MessageCircle className="w-6 h-6" />
                     <Send className="w-6 h-6" />
                  </div>
                  <Bookmark className="w-6 h-6" />
               </div>
               
               <div>
                  <p className="text-[11px] font-bold mb-1">987 likes</p>
                  <p className="text-xs text-gray-200 leading-relaxed">
                     <span className="font-bold mr-2 text-white">centumilia_oficial</span>
                     {post.caption}
                  </p>
               </div>

               <div className="flex items-center gap-2 pt-2 text-[10px] text-gray-500 uppercase font-black tracking-widest border-t border-white/5">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                  <Clock className="w-3.5 h-3.5 ml-2" /> {post.time}
               </div>
            </div>
         </div>

         {/* Final Status */}
         {status !== 'pendente' && (
           <div className={`p-4 rounded-2xl border text-center font-bold text-sm uppercase tracking-widest ${status === 'aprovado' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
              {status === 'aprovado' ? 'Conteúdo Aprovado! ✅' : 'Solicitado Ajustes ❌'}
           </div>
         )}
      </main>

      {/* Action Footer Mobile */}
      {status === 'pendente' && (
        <footer className="fixed bottom-0 inset-x-0 bg-brand-dark/90 backdrop-blur-2xl border-t border-[#222] p-6 pb-10 flex gap-4 z-50">
           <button 
             onClick={() => setShowFeedbackModal(true)}
             className="flex-1 h-16 rounded-2xl bg-brand-dark border border-[#333] flex items-center justify-center gap-2 text-gray-400 font-bold transition-all active:scale-95"
           >
              <XCircle className="w-5 h-5" /> REJEITAR
           </button>
           <button 
             onClick={handleApprove}
             className="flex-[1.5] h-16 rounded-2xl bg-brand-neon flex items-center justify-center gap-2 text-black font-black shadow-[0_-5px_30px_rgba(1,250,164,0.3)] transition-all active:scale-95"
           >
              <CheckCircle2 className="w-5 h-5" /> APROVAR
           </button>
        </footer>
      )}

      {/* Adjustment Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-3xl p-8 space-y-6 shadow-2xl">
              <div>
                 <h2 className="text-xl font-bold text-white mb-1">O que ajustar?</h2>
                 <p className="text-gray-500 text-xs">Sua opinião é fundamental para o sucesso.</p>
              </div>
              <textarea 
                value={feedback} 
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ex: Trocar a música de fundo por algo mais animado..."
                className="w-full h-32 bg-black border border-[#222] rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
              />
              <div className="flex gap-4">
                 <button onClick={() => setShowFeedbackModal(false)} className="flex-1 h-12 rounded-xl text-gray-500 font-bold text-sm">Cancelar</button>
                 <button onClick={handleDecline} className="flex-[2] h-12 bg-red-500 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-red-500/20">Enviar Ajuste</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
