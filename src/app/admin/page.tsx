'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, FileText, ImageIcon, MessageSquare, Settings,
  TrendingUp, Eye, ArrowUpRight, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ cases: 0, blog: 0, logos: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [casesRes, blogRes, logosRes, testimonialsRes] = await Promise.all([
          fetch('/api/admin/cases'),
          fetch('/api/admin/blog'),
          fetch('/api/admin/logos'),
          fetch('/api/admin/testimonials'),
        ]);

        if (casesRes.status === 401) {
          router.push('/admin/login');
          return;
        }

        const [cases, blog, logos, testimonials] = await Promise.all([
          casesRes.json(),
          blogRes.json(),
          logosRes.json(),
          testimonialsRes.json(),
        ]);

        setStats({
          cases: Array.isArray(cases) ? cases.length : 0,
          blog: Array.isArray(blog) ? blog.length : 0,
          logos: Array.isArray(logos) ? logos.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        });
      } catch (error) {
        console.error('Erro ao carregar stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  const statCards = [
    { label: 'Cases', value: stats.cases, icon: Briefcase, color: '#01FAA4', href: '/admin/cases' },
    { label: 'Posts do Blog', value: stats.blog, icon: FileText, color: '#BB61EC', href: '/admin/blog' },
    { label: 'Logos de Clientes', value: stats.logos, icon: ImageIcon, color: '#00DEFE', href: '/admin/logos' },
    { label: 'Depoimentos', value: stats.testimonials, icon: MessageSquare, color: '#2874EE', href: '/admin/depoimentos' },
  ];

  const quickActions = [
    { label: 'Novo Case', href: '/admin/cases?new=true', icon: Briefcase, desc: 'Adicionar estudo de caso' },
    { label: 'Novo Post', href: '/admin/blog?new=true', icon: FileText, desc: 'Escrever artigo do blog' },
    { label: 'Configurações', href: '/admin/configuracoes', icon: Settings, desc: 'Editar dados do site' },
    { label: 'Gerenciar Logos', href: '/admin/logos', icon: ImageIcon, desc: 'Adicionar ou remover logos' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#01FAA4]/30 border-t-[#01FAA4] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do conteúdo do site</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-4 bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#01FAA4]/30 hover:bg-[#01FAA4]/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#01FAA4]/10 transition-colors">
                <action.icon className="w-5 h-5 text-gray-500 group-hover:text-[#01FAA4] transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-xs text-gray-600">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-[#01FAA4]" />
          <h2 className="text-lg font-semibold text-white">Resumo do Conteúdo</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
            <span className="text-gray-400 text-sm">Total de conteúdos publicados</span>
            <span className="text-white font-bold">{stats.cases + stats.blog}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
            <span className="text-gray-400 text-sm">Empresas parceiras exibidas</span>
            <span className="text-white font-bold">{stats.logos}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-400 text-sm">Depoimentos ativos</span>
            <span className="text-white font-bold">{stats.testimonials}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
