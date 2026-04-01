'use client';

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nome: '', empresa: '', email: '', telefone: '', segmento: '', mensagem: ''
  });

  function formatarTelefone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validarForm() {
    const novosErros: Record<string, string> = {};
    if (!formData.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (!formData.empresa.trim()) novosErros.empresa = "Empresa é obrigatória";
    if (!formData.email.trim()) novosErros.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) novosErros.email = "E-mail inválido";
    if (!formData.telefone.trim()) novosErros.telefone = "Telefone é obrigatório";
    else if (formData.telefone.replace(/\D/g, '').length < 10) novosErros.telefone = "Telefone inválido";
    if (!formData.segmento) novosErros.segmento = "Selecione um segmento";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validarForm()) return;
    
    setCarregando(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setErros({});
        setEnviado(true);
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setErros({ form: "Muitas tentativas. Aguarde um momento." });
        } else {
          setErros({ form: data.error || "Não foi possível enviar sua solicitação. Tente novamente em instantes." });
        }
      }
    } catch {
      setErros({ form: "Erro de conexão. Verifique sua internet e tente novamente." });
    } finally {
      setCarregando(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'telefone') {
      setFormData({ ...formData, telefone: formatarTelefone(value) });
    } else {
      setFormData({ ...formData, [id]: value });
    }
    if (erros[id]) setErros({ ...erros, [id]: '' });
  };

  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30 select-none">
        <div className="gradient-blob w-[600px] h-[600px] bg-brand-cyan top-[-10%] left-[-10%]" style={{ animationDelay: '0s' }}></div>
        <div className="gradient-blob w-[700px] h-[700px] bg-brand-purple bottom-[-20%] right-[-10%]" style={{ animationDelay: '-2s' }}></div>
      </div>

      <section className="w-full py-32 border-b border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl space-y-6">
          <span className="text-brand-cyan font-black tracking-[0.5em] uppercase text-[10px]">Contato</span>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">Vamos construir sua <br/><span className="text-gradient">máquina de vendas?</span></h1>
          <p className="text-lg text-gray-400 font-medium">Agende um diagnóstico gratuito. Em 30 minutos, entendemos o cenário do seu negócio e mostramos onde está o maior potencial de crescimento.</p>
        </div>
      </section>

      <section className="w-full py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className="glass-elite rounded-[3rem] p-8 md:p-12 space-y-6 relative overflow-hidden">
              {enviado ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-neon/10 rounded-full flex items-center justify-center mx-auto text-brand-neon">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Solicitação Enviada!</h2>
                    <p className="text-gray-400">Excelente, {(formData.nome || 'Parceiro').split(' ')[0]}. Nossa equipe entrará em contato em breve no WhatsApp informado.</p>
                  </div>
                  <button 
                    onClick={() => { setEnviado(false); setFormData({ nome: '', empresa: '', email: '', telefone: '', segmento: '', mensagem: '' }); setErros({}); }}
                    className="text-brand-neon hover:text-white transition-colors text-sm font-black uppercase tracking-widest"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Solicitar Diagnóstico</h2>
                  <p className="text-gray-400 text-sm">Preencha os campos e entraremos em contato em até 24 horas úteis.</p>
                  
                  {erros.form && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {erros.form}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nome" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Nome completo</label>
                        <input required type="text" id="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome"
                          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-neon transition-colors ${erros.nome ? 'border-red-500/50' : 'border-white/10'}`}
                        />
                        {erros.nome && <p className="text-red-400 text-[10px] mt-1">{erros.nome}</p>}
                      </div>
                      <div>
                        <label htmlFor="empresa" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Empresa</label>
                        <input required type="text" id="empresa" value={formData.empresa} onChange={handleChange} placeholder="Nome da sua empresa"
                          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-neon transition-colors ${erros.empresa ? 'border-red-500/50' : 'border-white/10'}`}
                        />
                        {erros.empresa && <p className="text-red-400 text-[10px] mt-1">{erros.empresa}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">E-mail</label>
                        <input required type="email" id="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com"
                          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-neon transition-colors ${erros.email ? 'border-red-500/50' : 'border-white/10'}`}
                        />
                        {erros.email && <p className="text-red-400 text-[10px] mt-1">{erros.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="telefone" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">WhatsApp</label>
                        <input required type="tel" id="telefone" value={formData.telefone} onChange={handleChange} placeholder="(54) 99944-1227"
                          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-neon transition-colors ${erros.telefone ? 'border-red-500/50' : 'border-white/10'}`}
                        />
                        {erros.telefone && <p className="text-red-400 text-[10px] mt-1">{erros.telefone}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="segmento" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Segmento de mercado</label>
                      <select id="segmento" required value={formData.segmento} onChange={handleChange}
                        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-neon transition-colors ${erros.segmento ? 'border-red-500/50' : 'border-white/10'}`}
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
                      {erros.segmento && <p className="text-red-400 text-[10px] mt-1">{erros.segmento}</p>}
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Conte-nos seu maior desafio</label>
                      <textarea id="mensagem" rows={4} value={formData.mensagem} onChange={handleChange} placeholder="O que mais te incomoda em marketing e vendas hoje?"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-neon transition-colors resize-none"
                      ></textarea>
                    </div>

                    <button disabled={carregando} type="submit"
                      className="w-full inline-flex h-14 items-center justify-center rounded-xl bg-brand-neon px-8 text-base font-black text-brand-darker uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(1,250,164,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
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

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-4">Fale diretamente com um especialista</h2>
                <p className="text-gray-400">A nossa abordagem não é robótica. Você falará com alguém que entende de processo comercial.</p>
              </div>

              <div className="space-y-4">
                <a href="https://wa.me/5554999441227" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 glass-elite rounded-[2rem] hover:border-brand-neon/40 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-brand-neon/10 flex items-center justify-center text-brand-neon group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-sm uppercase tracking-[0.2em]">WhatsApp Direto</p>
                    <p className="text-gray-500 text-xs">(54) 99944-1227</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-brand-neon group-hover:translate-x-1 transition-all" />
                </a>

                <div className="flex items-center gap-4 p-5 glass-elite rounded-[2rem]">
                  <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-[0.2em]">E-mail Corporativo</p>
                    <p className="text-gray-500 text-xs">contato@centumilia.com.br</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 glass-elite rounded-[2rem]">
                  <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-[0.2em]">Base de Operações</p>
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
