import { supabase } from './supabase';

type ContentType = 'blog' | 'cases';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  // Novos campos exigidos para os Cases:
  segment?: string;
  location?: string;
  challenge?: string;
  strategy?: string;
  services?: string;
  period?: string;
  results?: string;
  videoUrl?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  metrics?: string;
  // Campos arbitrários residuais:
  [key: string]: any;
}

export async function getPostBySlug(slug: string, type: ContentType): Promise<Post | null> {
  const { data, error } = await supabase
    .from(type)
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    coverImage: data.cover_image,
    content: data.content,
    // Mapeando dados extras de cases se existirem
    segment: data.segment,
    location: data.location,
    challenge: data.challenge,
    strategy: data.strategy,
    services: data.services,
    period: data.period,
    results: data.results,
    videoUrl: data.video_url,
    testimonial: data.testimonial,
    testimonialAuthor: data.testimonial_author,
    metrics: data.metrics,
    ...data
  };
}

export async function getAllPosts(type: ContentType): Promise<Post[]> {
  const { data, error } = await supabase
    .from(type)
    .select('*')
    .order('date', { ascending: false });

  if (error) return [];

  return data.map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    coverImage: post.cover_image,
    content: post.content,
    segment: post.segment,
    ...post
  }));
}

export async function getPostSlugs(type: ContentType): Promise<string[]> {
  const { data, error } = await supabase
    .from(type)
    .select('slug');
  
  if (error) return [];
  return data.map(d => d.slug);
}
