"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Scissors, ArrowRight, Check, Sparkles, Calendar, Copy } from "lucide-react"

const PLANOS = [
  { id: "free", nome: "Free", preco: 0, destaque: false, recursos: ["5 conteúdos/mês", "1 marca", "Templates básicos"] },
  { id: "starter", nome: "Starter", preco: 49, destaque: false, recursos: ["30 conteúdos/mês", "1 marca", "Calendário de conteúdo", "Templates premium"] },
  { id: "pro", nome: "Pro", preco: 97, destaque: true, recursos: ["100 conteúdos/mês", "3 marcas", "Calendário + agendamento", "Dashboard de métricas"] },
  { id: "estrategia", nome: "FADE Estratégia", preco: null, destaque: false, recursos: ["Tudo do plano Pro", "Consultoria mensal com Marcus", "Plano de conteúdo personalizado", "Acompanhamento de resultados"] },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-display"
        style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-.02em", color: "#f0f0f0" }}>
        FADE
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const already = sessionStorage.getItem("fade_splash_shown")
    if (!already) {
      setShowSplash(true)
      sessionStorage.setItem("fade_splash_shown", "1")
    }
    setChecked(true)
  }, [])

  if (!checked) return null

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      </AnimatePresence>
    <div style={{minHeight:"100vh",position:"relative"}}>

      {/* NAV */}
      <motion.nav {...fadeUp(0)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Scissors size={18} style={{color:"var(--acc)"}} />
          <span className="font-brand" style={{fontSize:"1.1rem"}}>FADE Conteúdo</span>
        </div>
        <Link href="/login" className="btn-ghost">Entrar</Link>
      </motion.nav>

      {/* HERO */}
      <section style={{maxWidth:780,margin:"0 auto",padding:"70px 24px 50px",textAlign:"center",position:"relative"}}>
        <div className="ambient-glow" style={{top:-160,left:"50%",transform:"translateX(-50%)"}} />

        <motion.div {...fadeUp(0.05)} className="label" style={{marginBottom:18,position:"relative",zIndex:2}}>CONTEÚDO PARA BARBEARIAS</motion.div>

        <h1 className="font-display" style={{
          fontSize:"clamp(2.3rem,6vw,3.6rem)",fontWeight:700,lineHeight:1.06,letterSpacing:"-.025em",
          marginBottom:22,position:"relative",zIndex:2
        }}>
          <motion.span {...fadeUp(0.10)} style={{display:"block"}}>Sua barbearia posta</motion.span>
          <motion.span {...fadeUp(0.20)} style={{display:"block"}}>todo dia.</motion.span>
          <motion.span {...fadeUp(0.30)} style={{display:"block",color:"var(--fg-dim)"}}>Sem perder uma hora</motion.span>
          <motion.span {...fadeUp(0.30)} style={{display:"block",color:"var(--fg-dim)"}}>com isso.</motion.span>
        </h1>

        <motion.p {...fadeUp(0.42)} style={{fontSize:"1.05rem",color:"var(--fg-dim)",lineHeight:1.6,maxWidth:520,margin:"0 auto 32px",position:"relative",zIndex:2}}>
          FADE gera posts, legendas e roteiros de Reels com a identidade da sua marca — prontos para publicar, todo mês.
        </motion.p>

        <motion.div {...fadeUp(0.52)} style={{display:"flex",gap:12,justifyContent:"center",position:"relative",zIndex:2}}>
          <Link href="/onboarding" className="btn-led" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:"0.95rem",padding:"14px 28px"}}>
            Começar gratuitamente <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* MOCKUP DO PRODUTO — prova visual */}
      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        style={{maxWidth:560,margin:"20px auto 70px",padding:"0 24px"}}>
        <div className="card" style={{padding:"4px",borderColor:"var(--border-h)",boxShadow:"0 30px 80px -20px rgba(0,0,0,0.6)"}}>
          <div style={{background:"var(--surface)",borderRadius:11,padding:"18px 18px 16px",overflow:"hidden"}}>
            {/* fake header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Sparkles size={12} style={{color:"var(--acc)"}}/>
                <span className="font-display" style={{fontSize:".78rem",fontWeight:700}}>Gerar conteúdo</span>
              </div>
              <Calendar size={13} style={{color:"var(--fg-faint)"}}/>
            </div>

            {/* fake chips */}
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {["Post","Story","Reels"].map((t,i)=>(
                <span key={t} className={`chip ${i===0?"chip-on":""}`} style={{fontSize:".62rem",padding:"5px 10px"}}>{t}</span>
              ))}
            </div>

            {/* fake generated card */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontWeight:600,fontSize:".8rem"}}>Terapia de segunda 💈</span>
                <Copy size={12} style={{color:"var(--fg-faint)"}}/>
              </div>
              <p style={{fontSize:".74rem",color:"var(--fg-dim)",lineHeight:1.5}}>
                Segunda é dia de reorganizar a semana — e o visual também entra nisso.
                Corte + barba com 10% off, só hoje<span className="caret">|</span>
              </p>
              <div style={{marginTop:8,fontSize:".68rem",color:"var(--acc)"}}>#barbearia #segundafeira #cuidadomasculino</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* COMO FUNCIONA */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"20px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
        {[
          {n:"01",t:"Conte sobre sua barbearia",d:"Nome, serviços, público e tom de voz — leva 2 minutos."},
          {n:"02",t:"A IA gera o conteúdo",d:"Posts, legendas e roteiros prontos, no estilo da sua marca."},
          {n:"03",t:"Organize no calendário",d:"Agende, edite e acompanhe o que já foi publicado."},
        ].map((s,i)=>(
          <motion.div key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i*0.08 }}
            className="card" style={{padding:"22px 20px"}}>
            <div className="font-mono" style={{fontSize:".7rem",color:"var(--acc)",marginBottom:10}}>{s.n}</div>
            <div style={{fontWeight:600,fontSize:".95rem",marginBottom:6}}>{s.t}</div>
            <div style={{fontSize:".82rem",color:"var(--fg-dim)",lineHeight:1.5}}>{s.d}</div>
          </motion.div>
        ))}
      </section>

      {/* PRICING */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"60px 24px"}}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{textAlign:"center",marginBottom:36}}>
          <div className="label" style={{marginBottom:10}}>PLANOS</div>
          <h2 className="font-display" style={{fontSize:"1.8rem",fontWeight:700}}>Para quem corta cabelo e para quem cuida de várias barbearias</h2>
        </motion.div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {PLANOS.map((p,i)=>(
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i*0.06 }}
              className="card" style={{padding:"24px 20px",border:p.destaque?"1px solid var(--acc-bd)":undefined,background:p.destaque?"var(--acc-dim)":undefined,position:"relative"}}>
              {p.destaque && <div className="label" style={{color:"var(--acc)",marginBottom:10}}>MAIS POPULAR</div>}
              <div style={{fontWeight:600,fontSize:"1rem",marginBottom:4}}>{p.nome}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:18}}>
                <span className="font-display" style={{fontSize:p.preco===null?"1.3rem":"1.8rem"}}>{p.preco===null?"Sob consulta":p.preco===0?"Grátis":`R$${p.preco}`}</span>
                {!!p.preco && <span style={{fontSize:".78rem",color:"var(--fg-faint)"}}>/mês</span>}
              </div>
              {p.recursos.map(r=>(
                <div key={r} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:9}}>
                  <Check size={13} style={{color:"var(--acc)",marginTop:2,flexShrink:0}} />
                  <span style={{fontSize:".80rem",color:"var(--fg-dim)",lineHeight:1.4}}>{r}</span>
                </div>
              ))}
              <Link
                href={p.id === "estrategia" ? "/onboarding?plano=estrategia&contato=1" : `/onboarding?plano=${p.id}`}
                className={p.destaque ? "btn-led" : "btn-ghost"}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:6,width:"100%"}}>
                {p.id === "estrategia" ? "Falar com a gente" : p.id === "free" ? "Começar grátis" : "Escolher plano"}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <footer style={{textAlign:"center",padding:"40px 24px",color:"var(--fg-faint)",fontSize:".78rem"}}>
        FADE — feito para barbearias que não têm tempo a perder.
      </footer>
    </div>
    </>
  )
}
