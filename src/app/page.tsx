import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  BarChart, 
  Rocket, 
  Target,
  Search,
  Activity,
  Layers,
  MessageCircle,
  Star,
  CheckCircle2,
  Users
} from "lucide-react";
import { getAllPosts } from "@/lib/markdown";
import { getLogos, getTestimonials, getConfig } from "@/lib/content";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latestCases = (await getAllPosts("cases")).slice(0, 3);
  const latestBlog = (await getAllPosts("blog")).slice(0, 3);
  const logos = (await getLogos()).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  const testimonials = await getTestimonials();
  const config = await getConfig();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="w-full relative pt-32 pb-24 overflow-hidden flex items-center justify-center border-b border-brand-dark">
        <div className="absolute inset-0 bg-gradient-radial from-brand-neon/5 to-transparent opacity-50 z-0"></div>
        <div className="container px-4 md:px-6 relative z-10 mx-auto text-center space-y-8 max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-brand-neon/30 bg-brand-neon/10 px-4 py-1.5 text-sm font-medium text-brand-neon mx-auto">
            <span className="flex w-2 h-2 rounded-full bg-brand-neon mr-2 animate-pulse"></span>
            {config.tagline || "Marketing com método. Crescimento com direção."}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight text-white">
            Pare de depender do <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-cyan">improviso</span>.<br />
            Comece a viver de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">processo</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-balance">
            A Centumilia transforma seu marketing em um sistema previsível de aquisição, posicionamento e crescimento. Menos postagens sem rumo. Mais direção estratégica e vendas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/contato" 
              className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-md bg-brand-neon px-8 text-base font-bold text-brand-darker transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(1,250,164,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon"
            >
              Solicitar Diagnóstico
            </Link>
            <Link 
              href="#metodologia" 
              className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-md border border-brand-dark bg-brand-darker/50 px-8 text-base font-medium text-white transition-all duration-300 hover:bg-brand-dark hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan group"
            >
              Ver Metodologia
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Autoridade e Posicionamento */}
      <section className="w-full py-20 bg-brand-darker relative border-b border-brand-dark">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold md:text-4xl text-white">Mais do que uma agência. <br/>Uma parceira de <span className="text-brand-cyan">crescimento.</span></h2>
              <p className="text-gray-400 text-lg">
                Se você busca apenas alguém para "fazer posts", a Centumilia não é para você.
                Nós entramos para clarear o caminho, organizar a operação comercial e ajudar seu negócio a sair da estagnação.
              </p>
              <ul className="space-y-3">
                {[
                  "Transformamos marketing em engenharia de vendas.",
                  "Não prometemos curtidas. Focamos em leads e lucro.",
                  "Acompanhamos todo o seu funil, não só o anúncio."
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-brand-neon mr-3 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-dark rounded-2xl p-8 border border-brand-neon/20 shadow-[0_0_40px_rgba(0,222,254,0.05)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <h3 className="text-2xl font-bold text-white mb-4">A estagnação acaba aqui.</h3>
               <p className="text-gray-400 mb-6 relative z-10">Agende uma reunião de diagnóstico. Em apenas 30 minutos nós vamos entender como sua empresa vende, identificar os maiores gargalos e propor um modelo previsível de receita.</p>
               <Link href="/contato" className="text-brand-neon font-medium inline-flex items-center hover:text-white transition-colors">
                  Quero o diagnóstico gratuito <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
            </div>
          </div>
          
          {/* Logos de Clientes Atendidos */}
          <div className="mt-24">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-12">Empresas que confiam na Centumilia</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              {logos.length > 0 ? logos.map((client: any, i: number) => (
                <div key={i} className="relative h-12 w-32 flex items-center justify-center">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )) : (
                <p className="col-span-5 text-gray-600 text-xs italic">Nenhum parceiro cadastrado.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Metodologia CENTUM Overview */}
      <section id="metodologia" className="w-full py-24 bg-brand-darker relative border-b border-brand-dark overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-neon/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <span className="text-brand-purple font-semibold tracking-wider uppercase text-sm">O Nosso framework</span>
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl text-white">Metodologia <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-cyan">CENTUM</span></h2>
            <p className="max-w-[800px] text-gray-400 md:text-xl text-balance">
              Processo de ponta a ponta. Como atuamos para acelerar a sua aquisição de clientes e organizar a sua máquina de vendas.
            </p>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {[
              { letter: "C", title: "Captar", desc: "Atrair atenção, gerar leads qualificados e abrir novas oportunidades através de canais de performance.", icon: <Search className="h-6 w-6 text-brand-neon" /> },
              { letter: "E", title: "Entender", desc: "Diagnosticar a jornada atual do cliente, identificar os gargalos do funil e entender a operação da empresa.", icon: <Activity className="h-6 w-6 text-brand-cyan" /> },
              { letter: "N", title: "Nivelar", desc: "Alinhar expectativas, meta e direção. Planejar estrategicamente onde alocar orçamento.", icon: <Layers className="h-6 w-6 text-brand-blue" /> },
              { letter: "T", title: "Trafegar", desc: "Executar operação de marketing. Anúncios, criativos, réguas de relacionamento e automação.", icon: <Rocket className="h-6 w-6 text-brand-purple" /> },
              { letter: "U", title: "Upscale", desc: "Crescer com inteligência. Acelerar as campanhas validadas e otimizar aquilo que já funciona bem.", icon: <Target className="h-6 w-6 text-brand-neon" /> },
              { letter: "M", title: "Medir", desc: "Tomada de decisão baseada em dados reais e fechamento do ciclo de melhoria contínua.", icon: <BarChart className="h-6 w-6 text-brand-cyan" /> }
            ].map((step, i) => (
              <div key={i} className="flex flex-col p-6 space-y-4 rounded-xl border border-brand-dark bg-[#111] hover:bg-[#161616] hover:border-brand-dark/50 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute -right-4 -bottom-8 text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors z-0 pointer-events-none select-none">
                  {step.letter}
                </div>
                <div className="p-3 bg-brand-darker rounded-lg w-fit border border-brand-dark relative z-10 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">{step.title}</h3>
                <p className="text-gray-400 text-sm relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços em Blocos Comerciais */}
      <section id="solucoes" className="w-full py-24 bg-brand-darker border-b border-brand-dark">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-16 md:flex md:items-end md:justify-between">
             <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl font-bold md:text-5xl text-white">Nossas Soluções</h2>
                <p className="text-gray-400 text-lg">Soluções modulares focadas estritamente no crescimento do funil da sua empresa.</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-[#111] border border-brand-dark p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-brand-neon/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-neon/10 flex items-center justify-center text-brand-neon">
                   <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Geração de Demanda</h3>
                <p className="text-gray-400 text-sm flex-1">Campanhas intensivas de tráfego pago (Meta, Google, LinkedIn) e funis de captação B2B/B2C para gerar conversas qualificadas todos os dias.</p>
             </div>
             <div className="bg-[#111] border border-brand-dark p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-brand-cyan/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                   <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Conteúdo e Posicionamento</h3>
                <p className="text-gray-400 text-sm flex-1">Reels, copy e design focados em conversão. Criamos o seu ecossistema digital com o formato exato que ressoa com sua audiência.</p>
             </div>
             <div className="bg-[#111] border border-brand-dark p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-brand-purple/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                   <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Setup Comercial</h3>
                <p className="text-gray-400 text-sm flex-1">Landing pages ultravelozes, estruturação de CRM para vendas limpas e Scripts de atendimento para você fechar os leads gerados.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Cases Recentes */}
      <section className="w-full py-24 bg-brand-darker relative border-b border-brand-dark">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold md:text-4xl text-white">Cases de Sucesso</h2>
              <p className="text-gray-400">Comprovadamente gerando resultados.</p>
            </div>
            <Link href="/cases" className="inline-flex items-center text-brand-cyan hover:text-white transition-colors group">
              Ver todos os cases <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestCases.length > 0 ? latestCases.map((post) => (
              <Link href={`/cases/${post.slug}`} key={post.slug} className="group flex flex-col bg-[#111] border border-brand-dark rounded-2xl overflow-hidden hover:border-brand-neon/50 transition-all">
                <div className="relative h-48 w-full bg-brand-dark/50 overflow-hidden">
                  {post.coverImage && post.coverImage.trim() !== "" ? (
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-brand-darker font-bold text-4xl">CASE</div>
                  )}
                  {post.segment && (
                     <div className="absolute top-4 left-4 bg-brand-darker/80 backdrop-blur-sm border border-brand-dark text-xs text-white px-2 py-1 rounded">
                        {post.segment}
                     </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-400 flex-1 line-clamp-3 mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center text-sm font-medium text-brand-cyan mt-auto">
                    Ler Estudo de Caso <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </div>
              </Link>
            )) : (
              <p className="col-span-3 text-center text-gray-400 py-12">Nenhum case cadastrado ainda.</p>
            )}
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="w-full py-24 bg-brand-darker border-b border-brand-dark">
         <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold md:text-4xl text-white text-center mb-12">Quem confia no nosso método</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {testimonials.length > 0 ? testimonials.map((t: any, i: number) => (
                <div key={i} className="p-8 border border-brand-dark rounded-2xl bg-[#111] flex flex-col">
                  <div className="flex text-brand-neon mb-4">
                     {[1,2,3,4,5].map(star => <Star key={star} className={`w-4 h-4 ${t.rating >= star ? 'fill-current' : 'opacity-20'}`} />)}
                  </div>
                  <p className="text-gray-300 mb-6 flex-1 italic text-sm leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center border border-brand-darker font-bold text-gray-400 text-xs">
                        {t.author.charAt(0)}
                     </div>
                     <div>
                        <p className="text-white font-bold text-sm">{t.author}</p>
                        <p className="text-gray-500 text-xs">{t.role}</p>
                     </div>
                  </div>
                </div>
               )) : (
                <p className="col-span-3 text-center text-gray-600 py-12 italic">Nenhum depoimento disponível.</p>
               )}
            </div>
         </div>
      </section>

      {/* Blog Insights */}
      <section className="w-full py-24 bg-brand-darker border-b border-brand-dark">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold md:text-4xl text-white">Insights & Estratégia</h2>
              <p className="text-gray-400">Artigos focados em growth, aquisição e marketing.</p>
            </div>
            <Link href="/blog" className="inline-flex items-center text-brand-purple hover:text-white transition-colors group">
              Ler o Blog <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestBlog.length > 0 ? latestBlog.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col space-y-4">
                <div className="relative h-48 w-full rounded-2xl bg-brand-dark overflow-hidden">
                  {post.coverImage && post.coverImage.trim() !== "" && (
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-brand-purple">ARTIGO</span>
                     <span className="text-xs text-gray-500">• {new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            )) : (
               <p className="col-span-3 text-center text-gray-400 py-12">Nenhum artigo cadastrado ainda.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="w-full py-32 bg-brand-neon relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('/bg-patterns.svg')] opacity-10"></div>
         <div className="container px-4 md:px-6 relative z-10 mx-auto text-center max-w-3xl space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-brand-darker tracking-tight text-balance">
               Pronto para transformar sua comunicação em vendas?
            </h2>
            <p className="text-lg text-brand-darker/80 font-medium text-balance">
               Agende uma conversa estratégica com nossos especialistas e descubra como o método CENTUM pode funcionar para você.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
               <Link 
                  href="/contato" 
                  className="inline-flex h-14 items-center justify-center rounded-md bg-brand-darker px-8 text-base font-bold text-white transition-all duration-300 hover:bg-black focus-visible:outline-none shadow-lg"
               >
                  Falar com Especialista
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
