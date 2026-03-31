import { getPostBySlug, getPostSlugs } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const posts = await getPostSlugs('blog');
  return posts.map((post) => ({
    slug: post,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug, 'blog');

  if (!post) {
    return notFound();
  }

  return (
    <article className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand-neon transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Blog
        </Link>
        
        <header className="space-y-4 border-b border-brand-dark pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-brand-cyan pt-4">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('pt-BR', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric',
               })}
            </time>
          </div>
        </header>
        
        <div className="prose prose-invert prose-brand prose-lg max-w-none 
                        prose-headings:text-white prose-a:text-brand-neon hover:prose-a:text-brand-cyan transition-colors"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
