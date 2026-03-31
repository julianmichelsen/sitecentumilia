'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Cases", href: "/#cases" },
    { name: "Metodologia", href: "/metodologia" },
    { name: "Blog", href: "/blog" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className={`container mx-auto px-6 h-16 flex items-center justify-between rounded-[2rem] transition-all duration-700 border border-white/5 ${scrolled ? 'glass-elite bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] mx-auto w-[95%] md:w-[90%]' : 'bg-transparent border-transparent'}`}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-neon rounded-xl flex items-center justify-center text-black shadow-brand-neon/20 transition-all group-hover:scale-110">
             <Zap className="w-5 h-5 fill-black" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-white group-hover:text-brand-neon transition-colors">Centumilia.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-brand-neon transition-all hover:translate-y-[-1px]"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contato" className="btn-epic-neon py-2.5 px-6 scale-90">Diagnóstico</Link>
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[-1] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-10 animate-in fade-in duration-500">
           {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black italic uppercase tracking-tighter text-white hover:text-brand-neon"
              >
                {link.name}
              </Link>
           ))}
           <Link href="/contato" onClick={() => setIsOpen(false)} className="btn-epic-neon mt-10">Falar com Especialista</Link>
        </div>
      )}
    </header>
  );
}
