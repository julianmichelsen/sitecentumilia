import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-brand-darker pt-24 pb-12 overflow-hidden relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-neon/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container px-6 md:px-12 mx-auto relative z-10">
        <div className="grid gap-16 lg:grid-cols-5 xl:grid-cols-6 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-neon rounded-xl flex items-center justify-center text-black shadow-brand-neon/20 transition-all group-hover:scale-110">
                 <span className="font-black italic tracking-tighter">C.</span>
              </div>
              <span className="text-xl font-black italic tracking-tighter uppercase text-white group-hover:text-brand-neon transition-colors">Centumilia.</span>
            </Link>
            <p className="max-w-xs text-sm text-gray-400 font-medium leading-relaxed italic">
              "Transformamos marketing em um sistema previsível de crescimento. Mais que tráfego, entregamos retorno real através do Método CENTUM."
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="https://www.instagram.com/centumilia/" target="_blank" className="w-12 h-12 glass-elite rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-neon hover:border-brand-neon/40 transition-all">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="w-12 h-12 glass-elite rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:border-brand-purple/40 transition-all">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Explorar</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/" className="text-gray-500 hover:text-brand-neon transition-all">Ecossistema</Link></li>
              <li><Link href="/metodologia" className="text-gray-500 hover:text-brand-neon transition-all">Método CENTUM</Link></li>
              <li><Link href="/cases" className="text-gray-500 hover:text-brand-neon transition-all">Cases de Elite</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-brand-neon transition-all">Blog Insights</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Soluções</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/#solucoes" className="text-gray-500 hover:text-brand-cyan transition-all">Demanda B2B</Link></li>
              <li><Link href="/#solucoes" className="text-gray-500 hover:text-brand-cyan transition-all">Posicionamento</Link></li>
              <li><Link href="/#solucoes" className="text-gray-500 hover:text-brand-cyan transition-all">Setup Vendas</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Sede Operacional</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-3 glass-elite rounded-xl text-brand-neon shrink-0"><MapPin className="w-4 h-4" /></div>
                <div>
                   <p className="text-xs text-white font-black uppercase tracking-widest">Garibaldi/RS</p>
                   <p className="text-xs text-gray-500 mt-1 max-w-[200px] leading-relaxed">Av. Independência, 248 - Sala 214, Centro</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-3 glass-elite rounded-xl text-brand-neon shrink-0"><Phone className="w-4 h-4" /></div>
                <div>
                   <p className="text-xs text-white font-black uppercase tracking-widest">Direct WhatsApp</p>
                   <Link href="https://wa.me/5554999441227" className="text-xs text-gray-500 hover:text-brand-neon transition-colors mt-1 block">(54) 99944-1227</Link>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-3 glass-elite rounded-xl text-brand-neon shrink-0"><Mail className="w-4 h-4" /></div>
                <div>
                   <p className="text-xs text-white font-black uppercase tracking-widest">E-mail</p>
                   <p className="text-xs text-gray-500 mt-1 block">contato@centumilia.com.br</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 italic">
               © {new Date().getFullYear()} Centumilia. Direção Estratégica & Growth.
             </p>
             <div className="flex gap-6">
               <Link href="/politica-de-privacidade" className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-colors">Privacidade</Link>
               <Link href="/termos-de-uso" className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-colors">Termos</Link>
             </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700 flex items-center gap-2">
            DESIGN BY <span className="text-brand-neon">CENTUM ELITE</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
