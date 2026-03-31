import { 
  ArrowRight, 
  ChevronRight, 
  Target, 
  TrendingUp, 
  Zap, 
  MessageCircle, 
  CheckCircle2, 
  BarChart3, 
  Search, 
  Rocket, 
  Instagram,
  Users,
  Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCases, getBlogPosts } from "@/lib/markdown";
import { supabase } from "@/lib/supabase";

// Força o carregamento dinâmico para os dados do ERP aparecerem na hora
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLogos() {
  const { data } = await supabase.from('logos').select('*').order('order_index');
  return data || [];
}

async function getTestimonials() {
  const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  return data || [];
}

export default async function Home() {
  const cases = getCases();
  const blogPosts = getBlogPosts();
  const logos = await getLogos();
  const testimonials = await getTestimonials();

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark">
      <Header />
      
      <main className="flex-1">
        {/* HERO SECTION - REFINADA */}
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(1,250,164,0.1),transparent_70%)]" />
          <div className="container relative z-10 mx-auto max-w-5xl space-y-8">
            <div className="badge-premium mx-auto w-fit px-4 py-2 bg-white/5 border border-white/10 rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-neon">Marketing com Método</span>
            </div>
            <h1 className="text-4xl font-black font-syne tracking-tighter text-white md:text-7xl lg:text-8xl italic uppercase text-glow">
              Transformamos <span className="text-brand-neon">Ambição</span> em faturamento.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl font-medium leading-relaxed">
              A Centumilia não é uma agência de social media. Somos o seu **braço de growth** focado em estruturar prospecção ativa e vendas B2B de alta performance.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-10 sm:flex-row">
              <Link href="/contato" className="btn-primary group">
                Falar com Especialista
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/metodologia" className="btn-outline">
                Conhecer o Método CENTUM
              </Link>
            </div>
          </div>
        </section>

        {/* LOGOS SECTION - DINÂMICA DO ERP */}
        <section className="border-t border-b border-white/5 bg-black/40 py-16">
          <div className="container mx-auto px-4">
             <div className="flex flex-col items-center gap-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Empresas que confiam na Centumilia</p>
                <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                   {logos.length > 0 ? logos.map((l: any) => (
                      <img key={l.id} src={l.logo} alt={l.name} className="h-8 w-auto md:h-12 object-contain" />
                   )) : (
                      <p className="text-gray-700 italic text-xs">Atualizando portfólio...</p>
                   )}
                </div>
             </div>
          </div>
        </section>

        {/* CASES SECTION - REFINADA */}
        <section id="cases" className="py-32 bg-brand-dark">
          <div className="container mx-auto px-4 space-y-20">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-4">
                   <h2 className="text-3xl font-black md:text-6xl text-white tracking-tighter uppercase italic">Resultados <br/>Incontestáveis</h2>
                   <div className="h-1 w-24 bg-brand-neon"></div>
                </div>
                <Link href="/cases" className="text-brand-neon font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-2 transition-transform">Ver todos os Cases <ChevronRight className="w-4 h-4" /></Link>
             </div>

             <div className="grid gap-12 md:grid-cols-2">
                {cases.slice(0, 2).map((item) => (
                  <Link key={item.slug} href={`/cases/${item.slug}`} className="group relative block overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/5">
                    <div className="aspect-[16/10] overflow-hidden">
                       <Image src={item.cover_image || ""} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    </div>
                    <div className="p-10 space-y-4">
                       <div className="flex gap-3">
                          {item.services?.split(',').slice(0, 2).map(s => <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-brand-neon tracking-widest">{s}</span>)}
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tight italic group-hover:text-brand-neon transition-colors">{item.title}</h3>
                       <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{item.excerpt}</p>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        </section>

        {/* DEPOIMENTOS - DINÂMICOS DO ERP */}
        <section className="py-32 bg-black relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-[150px] rounded-full"></div>
           <div className="container mx-auto px-4 space-y-16 relative z-10">
              <div className="text-center space-y-4">
                 <h2 className="text-4xl font-black md:text-5xl text-white tracking-tighter uppercase italic">O que dizem os Sócios</h2>
                 <p className="text-gray-500 uppercase font-black text-[10px] tracking-[0.3em]">Nossa autoridade é medida pelo sucesso deles</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                 {testimonials.map((t: any) => (
                    <div key={t.id} className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-brand-neon/20 transition-all group">
                       <div className="flex gap-1">
                          {[...Array(t.rating || 5)].map((_, i) => <Zap key={i} className="w-3.5 h-3.5 text-brand-neon fill-brand-neon" />)}
                       </div>
                       <p className="text-gray-400 italic leading-relaxed text-sm">"{t.quote}"</p>
                       <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                          <div className="w-10 h-10 rounded-full bg-brand-neon/10 flex items-center justify-center text-brand-neon font-black text-xs">{t.author.charAt(0)}</div>
                          <div>
                             <p className="text-white font-bold text-xs uppercase tracking-widest">{t.author}</p>
                             <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest leading-none mt-1">{t.role}</p>
                          </div>
                       </div>
                    </div>
                 ))}
                 {testimonials.length === 0 && (
                   <p className="col-span-3 text-center text-gray-700 italic">Capturando feedbacks de sucesso...</p>
                 )}
              </div>
           </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-40 bg-brand-dark px-4">
           <div className="container mx-auto max-w-4xl bg-gradient-to-br from-[#0a0a0a] to-brand-dark border border-brand-neon/20 rounded-[3.5rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-neon/10 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]"></div>
              <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase relative z-10">Sua agência <br/><span className="text-brand-neon">Não é um gasto</span>. <br/>É investimento.</h2>
              <p className="text-gray-400 text-lg relative z-10">Pare de tentar e comece a escalar. Agende um diagnóstico gratuito da sua operação.</p>
              <div className="relative z-10">
                 <Link href="/contato" className="btn-primary-neon scale-125 px-10">Começar Agora</Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
