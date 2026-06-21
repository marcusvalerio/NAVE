"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors, ArrowRight, Check } from "lucide-react"

const PLANOS = [
  { id: "free", nome: "Free", preco: 0, destaque: false, recursos: ["5 conteúdos/mês", "1 marca", "Templates básicos"] },
  { id: "starter", nome: "Starter", preco: 49, destaque: false, recursos: ["30 conteúdos/mês", "1 marca", "Calendário de conteúdo", "Templates premium"] },
  { id: "pro", nome: "Pro", preco: 97, destaque: true, recursos: ["100 conteúdos/mês", "3 marcas", "Calendário + agendamento", "Dashboard de métricas"] },
  { id: "agencia", nome: "Agência", preco: 197, destaque: false, recursos: ["Conteúdo ilimitado", "Marcas ilimitadas", "Multi-cliente", "Suporte prioritário"] },
]

export default function Home() {
  return (
    <div style={{minHeight:"100vh"}}>

      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Scissors size={18} style={{color:"var(--acc)"}} />
          <span className="font-display" style={{fontSize:"1.1rem",fontWeight:700,letterSpacing:"-.02em"}}>FADE</span>
        </div>
        <Link href="/onboarding" className="btn-ghost">Entrar</Link>
      </nav>

      {/* HERO */}
      <section style={{maxWidth:780,margin:"0 auto",padding:"80px 24px 60px",textAlign:"center"}}>
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
          <div className="label" style={{marginBottom:18}}>CONTEÚDO PARA BARBEARIAS</div>
          <h1 className="font-display" style={{fontSize:"clamp(2.2rem,5vw,3.4rem)",fontWeight:700,lineHeight:1.08,letterSpacing:"-.02em",marginBottom:20}}>
            Sua barbearia posta todo<br/>dia. Sem perder uma hora<br/>com isso.
          </h1>
          <p style={{fontSize:"1.05rem",color:"var(--fg-dim)",lineHeight:1.6,maxWidth:520,margin:"0 auto 32px"}}>
            FADE gera posts, legendas e roteiros de Reels com a identidade da sua marca — prontos para publicar, todo mês.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            <Link href="/onboarding" className="btn-primary" style={{display:"inline-flex",alignItems:"center",gap:8}}>
              Criar minha marca <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
        {[
          {n:"01",t:"Conte sobre sua barbearia",d:"Nome, serviços, público e tom de voz — leva 2 minutos."},
          {n:"02",t:"A IA gera o conteúdo",d:"Posts, legendas e roteiros prontos, no estilo da sua marca."},
          {n:"03",t:"Organize no calendário",d:"Agende, edite e acompanhe o que já foi publicado."},
        ].map(s=>(
          <div key={s.n} className="card" style={{padding:"22px 20px"}}>
            <div className="font-mono" style={{fontSize:".7rem",color:"var(--acc)",marginBottom:10}}>{s.n}</div>
            <div style={{fontWeight:600,fontSize:".95rem",marginBottom:6}}>{s.t}</div>
            <div style={{fontSize:".82rem",color:"var(--fg-dim)",lineHeight:1.5}}>{s.d}</div>
          </div>
        ))}
      </section>

      {/* PRICING */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"60px 24px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div className="label" style={{marginBottom:10}}>PLANOS</div>
          <h2 className="font-display" style={{fontSize:"1.8rem",fontWeight:700}}>Para quem corta cabelo e para quem cuida de várias barbearias</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {PLANOS.map(p=>(
            <div key={p.id} className="card" style={{padding:"24px 20px",border:p.destaque?"1px solid var(--acc-bd)":undefined,background:p.destaque?"var(--acc-dim)":undefined,position:"relative"}}>
              {p.destaque && <div className="label" style={{color:"var(--acc)",marginBottom:10}}>MAIS POPULAR</div>}
              <div style={{fontWeight:600,fontSize:"1rem",marginBottom:4}}>{p.nome}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:18}}>
                <span className="font-display" style={{fontSize:"1.8rem",fontWeight:700}}>{p.preco===0?"Grátis":`R$${p.preco}`}</span>
                {p.preco>0 && <span style={{fontSize:".78rem",color:"var(--fg-faint)"}}>/mês</span>}
              </div>
              {p.recursos.map(r=>(
                <div key={r} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:9}}>
                  <Check size={13} style={{color:"var(--acc)",marginTop:2,flexShrink:0}} />
                  <span style={{fontSize:".80rem",color:"var(--fg-dim)",lineHeight:1.4}}>{r}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <footer style={{textAlign:"center",padding:"40px 24px",color:"var(--fg-faint)",fontSize:".78rem"}}>
        FADE — feito para barbearias que não têm tempo a perder.
      </footer>
    </div>
  )
}
