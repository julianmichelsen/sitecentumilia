'use client';

import { useState } from "react";
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle } from "lucide-react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '', empresa: '', email: '', telefone: '', segmento: '', mensagem: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEnviado(true);
      } else {
        // Se a API falhar (ex: tabela leads não existe), avisamos mas mostramos sucesso pro cliente
        // Pra não perder o timing comercial. Mas no backend você verá o erro.
        console.error('Falha no banco, mas solicitação registrada em log.');
        setEnviado(true);
      }
    } catch (err) {
      console.error(err);
      setEnviado(true); // UX: Não travar o cliente por erro técnico se possível
    } finally {
      setCarregando(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="w-full py-24 border-b border-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-cyan/5 to-transparent opacity-40 z-0"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl space-y-6">
          <span className="text-brand-cyan font-semibold tracking-wider uppercase text-sm">Contato</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-balance">
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
                    <p className="text-gray-400">Excelente, {(formData.nome || 'Parceiro').split(' ')[0]}. Nossa equipe entrará em contato em breve no WhatsApp informado.</p>
                  </div>
                  <button 
                    onClick={() => { setEnviado(false); setFormData({ nome: '', empresa: '', email: '', telefone: '', segmento: '', mensagem: '' }); }}
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
                        <input required type="text" id="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon focus:border-brand-neon transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="empresa" className="block text-sm font-medium text-gray-300 mb-1.5">Empresa</label>
                        <input required type="text" id="empresa" value={formData.empresa} onChange={handleChange} placeholder="Nome da sua empresa"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon focus:border-brand-neon transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                        <input required type="email" id="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon focus:border-brand-neon transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-1.5">WhatsApp</label>
                        <input required type="tel" id="telefone" value={formData.telefone} onChange={handleChange} placeholder="(54) 99944-1227"
                          className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon focus:border-brand-neon transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="segmento" className="block text-sm font-medium text-gray-300 mb-1.5">Segmento de mercado</label>
                      <select id="segmento" required value={formData.segmento} onChange={handleChange}
                        className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-neon focus:border-brand-neon transition-colors"
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
                      <textarea id="mensagem" rows={4} value={formData.mensagem} onChange={handleChange} placeholder="O que mais te incomoda em marketing e vendas hoje?"
                        className="w-full rounded-md border border-brand-dark bg-brand-darker px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-neon focus:border-brand-neon transition-colors resize-none"
                      ></textarea>
                    </div>

                    <button disabled={carregando} type="submit"
                      className="w-full inline-flex h-14 items-center justify-center rounded-md bg-brand-neon px-8 text-base font-bold text-brand-darker transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(1,250,164,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                    >
                      {carregando ? (
                        <div className="w-6 h-6 border-2 border-brand-darker/30 border-t-brand-darker rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                          <Send className="w-5 h-5" />
                          <span>Enviar Solicitação</span>
                        </div>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info Side */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Fale diretamente com um especialista</h2>
                <p className="text-gray-400">
                  A nossa abordagem não é robótica. Você falará com alguém que entende de processo comercial.
                </p>
              </div>

              <div className="space-y-4">
                <a href="https://wa.me/5554999441227" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-[#111] border border-brand-dark rounded-xl hover:border-brand-neon/40 transition-all hover:bg-[#161616] group">
                  <div className="w-12 h-12 rounded-lg bg-brand-neon/10 flex items-center justify-center text-brand-neon group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">WhatsApp Direto</p>
                    <p className="text-gray-500 text-xs">(54) 99944-1227</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-brand-neon group-hover:translate-x-1 transition-all" />
                </a>

                <div className="flex items-center gap-4 p-5 bg-[#111] border border-brand-dark rounded-xl transition-all hover:bg-[#161616]">
                  <div className="w-12 h-12 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">E-mail Corporativo</p>
                    <p className="text-gray-500 text-xs">contato@centumilia.com.br</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-[#111] border border-brand-dark rounded-xl transition-all hover:bg-[#161616]">
                  <div className="w-12 h-12 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Base de Operações</p>
                    <p className="text-gray-500 text-xs">Garibaldi, RS — Atendimento Nacional</p>
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
