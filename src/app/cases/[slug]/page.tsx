import { getPostBySlug, getPostSlugs } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trophy, Target, TrendingUp, Quote, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const cases = await getPostSlugs('cases');
  return cases.map((slug) => ({ slug }));
}

export default async function CaseStudy({ params }: { params: { slug: string } }) {
  const caseStudy = await getPostBySlug(params.slug, 'cases');

  if (!caseStudy) {
    return notFound();
  }

  const isYouTube = caseStudy.videoUrl?.includes("youtube.com") || caseStudy.videoUrl?.includes("youtu.be");
  let embedUrl = caseStudy.videoUrl;
  
  if (isYouTube && caseStudy.videoUrl) {
    const videoIdMatch = caseStudy.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/watch\?v=|watch\?.+&v=))([^&]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  return (
    <article className="container mx-auto px-4 md:px-6 py-32 min-h-screen relative">
      <div className="max-w-6xl mx-auto space-y-16">
        <Link 
          href="/cases" 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand-neon transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Cases
        </Link>
        
        <header className="space-y-6 pb-10 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-2 text-sm font-medium text-brand-purple">
              <Trophy className="mr-2 h-4 w-4" />
              Cliente: {caseStudy.client || "Confidencial"}
            </div>
            {caseStudy.segment && (
              <div className="inline-flex items-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-2 text-sm font-medium text-brand-cyan">
                {caseStudy.segment}
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-black italic tracking-tighter text-white uppercase leading-none max-w-4xl">
            {caseStudy.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">{caseStudy.excerpt}</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {embedUrl ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                <iframe src={embedUrl} className="w-full h-full" allowFullScreen></iframe>
              </div>
            ) : caseStudy.coverImage ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 relative bg-brand-dark">
                <Image src={caseStudy.coverImage} fill alt="Capa" className="object-cover" />
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudy.challenge && (
                <div className="glass-elite p-6 rounded-[2rem] space-y-3">
                  <h3 className="text-white font-black italic uppercase tracking-tighter flex items-center"><Target className="w-5 h-5 text-brand-purple mr-2"/>O Desafio</h3>
                  <p className="text-gray-400 text-sm">{caseStudy.challenge}</p>
                </div>
              )}
              {caseStudy.strategy && (
                <div className="glass-elite p-6 rounded-[2rem] space-y-3">
                  <h3 className="text-white font-black italic uppercase tracking-tighter flex items-center"><TrendingUp className="w-5 h-5 text-brand-cyan mr-2"/>A Estratégia</h3>
                  <p className="text-gray-400 text-sm">{caseStudy.strategy}</p>
                </div>
              )}
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown>{caseStudy.content}</ReactMarkdown>
            </div>

            {caseStudy.testimonial && (
              <div className="mt-12 p-8 glass-elite rounded-[2.5rem] relative">
                <Quote className="w-8 h-8 text-brand-neon/30 absolute top-6 right-6" />
                <p className="text-xl md:text-2xl font-medium text-white italic mb-6">"{caseStudy.testimonial}"</p>
                <p className="text-brand-neon font-black text-sm uppercase tracking-[0.2em]">{caseStudy.testimonialAuthor || caseStudy.client}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            {caseStudy.results && (
              <div className="glass-elite p-8 rounded-[2.5rem] border-brand-neon/20">
                <h3 className="text-brand-neon font-black mb-2 text-[10px] uppercase tracking-[0.3em]">Resultado Principal</h3>
                <p className="text-2xl md:text-3xl font-black text-white italic">{caseStudy.results}</p>
              </div>
            )}

            {caseStudy.metrics && (
              <div className="glass-elite p-8 rounded-[2.5rem]">
                <h3 className="text-brand-cyan font-black mb-4 text-[10px] uppercase tracking-[0.3em]">Métricas</h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{caseStudy.metrics}</ReactMarkdown>
                </div>
              </div>
            )}

            <div className="glass-elite p-8 rounded-[2.5rem] text-center space-y-6 bg-gradient-to-b from-brand-neon/5 to-transparent">
              <h3 className="text-white font-black italic uppercase tracking-tighter text-lg">Quer resultados assim?</h3>
              <p className="text-gray-400 text-sm">Agende um diagnóstico gratuito e descubra como o método CENTUM pode funcionar para o seu negócio.</p>
              <Link href="/contato" className="btn-epic-neon inline-flex items-center gap-3 text-sm">
                Falar com Especialista <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
