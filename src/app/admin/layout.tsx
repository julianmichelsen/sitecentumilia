'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Briefcase, 
  CheckSquare, 
  FileCheck, 
  Settings, 
  Menu, X, 
  LogOut,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Comercial (CRM)', icon: Target, isHeader: true },
    { label: 'Funil de Vendas', icon: Target, path: '/admin/crm' },
    { label: 'Clientes Ativos', icon: Users, path: '/admin/clients' },
    { label: 'Operação', icon: Briefcase, isHeader: true },
    { label: 'Painel de Demandas', icon: CheckSquare, path: '/admin/tasks' },
    { label: 'Aprovação de Posts', icon: FileCheck, path: '/admin/content' },
    { label: 'Site Institucional', icon: Briefcase, isHeader: true },
    { label: 'Blog', icon: Briefcase, path: '/admin/blog' },
    { label: 'Cases', icon: Briefcase, path: '/admin/cases' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar Desktop */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#111] border-r border-[#222] transition-all duration-300 hidden md:flex flex-col sticky top-0 h-screen`}>
        <div className="p-6 flex items-center justify-between border-b border-[#222]">
          {isSidebarOpen ? <h1 className="text-xl font-black text-brand-neon tracking-tighter">CENTUMILIA</h1> : <span className="text-brand-neon font-black">C.</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-white">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item, idx) => {
            if (item.isHeader) {
              return isSidebarOpen ? (
                <div key={idx} className="px-3 pt-6 pb-2 text-[10px] uppercase font-bold text-gray-600 tracking-widest leading-none">
                  {item.label}
                </div>
              ) : <div key={idx} className="h-px bg-[#222] my-4 mx-2" />;
            }

            const isActive = pathname === item.path;
            return (
              <Link key={idx} href={item.path || '#'} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive ? 'bg-brand-neon text-black' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}>
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="text-sm font-bold flex-1">{item.label}</span>}
                {isSidebarOpen && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222]">
          <Link href="/admin/login" className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-bold">Sair do Painel</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
