import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermosDeUso() {
  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30 select-none">
        <div className="gradient-blob w-[600px] h-[600px] bg-brand-purple top-[-10%] right-[-10%]" style={{ animationDelay: '0s' }}></div>
        <div className="gradient-blob w-[700px] h-[700px] bg-brand-blue bottom-[-20%] left-[-10%]" style={{ animationDelay: '-2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-32 max-w-3xl space-y-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand-neon transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-brand-neon" />
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">Termos de Uso</h1>
          </div>
          <p className="text-gray-500 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="glass-elite rounded-[3rem] p-8 md:p-12 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">1. Aceitação dos Termos</h2>
            <p className="text-gray-400 leading-relaxed">Ao acessar e utilizar o site da Centumilia, você concorda com estes termos de uso. Caso não concorde com qualquer parte, pedimos que não utilize nossos serviços.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">2. Uso do Site</h2>
            <p className="text-gray-400 leading-relaxed">O conteúdo deste site é destinado a fins informativos sobre nossos serviços de marketing digital e consultoria. É proibida a reprodução, distribuição ou modificação de qualquer conteúdo sem autorização prévia.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">3. Propriedade Intelectual</h2>
            <p className="text-gray-400 leading-relaxed">Todo o conteúdo, incluindo textos, imagens, logotipos, metodologia CENTUM e design, é propriedade exclusiva da Centumilia e protegido pelas leis de propriedade intelectual brasileiras.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">4. Coleta de Dados</h2>
            <p className="text-gray-400 leading-relaxed">Ao preencher formulários de contato, você consente com a coleta e uso de seus dados pessoais conforme descrito em nossa Política de Privacidade. Seus dados são tratados com sigilo e utilizados exclusivamente para fins de contato comercial.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">5. Limitação de Responsabilidade</h2>
            <p className="text-gray-400 leading-relaxed">A Centumilia não se responsabiliza por danos diretos ou indiretos decorrentes do uso deste site. Os resultados apresentados em cases são específicos de cada cliente e não garantem resultados semelhantes.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">6. Alterações</h2>
            <p className="text-gray-400 leading-relaxed">Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações entram em vigor imediatamente após publicação neste site.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">7. Contato</h2>
            <p className="text-gray-400 leading-relaxed">Para dúvidas sobre estes termos, entre em contato pelo e-mail <span className="text-brand-neon">contato@centumilia.com.br</span> ou WhatsApp <span className="text-brand-neon">(54) 99944-1227</span>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
