import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Centumilia",
  description: "Política de privacidade e uso de dados da Centumilia Agência de Marketing.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-invert prose-brand prose-lg max-w-none prose-headings:text-white prose-p:text-gray-400 prose-li:text-gray-400 prose-strong:text-white">
          
          <p><strong>Última atualização:</strong> Março de 2026</p>

          <p>
            A <strong>Centumilia</strong> (&quot;nós&quot;, &quot;nosso&quot; ou &quot;agência&quot;) valoriza a privacidade dos visitantes do nosso site e dos nossos clientes. Esta política descreve como coletamos, usamos e protegemos informações pessoais.
          </p>

          <h2>1. Informações Coletadas</h2>
          <p>Podemos coletar as seguintes informações:</p>
          <ul>
            <li><strong>Dados de identificação:</strong> nome, e-mail, telefone e empresa, quando preenchidos voluntariamente em formulários de contato.</li>
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e origem do acesso, coletados via cookies e ferramentas de análise (como Google Analytics).</li>
          </ul>

          <h2>2. Uso das Informações</h2>
          <p>As informações coletadas são utilizadas para:</p>
          <ul>
            <li>Responder solicitações de contato e diagnósticos.</li>
            <li>Enviar comunicações comerciais, caso haja consentimento.</li>
            <li>Melhorar a experiência de navegação e a performance do site.</li>
            <li>Gerar relatórios analíticos internos (sem identificação pessoal).</li>
          </ul>

          <h2>3. Compartilhamento</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Podemos compartilhar dados com prestadores de serviço (como plataformas de e-mail e CRM) estritamente necessários para a operação.
          </p>

          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar a experiência do usuário e para fins analíticos. Você pode desativar cookies nas configurações do seu navegador, embora isso possa afetar funcionalidades do site.
          </p>

          <h2>5. Segurança</h2>
          <p>
            Adotamos medidas técnicas razoáveis para proteger seus dados contra acessos não autorizados, alteração, divulgação ou destruição.
          </p>

          <h2>6. Seus Direitos (LGPD)</h2>
          <p>
            Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul>
            <li>Confirmar a existência de tratamento de dados.</li>
            <li>Acessar seus dados.</li>
            <li>Corrigir dados incompletos ou desatualizados.</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados.</li>
            <li>Revogar consentimento a qualquer momento.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
            <a href="mailto:contato@centumilia.com.br" className="text-brand-neon">contato@centumilia.com.br</a>.
          </p>

          <h2>7. Alterações</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que revise esta página com regularidade.
          </p>

          <h2>8. Contato</h2>
          <p>
            <strong>Centumilia — Agência de Marketing</strong><br />
            Garibaldi, RS — Brasil<br />
            E-mail: <a href="mailto:contato@centumilia.com.br" className="text-brand-neon">contato@centumilia.com.br</a><br />
            WhatsApp: <a href="https://wa.me/5554999441227" className="text-brand-neon">(54) 99944-1227</a>
          </p>
        </div>
      </div>
    </main>
  );
}
