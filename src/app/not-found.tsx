import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-brand-darker text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/bg-patterns.svg')] opacity-10"></div>
      <div className="relative z-10 max-w-md space-y-6">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-neon to-brand-cyan">404</h1>
        <h2 className="text-2xl font-bold text-white">Oops. Essa página não existe.</h2>
        <p className="text-gray-400">
          Parece que você acessou uma página fora do nosso funil. Vamos te levar de volta para a máquina de vendas principal.
        </p>
        <Link 
          href="/" 
          className="inline-flex h-12 items-center justify-center rounded-md bg-brand-neon px-8 text-sm font-bold text-brand-darker transition-colors hover:bg-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a Home
        </Link>
      </div>
    </main>
  );
}
