import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-brand-dark bg-brand-darker pt-12 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Image 
              src="/logo.png" 
              alt="Logo Centumilia" 
              width={200} 
              height={40} 
              className="w-auto h-8 brightness-0 invert opacity-90" 
            />
            <p className="max-w-xs text-sm text-gray-400">
              Transformamos marketing em um sistema previsível de crescimento. Mais que tráfego, entregamos retorno real.
            </p>
            <div className="flex gap-4">
              {/* Media Social Links Plaholders */}
              <Link href="#" className="text-gray-400 hover:text-brand-neon transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brand-purple transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Agência</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-brand-neon transition-colors">Home</Link></li>
              <li><Link href="/#metodologia" className="text-gray-400 hover:text-brand-neon transition-colors">Metodologia</Link></li>
              <li><Link href="/contato" className="text-gray-400 hover:text-brand-neon transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#solucoes" className="text-gray-400 hover:text-brand-neon transition-colors">Geração de Demanda</Link></li>
              <li><Link href="/#solucoes" className="text-gray-400 hover:text-brand-neon transition-colors">Conteúdo & Copy</Link></li>
              <li><Link href="/#solucoes" className="text-gray-400 hover:text-brand-neon transition-colors">Setup Comercial</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Conteúdo</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cases" className="text-gray-400 hover:text-brand-neon transition-colors">Cases de Sucesso</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-brand-neon transition-colors">Blog Insights</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-brand-dark pt-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Centumilia. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/politica-de-privacidade" className="text-xs text-gray-500 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-xs text-gray-500 hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
