"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-dark bg-brand-darker/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Centumilia Logo" 
            width={180} 
            height={40} 
            className="w-auto h-8" 
            priority
          />
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/#solucoes" className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
            Soluções
          </Link>
          <Link href="/#metodologia" className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
            Metodologia
          </Link>
          <Link href="/cases" className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
            Cases
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
            Blog
          </Link>
          <Link 
            href="/contato" 
            className="ml-4 inline-flex h-9 items-center justify-center rounded-md bg-transparent border border-brand-neon px-4 py-2 text-sm font-medium text-brand-neon transition-colors hover:bg-brand-neon hover:text-brand-darker focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
          >
            Falar com Especialista
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-brand-dark">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/#solucoes" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
              Soluções
            </Link>
            <Link href="/#metodologia" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
              Metodologia
            </Link>
            <Link href="/cases" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
              Cases
            </Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-300 hover:text-brand-neon transition-colors">
              Blog
            </Link>
            <Link 
              href="/contato" 
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md bg-brand-neon px-4 text-sm font-bold text-brand-darker"
            >
              Falar com Especialista
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
