import Link from "next/link"
import { ArrowLeft, Scissors } from "lucide-react"

export const metadata = { title: "Termos de Uso — FADE" }

export default function Termos() {
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
        <h1 className="font-display" style={{fontSize:"1.8rem",fontWeight:700,color:"var(--fg)",marginBottom:8}}>Termos de Uso</h1>
        <p className="label" style={{marginBottom:32}}>ÚLTIMA ATUALIZAÇÃO: 21 DE JUNHO DE 2026 · VERSÃO 1</p>

        <Secao titulo="1. Aceitação dos termos">
          Ao criar uma conta no FADE, você concorda com estes Termos de Uso e com a nossa <Link href="/privacidade" style={{color:"var(--acc)",textDecoration:"underline"}}>Política de Privacidade</Link>. Se não concordar com algum ponto, não utilize o serviço.
        </Secao>

        <Secao titulo="2. O que é o FADE">
          O FADE é uma ferramenta que utiliza inteligência artificial para gerar sugestões de conteúdo para redes sociais (posts, legendas, roteiros de Reels) com base nas informações que você fornece sobre sua barbearia.
        </Secao>

        <Secao titulo="3. Responsabilidade sobre o conteúdo gerado">
          O conteúdo gerado pela IA é uma sugestão de ponto de partida. Você é responsável por revisar, editar e validar qualquer conteúdo antes de publicá-lo, incluindo a precisão de promoções, preços, datas e disponibilidade de serviços mencionados. O FADE não se responsabiliza por conteúdos publicados sem revisão prévia.
        </Secao>

        <Secao titulo="4. Planos e limites de uso">
          O FADE oferece planos com diferentes limites mensais de geração de conteúdo. Ao atingir o limite do seu plano, novas gerações ficam bloqueadas até o início do próximo ciclo ou upgrade de plano. Os planos e seus limites podem ser consultados na página inicial e estão sujeitos a alteração mediante aviso prévio.
        </Secao>

        <Secao titulo="5. Uso aceitável">
          Você concorda em não utilizar o FADE para gerar conteúdo ilegal, discriminatório, enganoso ou que infrinja direitos de terceiros. Reservamo-nos o direito de suspender contas que violem este princípio.
        </Secao>

        <Secao titulo="6. Cancelamento">
          Você pode excluir sua conta a qualquer momento em Configurações, o que remove permanentemente seus dados e conteúdos gerados, conforme detalhado na Política de Privacidade.
        </Secao>

        <Secao titulo="7. Disponibilidade do serviço">
          O FADE depende de serviços de terceiros (incluindo provedores de infraestrutura e de inteligência artificial) para funcionar. Não garantimos disponibilidade ininterrupta e não nos responsabilizamos por indisponibilidades temporárias desses serviços.
        </Secao>

        <Secao titulo="8. Alterações nestes termos">
          Podemos atualizar estes Termos periodicamente. Alterações relevantes serão comunicadas através da própria plataforma ou por e-mail.
        </Secao>

        <Secao titulo="9. Contato">
          Dúvidas sobre estes Termos podem ser enviadas pelo e-mail informado na sua conta.
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
