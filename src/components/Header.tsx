"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Soluções", href: "/#solucoes" },
    { name: "Metodologia", href: "/#metodologia" },
    { name: "Cases", href: "/cases" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? 'bg-brand-darker/90 backdrop-blur-xl border-brand-dark py-2 shadow-2xl' : 'bg-transparent border-transparent py-4'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/logo.png" 
            alt="Centumilia" 
            width={180} 
            height={40} 
            className="w-auto h-8 md:h-10 transition-transform group-hover:scale-105" 
            priority
          />
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-bold tracking-wide transition-all relative group py-2 
                ${pathname === link.href ? 'text-brand-neon' : 'text-gray-400 hover:text-white'}`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-neon transition-all duration-300 
                ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
          <Link 
            href="/contato" 
            className="ml-4 inline-flex h-11 items-center justify-center rounded-full bg-transparent border-2 border-brand-neon/30 px-6 py-2 text-sm font-black text-brand-neon transition-all hover:bg-brand-neon hover:text-brand-darker hover:border-brand-neon hover:shadow-[0_0_15px_rgba(1,250,164,0.3)] focus-visible:outline-none"
          >
            Falar com Especialista
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-brand-neon transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed inset-x-0 top-[72px] bg-brand-dark/95 backdrop-blur-2xl border-b border-brand-dark overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col p-6 space-y-5">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className="text-lg font-bold text-gray-300 hover:text-brand-neon flex items-center justify-between group"
            >
              {link.name}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          ))}
          <Link 
            href="/contato" 
            onClick={() => setIsOpen(false)}
            className="inline-flex h-14 items-center justify-center rounded-xl bg-brand-neon px-6 text-base font-black text-brand-darker shadow-lg active:scale-95 transition-transform"
          >
            Falar com Especialista
          </Link>
        </nav>
      </div>
    </header>
  );
}
