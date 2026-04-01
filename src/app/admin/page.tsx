'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  FileText,
  ArrowUpRight,
  BarChart3,
  Instagram
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ leads: 0, tasks: 0, pending: 0, clients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setStats({
        leads: data.leads || 0,
        tasks: data.tasks || 0,
        pending: data.pending || 0,
        clients: data.clients || 0
      });
    } catch (_) {} finally { setLoading(false); }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="glass-card glass-card-hover rounded-[3rem] p-10 space-y-6 relative overflow-hidden group">
       <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-[60px] rounded-full translate-x-10 -translate-y-10 ${color}`}></div>
       <div className="flex items-center justify-between">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5 group-hover:scale-110 transition-transform ${color.replace('bg-', 'text-')}`}>
             <Icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
             {trend} <ArrowUpRight className="w-3 h-3" />
          </span>
       </div>
       <div className="space-y-1">
          <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">{value}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{title}</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-14 animate-in fade-in duration-[1500ms]">
       {/* Welcome Header */}
       <div className="space-y-4">
          <div className="flex items-center gap-3 bg-brand-neon/5 w-fit px-4 py-2 rounded-full border border-brand-neon/20">
             <Zap className="w-4 h-4 text-brand-neon" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-neon">Sistemas Ativos.</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">Painel de <br/><span className="text-brand-neon">Comando</span> Centumilia.</h1>
       </div>

       {/* Quick Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Leads Capturados" value={stats.leads} icon={Target} color="bg-brand-neon" trend="+12% Est." />
          <StatCard title="Em Operação" value={stats.tasks} icon={Briefcase} color="bg-brand-cyan" trend="Sinc. OK" />
          <StatCard title="Aguard. Aprovação" value={stats.pending} icon={Instagram} color="bg-brand-blue" trend="3 Críticos" />
          <StatCard title="Parceiros" value={stats.clients} icon={Users} color="bg-brand-purple" trend="Base Ativa" />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/blog?new=true" className="glass-card glass-card-hover rounded-[2rem] p-8 border border-brand-neon/20 group">
             <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-neon">Ação Rápida</p>
                <FileText className="w-5 h-5 text-brand-neon group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Novo Post no Blog</h3>
             <p className="text-sm text-gray-500 mt-2">Abrir editor para criar e publicar um artigo.</p>
          </Link>

          <Link href="/admin/cases?new=true" className="glass-card glass-card-hover rounded-[2rem] p-8 border border-brand-cyan/20 group">
             <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">Ação Rápida</p>
                <Briefcase className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Novo Case</h3>
             <p className="text-sm text-gray-500 mt-2">Abrir editor para cadastrar um novo case.</p>
          </Link>
       </div>

       {/* Active Strategy Area */}
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-8">
          <div className="xl:col-span-2 glass-card rounded-[3.5rem] p-12 space-y-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-glow-neon opacity-20"></div>
             <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Metodologia Centumilia</h3>
                   <p className="text-sm text-gray-500 max-w-md">Seu braço direito na escala comercial. Acompanhe abaixo o crescimento sistêmico da sua agência.</p>
                </div>
                <BarChart3 className="w-12 h-12 text-brand-neon opacity-20" />
             </div>
             
             {/* Fake Performance Chart Mock */}
             <div className="h-48 w-full flex items-end gap-3 px-2 pt-10">
                {[40, 70, 45, 90, 65, 80, 100, 85, 95].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-xl bg-brand-neon/10 border-t border-brand-neon/40 relative group cursor-help transition-all hover:bg-brand-neon/30" style={{ height: `${h}%` }}>
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-neon text-black text-[9px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        +{h}%
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-card rounded-[3.5rem] p-12 space-y-10 relative overflow-hidden border-brand-cyan/10">
              <div className="space-y-4">
                 <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Próximos Passos</h3>
                 <div className="space-y-4">
                    {[
                      { icon: Target, text: "Revisar leads da semana", color: "text-brand-neon" },
                      { icon: Clock, text: "Aprovar posts agendados", color: "text-brand-cyan" },
                      { icon: CheckCircle2, text: "Relatório de performance", color: "text-brand-purple" }
                    ].map((item, i) => (
                       <div key={i} className="flex items-center gap-4 group cursor-pointer">
                          <div className={`p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-all ${item.color}`}>
                             <item.icon className="w-4 h-4" />
                          </div>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-white transition-all">{item.text}</p>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-6 bg-brand-neon/5 border border-brand-neon/20 rounded-3xl space-y-3">
                 <p className="text-[9px] font-black text-brand-neon uppercase tracking-widest">Sistema Atualizado</p>
                 <p className="text-[11px] text-gray-400 leading-relaxed italic">"O método Centumilia automatiza sua prospecção para que você foque no fechamento."</p>
              </div>
          </div>
       </div>
    </div>
  );
}
