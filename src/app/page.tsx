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
  Users,
  Play,
  Zap,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getAllPosts } from "@/lib/markdown";
import { getLogos, getTestimonials, getConfig } from "@/lib/content";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const cases = await getAllPosts("cases");
  // Filtrando mocks e garantindo Asqui Imports no topo
  const realCases = cases
    .filter((c: any) => c.title !== "TESTE11" && !c.title.includes("Lorem"))
    .sort((a: any, b: any) => a.title === "Asqui Imports" ? -1 : 1);
  
  const latestCases = realCases.slice(0, 3);
  const logos = (await getLogos()).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  const config = await getConfig();

  // Depoimentos Dinâmicos do Supabase (com reserva se vazio)
  const dbTestimonials = await getTestimonials();
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : [
    { id: '1', author: 'Asqui Imports', role: 'Importação B2B', quote: 'A Centumilia organizou nossa demanda de forma previsível. O trabalho focado em tráfego e posicionamento profissionalizou nossa captação.', rating: 5 },
    { id: '2', author: 'Unius Logística', role: 'Estratégia & Operação', quote: 'Ter a operação comercial alinhada com as campanhas faz toda a diferença. Não são apenas posts, é estratégia focada em contatos reais.', rating: 5 },
    { id: '3', author: 'Invista Imóveis', role: 'Setor Imobiliário', quote: 'Uma agência que entende que o resultado final tem que ser faturamento, otimizando nossos recursos para gerar leads qualificados.', rating: 5 }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-brand-darker relative overflow-hidden">
      {/* Animated Mesh Gradients Background (Organic Life) */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30 select-none">
         <div className="gradient-blob w-[600px] h-[600px] bg-brand-neon top-[-10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
         <div className="gradient-blob w-[700px] h-[700px] bg-brand-purple bottom-[-20%] left-[-10%]" style={{ animationDelay: '-2s' }}></div>
         <div className="gradient-blob w-[500px] h-[500px] bg-brand-cyan top-[30%] left-[20%] blur-[150px]" style={{ animationDelay: '-4s' }}></div>
      </div>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative flex min-h-[100vh] flex-col items-center justify-center px-4 py-24 text-center">
          <div className="container mx-auto max-w-5xl space-y-10">
            <Reveal className="mx-auto w-fit px-5 py-2 bg-white/5 border border-white/10 rounded-full glass-elite">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-neon animate-pulse">
                 {config.tagline || "Marketing com método. Crescimento com direção."}
               </span>
            </Reveal>
            
            <Reveal className="stagger-1 w-full overflow-visible relative">
               {/* AJUSTE DESIGN ELITE: Fonte equilibrada, balanceamento de texto e remoção de quebras manuais jankies */}
               <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl lg:text-[5.5rem] italic uppercase leading-[1.05] mb-12 drop-shadow-2xl py-10 overflow-visible [text-wrap:balance]">
                 Pare de depender do <span className="text-gradient pr-4">improviso.</span>
                 <span className="block md:inline-block md:ml-4">Comece a viver de <span className="text-gradient pr-4" style={{ animationDelay: '-2s' }}>processo.</span></span>
               </h1>
            </Reveal>

            <Reveal className="stagger-2">
               <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-2xl font-medium leading-relaxed">
                 A Centumilia transforma seu marketing em um sistema previsível de aquisição, posicionamento e crescimento. Menos postagens sem rumo. Mais direção estratégica e vendas.
               </p>
            </Reveal>

            <Reveal className="flex flex-col items-center justify-center gap-6 pt-12 sm:flex-row stagger-3">
              <Link href="/contato" className="btn-epic-neon flex items-center gap-3">
                Solicitar Diagnóstico <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#metodologia" className="btn-epic glass-elite flex items-center gap-3 hover:bg-white/10">
                <Play className="w-4 h-4 fill-white" /> Ver Metodologia
              </Link>
            </Reveal>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
             <div className="w-0.5 h-12 bg-white rounded-full"></div>
          </div>
        </section>

        {/* Autoridade e Posicionamento */}
        <section className="w-full py-32 bg-transparent relative border-b border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <Reveal className="space-y-8">
                <h2 className="text-4xl font-black md:text-6xl text-white italic tracking-tighter uppercase leading-none">Mais do que uma agência. <br/>Uma parceira de <span className="text-brand-cyan">crescimento.</span></h2>
                <p className="text-gray-400 text-xl leading-relaxed">
                  Se você busca apenas alguém para "fazer posts", a Centumilia não é para você.
                  Nós entramos para clarear o caminho, organizar a operação comercial e ajudar seu negócio a sair da estagnação.
                </p>
                <ul className="space-y-6">
                  {[
                    "Transformamos marketing em engenharia de vendas.",
                    "Não prometemos curtidas. Focamos em leads e lucro.",
                    "Acompanhamos todo o seu funil, não só o anúncio."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-gray-300 group">
                      <CheckCircle2 className="h-6 w-6 text-brand-neon mr-4 mt-1 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="glass-elite rounded-[3.5rem] p-12 border border-white/5 relative overflow-hidden stagger-2">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                 <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-6">A estagnação acaba aqui.</h3>
                 <p className="text-gray-400 text-lg mb-10 relative z-10 leading-relaxed italic">"Agende uma reunião de diagnóstico. Em apenas 30 minutos nós vamos entender como sua empresa vende, identificar os maiores gargalos e propor um modelo previsível de receita."</p>
                 <Link href="/contato" className="btn-epic-neon py-3 px-8 text-[11px] tracking-[0.2em] inline-flex items-center">
                    QUERO O DIAGNÓSTICO GRATUITO <ArrowRight className="ml-3 h-4 w-4" />
                 </Link>
              </Reveal>
            </div>
            
            {/* Logos de Clientes Atendidos - AJUSTE: Copy Ética e Opacidade */}
            <Reveal className="mt-40 stagger-3">
              <p className="text-center text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-16">Marcas que já passaram pelo nosso método</p>
              <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                {logos.length > 0 ? logos.map((client: any, i: number) => (
                  <div key={i} className="relative h-12 w-48 flex items-center justify-center hover:scale-110 transition-transform">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )) : (
                  <p className="col-span-5 text-gray-600 text-[10px] uppercase font-black tracking-widest italic animate-pulse">Atualizando Autoridade...</p>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Metodologia CENTUM Overview */}
        <section id="metodologia" className="w-full py-40 bg-transparent relative border-b border-white/5 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <Reveal className="flex flex-col items-center justify-center space-y-6 text-center mb-24">
              <span className="text-brand-purple font-black tracking-[0.5em] uppercase text-[10px]">O Nosso framework</span>
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">Metodologia <br/><span className="text-gradient">CENTUM.</span></h2>
              <p className="max-w-[800px] text-gray-400 text-xl font-medium leading-relaxed">
                Processo de ponta a ponta. Como atuamos para acelerar a sua aquisição de clientes e organizar a sua máquina de vendas.
              </p>
            </Reveal>
            
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {[
                { letter: "C", title: "Captar", desc: "Atrair atenção, gerar leads qualificados e abrir novas oportunidades através de canais de performance.", icon: <Search className="h-7 w-7 text-brand-neon" /> },
                { letter: "E", title: "Entender", desc: "Diagnosticar a jornada atual do cliente, identificar os gargalos do funil e entender a operação da empresa.", icon: <Activity className="h-7 w-7 text-brand-cyan" /> },
                { letter: "N", title: "Nivelar", desc: "Alinhar expectativas, meta e direção. Planejar estrategicamente onde alocar orçamento.", icon: <Layers className="h-7 w-7 text-brand-blue" /> },
                { letter: "T", title: "Trafegar", desc: "Executar operação de marketing. Anúncios, criativos, réguas de relacionamento e automação.", icon: <Rocket className="h-7 w-7 text-brand-purple" /> },
                { letter: "U", title: "Upscale", desc: "Crescer com inteligência. Acelerar as campanhas validadas e otimizar aquilo que já funciona bem.", icon: <Target className="h-7 w-7 text-brand-neon" /> },
                { letter: "M", title: "Medir", desc: "Tomada de decisão baseada em dados reais e fechamento do ciclo de melhoria contínua.", icon: <BarChart className="h-7 w-7 text-brand-cyan" /> }
              ].map((step, i) => (
                <Reveal key={i} className={`stagger-${(i%3)+1}`}>
                   <div className="glass-elite p-10 rounded-[3rem] h-full flex flex-col space-y-6 hover:border-brand-neon/30 transition-all duration-500 group relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-10 text-[12rem] font-black text-white/[0.02] group-hover:text-brand-neon/5 transition-colors z-0 pointer-events-none select-none italic leading-none">
                        {step.letter}
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl w-fit border border-white/5 relative z-10 group-hover:scale-110 transition-transform group-hover:bg-brand-neon/10 group-hover:border-brand-neon/20">
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter relative z-10">{step.title}</h3>
                      <p className="text-gray-400 text-base font-medium leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">{step.desc}</p>
                   </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Nossas Soluções */}
        <section id="solucoes" className="w-full py-40 border-b border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <Reveal className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
               <div className="max-w-2xl space-y-6">
                  <h2 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none">Nossas <br/><span className="text-gradient">Soluções.</span></h2>
                  <p className="text-gray-400 text-xl font-medium">Soluções modulares focadas estritamente no crescimento do funil da sua empresa.</p>
               </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { title: "Geração de Demanda", icon: <Users className="w-7 h-7" />, color: "brand-neon", desc: "Campanhas intensivas de tráfego pago (Meta, Google, LinkedIn) e funis de captação B2B/B2C para gerar conversas qualificadas todos os dias." },
                 { title: "Conteúdo e Posicionamento", icon: <MessageCircle className="w-7 h-7" />, color: "brand-cyan", desc: "Reels, copy e design focados em conversão. Criamos o seu ecossistema digital com o formato exato que ressoa com sua audiência." },
                 { title: "Setup Comercial", icon: <Target className="w-7 h-7" />, color: "brand-purple", desc: "Landing pages ultravelozes, estruturação de CRM para vendas limpas e Scripts de atendimento para você fechar os leads gerados." }
               ].map((item, i) => (
                 <Reveal key={i} className={`stagger-${i+1}`}>
                    <div className="glass-elite p-10 rounded-[3.5rem] flex flex-col items-start gap-8 hover:border-white/20 transition-all h-full group">
                       <div className={`w-14 h-14 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color} border border-${item.color}/20 group-hover:scale-110 transition-transform`}>
                          {item.icon}
                       </div>
                       <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">{item.title}</h3>
                       <p className="text-gray-400 text-base leading-relaxed flex-1">{item.desc}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
          </div>
        </section>

        {/* Cases de Sucesso */}
        <section id="cases" className="w-full py-40 border-b border-white/5">
          <div className="container px-4 md:px-6 mx-auto space-y-24">
            <Reveal className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none">Cases de <br/><span className="text-gradient">Sucesso.</span></h2>
                <p className="text-gray-400 text-lg font-medium tracking-[0.2em] uppercase">Resultados gerados pelo método</p>
              </div>
              <Link href="/cases" className="btn-epic glass-elite">VER TODOS OS CASES</Link>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {latestCases.map((post: any, i: number) => (
                <Reveal key={post.slug} className={`stagger-${i+1}`}>
                  <Link href={`/cases/${post.slug}`} className="group flex flex-col glass-elite rounded-[3rem] overflow-hidden hover:border-brand-neon/40 transition-all h-full">
                    <div className="relative h-64 w-full bg-brand-dark/50 overflow-hidden">
                      <Image src={post.coverImage || post.cover_image || ""} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      {post.segment && (
                         <div className="absolute top-6 left-6 glass-elite border-white/10 text-[9px] font-black uppercase text-white px-3 py-1 rounded-full tracking-widest">
                            {post.segment}
                         </div>
                      )}
                    </div>
                    <div className="p-10 flex flex-col flex-1 space-y-4">
                      <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-tight group-hover:text-brand-neon transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 italic">"{post.excerpt}"</p>
                      <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-neon group-hover:translate-x-4 transition-transform">
                        Estudo de Caso <ArrowRight className="ml-3 w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Prova Social - Depoimentos Reais vindos do Supabase */}
        <section className="py-40 bg-black/40 relative border-b border-white/5">
           <div className="container mx-auto px-4 space-y-24 relative z-10 text-center">
              <Reveal>
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">O que dizem os <br/><span className="text-gradient">Sócios.</span></h2>
                 <p className="text-gray-600 uppercase font-black text-[10px] tracking-[0.5em] mt-6">Nossa autoridade é medida pelo sucesso deles</p>
              </Reveal>

              <div className="grid gap-10 md:grid-cols-3">
                 {testimonials.map((t: any, i: number) => (
                    <Reveal key={t.id} className={`stagger-${i+1}`}>
                       <div className="glass-elite p-12 rounded-[4rem] space-y-8 hover:border-brand-neon/20 transition-all group h-full flex flex-col justify-between text-left">
                          <div className="text-brand-neon flex gap-1">
                             {[...Array(t.rating || 5)].map((_, star) => <Zap key={star} className="w-3 h-3 fill-brand-neon" />)}
                          </div>
                          <p className="text-gray-300 italic text-lg leading-relaxed font-medium">"{t.quote}"</p>
                          <div className="flex items-center gap-5 pt-10 border-t border-white/5">
                             <div className="w-14 h-14 rounded-2xl bg-brand-neon/10 flex items-center justify-center text-brand-neon font-black text-xl border border-brand-neon/20">{t.author.charAt(0)}</div>
                             <div>
                                <p className="text-white font-black text-sm uppercase tracking-[0.2em]">{t.author}</p>
                                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1 italic">{t.role}</p>
                             </div>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* Escola Centum - Refinada com "Aura" Roxa */}
        <section className="py-32 bg-transparent relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-purple/5 blur-[150px] -z-10"></div>
           <div className="container mx-auto px-4">
              <Reveal className="glass-elite rounded-[4rem] p-12 md:p-20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group hover:border-brand-purple/30 transition-all duration-700 bg-black/40">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/5 blur-[100px] group-hover:bg-brand-purple/20 transition-all rounded-full translate-x-1/2 -translate-y-1/2"></div>
                 <div className="space-y-6 text-center md:text-left relative z-10">
                    <div className="flex items-center gap-3 w-fit mx-auto md:mx-0 bg-brand-purple/10 px-4 py-2 rounded-full border border-brand-purple/20">
                       <BookOpen className="w-4 h-4 text-brand-purple" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Projeto Educacional</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">Conheça também a <br/><span className="text-brand-purple">Escola Centum.</span></h2>
                    <p className="max-w-xl text-gray-400 text-lg leading-relaxed">Nossa frente educacional e ecossistema de negócios para empreendedores que desejam dominar o próprio crescimento e parar de depender do improviso.</p>
                 </div>
                 <Link href="#" className="btn-epic glass-elite py-5 px-10 text-[11px] tracking-[0.3em] font-black flex items-center gap-3 hover:bg-brand-purple hover:text-white transition-all relative z-10 group-hover:scale-105 border-white/5 active:scale-95 shadow-2xl">
                    SABER MAIS <ArrowUpRight className="w-4 h-4" />
                 </Link>
              </Reveal>
           </div>
        </section>

        {/* CTA Final */}
        <section className="relative py-40 px-4 overflow-hidden text-center">
           <Reveal className="container mx-auto max-w-5xl glass-elite rounded-[4rem] p-12 md:p-24 flex flex-col items-center justify-center space-y-12 relative group shadow-brand-neon/10 border-brand-neon/20 border">
              <div className="absolute inset-0 bg-brand-neon/10 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]"></div>
              <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8] relative z-10 mb-4 transition-transform group-hover:scale-105 duration-700">
                A HORA DA <br/> <span className="text-gradient">ESCALA</span> É AGORA.
              </h2>
              <p className="text-gray-400 text-xl font-medium relative z-10">Agende uma conversa estratégica com nossos especialistas e descubra como o método CENTUM pode funcionar para você.</p>
              <div className="relative z-10 pt-10">
                 <Link href="/contato" className="btn-epic-neon scale-150">Falar com Especialista</Link>
              </div>
           </Reveal>
        </section>
      </main>
    </div>
  );
}
