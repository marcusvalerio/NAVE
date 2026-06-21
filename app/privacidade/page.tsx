import Link from "next/link"
import { ArrowLeft, Scissors } from "lucide-react"

export const metadata = { title: "Política de Privacidade — FADE" }

export default function Privacidade() {
  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"20px 24px",borderBottom:"1px solid var(--border)"}}>
        <Link href="/" style={{display:"flex",color:"var(--fg-dim)"}}><ArrowLeft size={18}/></Link>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Scissors size={16} style={{color:"var(--acc)"}}/>
          <span className="font-display" style={{fontWeight:700}}>FADE</span>
        </div>
      </header>

      <main style={{maxWidth:680,margin:"0 auto",padding:"40px 24px 80px",lineHeight:1.7,fontSize:".92rem",color:"var(--fg-dim)"}}>
        <h1 className="font-display" style={{fontSize:"1.8rem",fontWeight:700,color:"var(--fg)",marginBottom:8}}>Política de Privacidade</h1>
        <p className="label" style={{marginBottom:32}}>ÚLTIMA ATUALIZAÇÃO: 20 DE JUNHO DE 2026 · VERSÃO 1</p>

        <Secao titulo="1. Quem somos">
          O FADE é um serviço de geração de conteúdo para redes sociais voltado a barbearias. Esta política explica como tratamos os dados pessoais de quem usa o serviço, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
        </Secao>

        <Secao titulo="2. Quais dados coletamos">
          Coletamos apenas dados da pessoa que cria a conta (o titular do negócio ou responsável pela barbearia):
          <ul style={{marginTop:10,paddingLeft:20}}>
            <li>E-mail, usado para login e comunicação sobre a conta.</li>
            <li>Nome da marca, cidade, tipo de negócio, serviços oferecidos, público-alvo e tom de voz, usados para personalizar o conteúdo gerado.</li>
            <li>Os conteúdos gerados e seu histórico de uso, para que você possa consultá-los depois.</li>
          </ul>
          Não coletamos dados de clientes finais da sua barbearia (ex: agendamentos, telefones de clientes).
        </Secao>

        <Secao titulo="3. Por que tratamos esses dados">
          Tratamos seus dados com base na execução do contrato de prestação de serviço (Art. 7º, V, LGPD): sem eles, não é possível gerar conteúdo personalizado nem manter sua conta funcionando. Quando aplicável, também com base no seu consentimento, registrado no momento do cadastro.
        </Secao>

        <Secao titulo="4. Com quem compartilhamos">
          <ul style={{paddingLeft:20}}>
            <li><strong style={{color:"var(--fg)"}}>Supabase</strong> — armazena seus dados em banco de dados (operador de dados).</li>
            <li><strong style={{color:"var(--fg)"}}>Anthropic (Claude)</strong> — processa o perfil da sua marca para gerar o texto do conteúdo, sem reter os dados após a geração.</li>
            <li><strong style={{color:"var(--fg)"}}>Vercel</strong> — hospeda a aplicação.</li>
          </ul>
          Não vendemos nem compartilhamos seus dados com terceiros para fins de publicidade.
        </Secao>

        <Secao titulo="5. Por quanto tempo guardamos seus dados">
          Guardamos seus dados enquanto sua conta estiver ativa. Se você excluir sua conta, os dados pessoais e o conteúdo associado são removidos do banco de dados de produção.
        </Secao>

        <Secao titulo="6. Seus direitos">
          Conforme o Art. 18 da LGPD, você pode, a qualquer momento:
          <ul style={{marginTop:10,paddingLeft:20}}>
            <li>Confirmar e acessar os dados que temos sobre você.</li>
            <li>Exportar uma cópia completa dos seus dados (disponível no painel, em Configurações).</li>
            <li>Corrigir dados incompletos ou desatualizados (editando seu perfil de marca).</li>
            <li>Solicitar a exclusão da sua conta e dos seus dados (disponível no painel, em Configurações).</li>
            <li>Revogar o consentimento dado no cadastro.</li>
          </ul>
        </Secao>

        <Secao titulo="7. Segurança">
          Seus dados são protegidos por controle de acesso por linha (Row Level Security), o que significa que apenas você pode visualizar ou modificar seus próprios dados — nem outros usuários do FADE têm acesso a eles.
        </Secao>

        <Secao titulo="8. Contato">
          Para exercer qualquer um dos direitos acima ou tirar dúvidas sobre esta política, entre em contato pelo e-mail informado na sua conta.
        </Secao>
      </main>
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section style={{marginBottom:28}}>
      <h2 className="font-display" style={{fontSize:"1.1rem",fontWeight:700,color:"var(--fg)",marginBottom:10}}>{titulo}</h2>
      <div>{children}</div>
    </section>
  )
}
