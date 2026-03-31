import { getPostBySlug, getPostSlugs } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trophy, MapPin, Calendar, Briefcase, Target, Quote, TrendingUp, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const cases = await getPostSlugs('cases');
  return cases.map((slug) => ({
    slug: slug,
  }));
}

export default async function CaseStudy({ params }: { params: { slug: string } }) {
  const caseStudy = await getPostBySlug(params.slug, 'cases');

  if (!caseStudy) {
    return notFound();
  }

  // Helper to extract YouTube ID if needed or just use iframe directly in markdown.
  const isYouTube = caseStudy.videoUrl?.includes("youtube.com") || caseStudy.videoUrl?.includes("youtu.be");
  let embedUrl = caseStudy.videoUrl;
  
  if (isYouTube && caseStudy.videoUrl) {
    const videoIdMatch = caseStudy.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  return (
    <article className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <Link 
          href="/cases" 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand-neon transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Cases
        </Link>
        
        {/* Header Hero for Case */}
        <header className="space-y-6 pb-10 border-b border-brand-dark">
          <div className="flex flex-wrap items-center gap-3">
             <div className="inline-flex items-center rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-2 text-sm font-medium text-brand-purple">
               <Trophy className="mr-2 h-4 w-4" />
               Cliente: {caseStudy.client || "Confidencial"}
             </div>
             {caseStudy.segment && (
                <div className="inline-flex items-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-2 text-sm font-medium text-brand-cyan">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {caseStudy.segment}
                </div>
             )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tighter text-white max-w-4xl">
            {caseStudy.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            {caseStudy.excerpt}
          </p>
        </header>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Main Column */}
           <div className="lg:col-span-2 space-y-12">
              {embedUrl ? (
                 <div className="w-full aspect-video rounded-2xl overflow-hidden border border-brand-dark bg-black shadow-lg">
                    <iframe src={embedUrl} className="w-full h-full" allowFullScreen></iframe>
                 </div>
              ) : caseStudy.coverImage ? (
                 <div className="w-full aspect-video rounded-2xl overflow-hidden border border-brand-dark relative bg-brand-dark">
                    <Image src={caseStudy.coverImage} fill alt="Capa" className="object-cover" />
                 </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {caseStudy.challenge && (
                    <div className="bg-[#111] border border-brand-dark p-6 rounded-2xl space-y-3">
                       <h3 className="text-white font-bold flex items-center"><Target className="w-5 h-5 text-brand-purple mr-2"/>O Desafio</h3>
                       <p className="text-gray-400 text-sm">{caseStudy.challenge}</p>
                    </div>
                 )}
                 {caseStudy.strategy && (
                    <div className="bg-[#111] border border-brand-dark p-6 rounded-2xl space-y-3">
                       <h3 className="text-white font-bold flex items-center"><TrendingUp className="w-5 h-5 text-brand-cyan mr-2"/>A Estratégia</h3>
                       <p className="text-gray-400 text-sm">{caseStudy.strategy}</p>
                    </div>
                 )}
              </div>

              <div className="prose prose-invert prose-brand prose-lg max-w-none">
                <ReactMarkdown>{caseStudy.content}</ReactMarkdown>
              </div>

              {caseStudy.testimonial && (
                 <div className="mt-12 p-8 border border-brand-dark rounded-2xl bg-brand-dark/20 relative">
                    <p className="text-xl md:text-2xl font-medium text-white italic mb-6">"{caseStudy.testimonial}"</p>
                    <p className="text-brand-neon font-bold text-lg">{caseStudy.testimonialAuthor || caseStudy.client}</p>
                 </div>
              )}
           </div>

           {/* Sidebar */}
           <div className="lg:col-span-1 space-y-8">
              {caseStudy.results && (
                 <div className="p-6 bg-brand-neon/10 border border-brand-neon/30 rounded-2xl">
                    <h3 className="text-brand-neon font-bold mb-2 text-sm uppercase">Resultado Principal</h3>
                    <p className="text-2xl md:text-3xl font-black text-white">{caseStudy.results}</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </article>
  );
}
