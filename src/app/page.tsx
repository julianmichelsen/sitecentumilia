import { 
  ArrowRight, 
  ChevronRight, 
  Target, 
  Zap, 
  Instagram,
  Users,
  Briefcase,
  Play
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getCases, getBlogPosts } from "@/lib/markdown";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLogos() { const { data } = await supabase.from('logos').select('*').order('order_index'); return data || []; }
async function getTestimonials() { const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }); return data || []; }

export default async function Home() {
  const cases = getCases();
  const logos = await getLogos();
  const testimonials = await getTestimonials();

  return (
    <div className="flex min-h-screen flex-col bg-brand-darker relative overflow-hidden">
      <Header />
      
      {/* Animated Mesh Gradients Background (Organic Life) */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30 select-none">
         <div className="gradient-blob w-[600px] h-[600px] bg-brand-neon top-[-10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
         <div className="gradient-blob w-[700px] h-[700px] bg-brand-purple bottom-[-20%] left-[-10%]" style={{ animationDelay: '-2s' }}></div>
         <div className="gradient-blob w-[500px] h-[500px] bg-brand-cyan top-[30%] left-[20%] blur-[150px]" style={{ animationDelay: '-4s' }}></div>
      </div>

      <main className="flex-1 relative z-10">
        {/* HERO SECTION - THE WOW FACTOR */}
        <section className="relative flex min-h-[100vh] flex-col items-center justify-center px-4 py-24 text-center">
          <div className="container mx-auto max-w-5xl space-y-10">
            <Reveal className="mx-auto w-fit px-5 py-2 bg-white/5 border border-white/10 rounded-full glass-elite">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-neon animate-pulse">Sua Agência Boutique de Growth.</span>
            </Reveal>
            
            <Reveal className="stagger-1">
               <h1 className="text-5xl font-black font-syne tracking-tighter text-white md:text-8xl lg:text-[10rem] italic border-0 uppercase leading-[0.8] mb-6">
                 TRANSFOR<br/>MAMOS <span className="text-gradient">AMBIÇÃO</span>.
               </h1>
            </Reveal>

            <Reveal className="stagger-2">
               <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-2xl font-medium leading-relaxed">
                 A Centumilia não faz posts. Nós estruturamos **vendas B2B de alta performance** através do Método CENTUM.
               </p>
            </Reveal>

            <Reveal className="flex flex-col items-center justify-center gap-6 pt-12 sm:flex-row stagger-3">
              <Link href="/contato" className="btn-epic-neon flex items-center gap-3">
                Agendar Diagnóstico <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/metodologia" className="btn-epic glass-elite flex items-center gap-3 hover:bg-white/10">
                <Play className="w-4 h-4 fill-white" /> Ver Metodologia
              </Link>
            </Reveal>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
             <div className="w-0.5 h-12 bg-white rounded-full"></div>
          </div>
        </section>

        {/* LOGOS - FLOW REVEAL */}
        <section className="py-24 border-t border-b border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="container mx-auto px-4">
             <Reveal className="flex flex-col items-center gap-14 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Autoridade Comprovada em mais de 50 nichos B2B</p>
                <div className="flex flex-wrap justify-center gap-16 md:gap-24">
                   {logos.map((l: any) => (
                      <img key={l.id} src={l.logo} alt={l.name} className="h-10 w-auto md:h-14 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 hover:scale-110" />
                   ))}
                </div>
             </Reveal>
          </div>
        </section>

        {/* CASES - HIGH END DISPLAY */}
        <section className="py-40 bg-brand-darker">
          <div className="container mx-auto px-4 space-y-24">
             <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                   <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">Cases de <br/> <span className="text-gradient">Elite.</span></h2>
                   <div className="h-1.5 w-32 bg-brand-neon"></div>
                </div>
                <Link href="/cases" className="btn-epic glass-elite text-[10px] tracking-[0.4em] mb-4">Portfólio Completo</Link>
             </Reveal>

             <div className="grid gap-16 md:grid-cols-2">
                {cases.slice(0, 2).map((item, i) => (
                  <Reveal key={item.slug} className={`stagger-${i+1}`}>
                    <Link href={`/cases/${item.slug}`} className="group relative block rounded-[3.5rem] overflow-hidden glass-elite border-white/5">
                      <div className="aspect-[16/11] overflow-hidden">
                         <Image src={item.cover_image || ""} alt={item.title} fill className="object-cover transition-all duration-[2s] group-hover:scale-110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      </div>
                      <div className="p-12 space-y-6 relative">
                         <div className="flex gap-4">
                            {item.services?.split(',').slice(0, 2).map(s => <span key={s} className="px-4 py-1.5 bg-brand-neon/10 border border-brand-neon/20 rounded-full text-[9px] font-black uppercase text-brand-neon tracking-widest">{s}</span>)}
                         </div>
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tight group-hover:text-brand-neon transition-colors leading-none">{item.title}</h3>
                         <p className="text-gray-400 text-lg line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{item.excerpt}"</p>
                         <div className="mt-8 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white group-hover:translate-x-4 transition-transform">Ler o Case <ChevronRight className="w-5 h-5 text-brand-neon" /></div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
             </div>
          </div>
        </section>

        {/* TESTIMONIALS - BOLD CAROUSEL REVEAL */}
        <section className="py-40 bg-black relative">
           <div className="container mx-auto px-4 space-y-24 relative z-10 text-center">
              <Reveal>
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">O que os <br/> Sócios <span className="text-gradient">Falam.</span></h2>
                 <p className="text-gray-600 uppercase font-black text-[11px] tracking-[0.5em] mt-6">Credibilidade é a nossa base</p>
              </Reveal>

              <div className="grid gap-10 md:grid-cols-3">
                 {testimonials.map((t: any, i: number) => (
                    <Reveal key={t.id} className={`stagger-${i+1}`}>
                       <div className="glass-elite p-12 rounded-[4rem] space-y-8 hover:border-brand-neon/20 transition-all group h-full flex flex-col justify-between">
                          <div className="text-brand-neon flex justify-center">
                             {[...Array(5)].map((_, star) => <Zap key={star} className="w-4 h-4 fill-brand-neon animate-pulse" style={{ animationDelay: `${star * 200}ms` }} />)}
                          </div>
                          <p className="text-white italic text-lg leading-relaxed font-medium">"{t.quote}"</p>
                          <div className="flex flex-col items-center gap-4 pt-10 border-t border-white/5">
                             <div className="w-14 h-14 rounded-[1.5rem] bg-brand-neon/10 flex items-center justify-center text-brand-neon font-black text-xl border border-brand-neon/20">{t.author.charAt(0)}</div>
                             <div>
                                <p className="text-white font-black text-sm uppercase tracking-[0.25em]">{t.author}</p>
                                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1 italic">{t.role}</p>
                             </div>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* FINAL CALL TO ACTION - EPIC */}
        <section className="relative py-60 px-4 overflow-hidden">
           <Reveal className="container mx-auto max-w-5xl h-[500px] glass-elite rounded-[4rem] p-12 md:p-24 flex flex-col items-center justify-center text-center space-y-12 relative group shadow-brand-neon/10">
              <div className="absolute inset-0 bg-brand-neon/10 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]"></div>
              <h2 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.8] relative z-10 mb-4 transition-all group-hover:scale-105 duration-700">
                A HORA DA <br/> <span className="text-gradient">ESCALA</span> É AGORA.
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl max-w-xl font-medium relative z-10 transition-all group-hover:text-white">Pare de ver a concorrência faturar o que deveria ser seu.</p>
              <div className="relative z-10 pt-10">
                 <Link href="/contato" className="btn-epic-neon scale-150 shadow-[0_0_100px_rgba(1,250,164,0.4)]">Quero o Método Centum</Link>
              </div>
           </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
