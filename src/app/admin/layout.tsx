'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  LayoutDashboard, 
  PieChart, 
  LogOut, 
  Instagram, 
  Zap,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
       await fetch('/api/auth', { method: 'DELETE' });
       router.push('/admin/login');
    } catch (_) {
       router.push('/admin/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'CRM (Vendas)', icon: PieChart, href: '/admin/crm' },
    { name: 'Demandas (Op.)', icon: Briefcase, href: '/admin/tasks' },
    { name: 'Pode Postar?', icon: Instagram, href: '/admin/content' },
    { name: 'Clientes Ativos', icon: Users, href: '/admin/clients' },
  ];

  return (
    <div className="flex min-h-screen bg-brand-darker selection:bg-brand-neon selection:text-black">
      {/* Sidebar Elite */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/5 bg-brand-darker p-8 lg:flex z-50">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-neon shadow-[0_0_20px_rgba(1,250,164,0.3)]">
            <Zap className="h-5 w-5 text-black fill-black" />
          </div>
          <div>
            <span className="block text-sm font-black uppercase tracking-[0.2em] italic">Centumilia</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600">Growth Agency</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 rounded-2xl px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-neon text-black shadow-[0_0_25px_rgba(1,250,164,0.15)]' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-brand-neon'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 hover:text-brand-neon transition-all"
          >
            <LogOut className="h-4 w-4" /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64">
        {/* Top Glow Decorator */}
        <div className="pointer-events-none absolute left-64 top-0 h-[40vh] w-[40vw] bg-brand-neon/5 blur-[120px] rounded-full"></div>
        
        <div className="relative mx-auto max-w-7xl px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
           {children}
        </div>
      </main>

      {/* Mobile Nav (Bottom) */}
      <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[2rem] border border-white/10 bg-black/80 p-2 backdrop-blur-2xl lg:hidden shadow-2xl">
        {menuItems.slice(1).map((item) => {
           const isActive = pathname === item.href;
           return (
             <Link key={item.name} href={item.href} className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-brand-neon text-black' : 'text-gray-500'}`}>
                <item.icon className="h-5 w-5" />
             </Link>
           );
        })}
      </nav>
    </div>
  );
}
