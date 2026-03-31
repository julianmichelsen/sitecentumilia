'use client';

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle } from "lucide-react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    
    // Simulação de envio (já que ainda não configuramos o serviço de e-mail)
    setTimeout(() => {
      setCarregando(false);
      setEnviado(true);
    }, 1500);
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="w-full py-24 border-b border-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-cyan/5 to-transparent opacity-40 z-0"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl space-y-6">
          <span className="text-brand-cyan font-semibold tracking-wider uppercase text-sm">Contato</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Vamos construir sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-cyan">máquina de vendas?</span>
          </h1>
          <p className="text-lg text-gray-400 text-balance">
            Agende um diagnóstico gratuito. Em 30 minutos, entendemos o cenário do seu negócio e mostramos onde está o maior potencial de crescimento.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-20 bg-brand-darker">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Form */}
            <div className="bg-[#111] border border-brand-dark rounded-2xl p-8 md:p-10 space-y-6 relative overflow-hidden">
              {enviado ? (
                <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-brand-neon/10 rounded-full flex items-center justify-center mx-auto text-brand-neon">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Solicitação Enviada!</h2>
                    <p className="text-gray-400">Excelente. Nossa equipe entrará em contato em breve para agendar seu diagnóstico.</p>
                  </div>
                  <button 
                    onClick={() => setEnviado(false)}
                    className="text-brand-neon hover:text-white transition-colors text-sm font-medium"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">Solicitar Diagnóstico</h2>
                  <p className="text-gray-400 text-sm">Preencha os campos e entraremos em contato em até 24 horas úteis.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-1.5">Nome completo</label>
                        <input required type="text" id="nome" placeholder="Seu nome"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="empresa" className="block text-sm font-medium text-gray-300 mb-1.5">Empresa</label>
                        <input required type="text" id="empresa" placeholder="Nome da sua empresa"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                        <input required type="email" id="email" placeholder="seu@email.com"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-1.5">WhatsApp</label>
                        <input required type="tel" id="telefone" placeholder="(54) 99944-1227"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="segmento" className="block text-sm font-medium text-gray-300 mb-1.5">Segmento de mercado</label>
                      <select id="segmento" required
                        className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-colors"
                      >
                        <option value="">Selecione seu segmento</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="servicos">Serviços Profissionais</option>
                        <option value="saude">Saúde e Bem-estar</option>
                        <option value="industria">Indústria e Logística</option>
                        <option value="imobiliario">Mercado Imobiliário</option>
                        <option value="educacao">Educação</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-sm font-medium text-gray-300 mb-1.5">Conte-nos seu maior desafio</label>
                      <textarea id="mensagem" rows={4} placeholder="O que mais te incomoda em marketing e vendas hoje?"
                        className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-colors resize-none"
                      ></textarea>
                    </div>

                    <button disabled={carregando} type="submit"
                      className="w-full inline-flex h-14 items-center justify-center rounded-md bg-brand-neon px-8 text-base font-bold text-brand-darker transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(1,250,164,0.4)] disabled:opacity-50"
                    >
                      {carregando ? (
                        <div className="w-5 h-5 border-2 border-brand-darker/30 border-t-brand-darker rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Solicitação
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info Side */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Fale diretamente conosco</h2>
                <p className="text-gray-400">
                  Se preferir, entre em contato diretamente por um dos canais abaixo. Respondemos rápido.
                </p>
              </div>

              <div className="space-y-6">
                <a href="https://wa.me/5554999441227?text=Ol%C3%A1!%20Gostaria%20de%20entender%20como%20a%20metodologia%20CENTUM%20pode%20ajudar%20meu%20neg%C3%B3cio." target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 bg-[#111] border border-brand-dark rounded-xl hover:border-brand-neon/40 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-brand-neon/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-neon" />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">WhatsApp</p>
                    <p className="text-gray-400 text-sm">(54) 99944-1227</p>
                    <span className="text-brand-neon text-xs font-medium inline-flex items-center mt-1 group-hover:underline">
                      Abrir conversa <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-[#111] border border-brand-dark rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">E-mail</p>
                    <p className="text-gray-400 text-sm">contato@centumilia.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-[#111] border border-brand-dark rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Localização</p>
                    <p className="text-gray-400 text-sm">Garibaldi, RS — Atendimento em todo o Brasil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
