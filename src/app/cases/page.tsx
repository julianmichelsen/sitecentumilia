import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const cases = await getAllPosts('cases');
  return cases.map((post) => ({ slug: post.slug }));
}

export default async function CasesList() {
  const cases = await getAllPosts('cases');

  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30 select-none">
        <div className="gradient-blob w-[600px] h-[600px] bg-brand-neon top-[-10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
        <div className="gradient-blob w-[700px] h-[700px] bg-brand-purple bottom-[-20%] left-[-10%]" style={{ animationDelay: '-2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-32 space-y-20">
        <Reveal className="space-y-6 text-center max-w-3xl mx-auto">
          <span className="text-brand-purple font-black tracking-[0.5em] uppercase text-[10px]">Portfólio</span>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">Cases de <br/><span className="text-gradient">Sucesso.</span></h1>
          <p className="text-gray-400 text-xl font-medium">Resultados reais gerados pelo método CENTUM para empresas que decidiram crescer com direção.</p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseStudy, i) => (
            <Reveal key={caseStudy.slug} className={`stagger-${(i % 3) + 1}`}>
              <Link href={`/cases/${caseStudy.slug}`} className="group flex flex-col glass-elite rounded-[3rem] overflow-hidden hover:border-brand-neon/40 transition-all h-full">
                <div className="relative h-56 w-full bg-brand-dark/50 overflow-hidden">
                  {caseStudy.coverImage ? (
                    <Image src={caseStudy.coverImage} alt={caseStudy.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-neon/20 flex items-center justify-center">
                      <span className="text-6xl font-black text-white/10 italic">{caseStudy.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  {caseStudy.segment && (
                    <div className="absolute top-5 left-5 glass-elite border-white/10 text-[9px] font-black uppercase text-white px-3 py-1 rounded-full tracking-widest">
                      {caseStudy.segment}
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col flex-1 space-y-3">
                  <h3 className="text-xl font-black italic text-white uppercase tracking-tighter leading-tight group-hover:text-brand-neon transition-colors line-clamp-2">{caseStudy.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 italic">"{caseStudy.excerpt}"</p>
                  <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-neon group-hover:translate-x-4 transition-transform">
                    Estudo de Caso <ArrowRight className="ml-3 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {cases.length === 0 && (
          <Reveal>
            <p className="text-center text-gray-600 text-sm uppercase font-black tracking-widest italic animate-pulse">Cases sendo atualizados...</p>
          </Reveal>
        )}

        <Reveal className="text-center pt-12">
          <Link href="/contato" className="btn-epic-neon inline-flex items-center gap-3">
            Quero Resultados Assim <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
