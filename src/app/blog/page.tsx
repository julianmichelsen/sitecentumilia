import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import { ArrowRight, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const posts = await getAllPosts('blog');
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogList() {
  const posts = await getAllPosts('blog');

  return (
    <main className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Blog & <span className="text-brand-neon">Insights</span>
          </h1>
          <p className="text-xl text-gray-400">
            Estratégias, conteúdo e ferramentas para você escalar sua operação de vendas.
          </p>
        </div>

        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="group flex flex-col justify-between rounded-2xl border border-brand-dark bg-brand-darker/30 p-8 transition-colors hover:bg-brand-darker">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-brand-cyan">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-brand-neon transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-400">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-8">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-brand-neon hover:text-white transition-colors gap-2"
                >
                  Ler artigo completo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <p className="text-gray-400">Nenhum artigo publicado ainda.</p>
          )}
        </div>
      </div>
    </main>
  );
}
