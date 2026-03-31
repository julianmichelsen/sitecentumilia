import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import { ArrowRight, Trophy } from 'lucide-react';

export default async function CasesList() {
  const cases = await getAllPosts('cases');

  return (
    <main className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Cases de <span className="text-brand-neon">Sucesso</span>
          </h1>
          <p className="text-xl text-gray-400">
            Veja como a Metodologia Centum transformou negócios reais em máquinas de vendas e crescimento.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {cases.map((caseStudy) => (
            <article key={caseStudy.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-brand-dark bg-brand-darker/30 transition-all hover:-translate-y-1 hover:border-brand-neon/50">
              <div className="p-8 space-y-4 flex-grow">
                <div className="inline-flex items-center rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple">
                  <Trophy className="mr-1 h-3 w-3" />
                  {caseStudy.client || "Case de Performance"}
                </div>
                
                <h2 className="text-2xl font-bold text-white group-hover:text-brand-neon transition-colors">
                  <Link href={`/cases/${caseStudy.slug}`} className="before:absolute before:inset-0">
                    {caseStudy.title}
                  </Link>
                </h2>
                
                <p className="text-gray-400">
                  {caseStudy.excerpt}
                </p>
              </div>
              <div className="px-8 pb-8 pt-0">
                <span className="inline-flex items-center text-sm font-medium text-brand-cyan gap-2">
                  Ver estudo completo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}

          {cases.length === 0 && (
            <p className="text-gray-400">Nenhum case publicado ainda.</p>
          )}
        </div>
      </div>
    </main>
  );
}
