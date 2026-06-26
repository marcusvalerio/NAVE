"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Scissors, LogOut, PenSquare, TrendingUp, FileText, Calendar as CalIcon, CheckCircle2 } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"
import { TabBar } from "@/components/tab-bar"
import { DashboardSkeleton } from "@/components/skeleton"
import { RingMetric, BarsMetric } from "@/components/mini-charts"
import type { Marca, Conteudo, Assinatura, Plano } from "@/lib/types"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [marca, setMarca] = useState<Marca | null>(null)
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null)
  const [plano, setPlano] = useState<Plano | null>(null)
  const [conteudos, setConteudos] = useState<Conteudo[]>([])

  useEffect(() => { init() }, [])

  const init = async () => {
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/onboarding"); return }

    const { data: marcaAtual } = await supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle()
    setMarca(marcaAtual)

    const { data: assin } = await supabase.from("assinaturas").select("*").eq("user_id", user.id).maybeSingle()
    setAssinatura(assin)

    if (assin) {
      const { data: pl } = await supabase.from("planos").select("*").eq("id", assin.plano_id).single()
      setPlano(pl)
    }

    if (marcaAtual) {
      const { data: cs } = await supabase.from("conteudos").select("*").eq("marca_id", marcaAtual.id).order("created_at", { ascending: false })
      setConteudos(cs || [])
    }

    setLoading(false)
  }

  const sair = async () => {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div style={{minHeight:"100vh"}}>
        <header className="glass-nav" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Scissors size={16} style={{color:"var(--acc)"}} />
            <span className="font-brand" style={{fontSize:"1rem"}}>FADE Conteúdo</span>
          </div>
        </header>
        <DashboardSkeleton/>
      </div>
    )
  }

  const usados = assinatura?.conteudos_usados_mes || 0
  const limite = plano?.limite_conteudos_mes || 5
  const pct = Math.min(100, Math.round((usados / limite) * 100))

  const h = new Date().getHours()
  const periodo = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"
  const primeiroNome = marca?.admin_nome?.trim().split(" ")[0]

  const publicados = conteudos.filter(c => c.status === "publicado").length
  const agendados = conteudos.filter(c => c.status === "agendado").length
  const rascunhos = conteudos.filter(c => c.status === "rascunho").length
  const total = conteudos.length

  // Distribuição dos últimos 7 dias (conteúdos criados por dia) — alimenta o gráfico de barras
  const hoje = new Date()
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje)
    d.setDate(d.getDate() - (6 - i))
    return conteudos.filter(c => {
      const cd = new Date(c.created_at)
      return cd.toDateString() === d.toDateString()
    }).length
  })

  // Taxa de conclusão (publicado / total) — alimenta o anel
  const taxaConclusao = total > 0 ? publicados : 0

  return (
    <div style={{minHeight:"100vh"}}>
      <header className="glass-nav" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Scissors size={16} style={{color:"var(--acc)"}} />
          <span className="font-brand" style={{fontSize:"1rem"}}>FADE Conteúdo</span>
        </div>
        <button onClick={sair} style={{background:"none",border:"none",color:"var(--fg-faint)",cursor:"pointer"}}><LogOut size={16}/></button>
      </header>

      <main style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 100px",position:"relative"}}>

        <div className="aurora-bg">
          <div className="aurora-blob b1"/>
          <div className="aurora-blob b2"/>
          <div className="aurora-blob b3"/>
        </div>

        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35}} style={{marginBottom:22,position:"relative",zIndex:1}}>
          <h1 className="font-display" style={{fontSize:"1.6rem",letterSpacing:"-.01em"}}>
            {periodo}{primeiroNome ? `, ${primeiroNome}` : ""}!
          </h1>
          <p style={{fontSize:".84rem",color:"var(--fg-dim)",marginTop:4}}>Aqui está toda a evolução da {marca?.nome || "sua marca"}.</p>
        </motion.div>

        {/* Grid 2×2 — estilo Activity, com gráficos reais */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22,position:"relative",zIndex:1}}>

          {/* Card 1 — uso do plano (anel) */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.05}} className="glass2" style={{padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,position:"relative",zIndex:1}}>
              <CalIcon size={14} style={{color:"var(--fg-dim)"}}/>
              <span style={{fontSize:".72rem",color:"var(--fg-dim)",fontWeight:500}}>Uso do plano</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:1}}>
              <div>
                <div className="font-display" style={{fontSize:"1.7rem",lineHeight:1}}>{usados}</div>
                <div style={{fontSize:".68rem",color:"var(--fg-faint)",marginTop:3}}>de {limite}</div>
              </div>
              <RingMetric value={usados} max={limite} color={pct>=90?"#ef4444":"#4F7DFF"}/>
            </div>
          </motion.div>

          {/* Card 2 — total gerado (número simples, grande) */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.10}} className="glass2" style={{padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,position:"relative",zIndex:1}}>
              <FileText size={14} style={{color:"var(--fg-dim)"}}/>
              <span style={{fontSize:".72rem",color:"var(--fg-dim)",fontWeight:500}}>Total gerado</span>
            </div>
            <div className="font-display" style={{fontSize:"1.7rem",lineHeight:1,position:"relative",zIndex:1}}>{total}</div>
            <div style={{fontSize:".68rem",color:"var(--fg-faint)",marginTop:3,position:"relative",zIndex:1}}>conteúdos no total</div>
          </motion.div>

          {/* Card 3 — atividade dos últimos 7 dias (barras) */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.15}} className="glass2" style={{padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,position:"relative",zIndex:1}}>
              <TrendingUp size={14} style={{color:"var(--fg-dim)"}}/>
              <span style={{fontSize:".72rem",color:"var(--fg-dim)",fontWeight:500}}>Últimos 7 dias</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:1}}>
              <div>
                <div className="font-display" style={{fontSize:"1.7rem",lineHeight:1}}>{ultimos7.reduce((a,b)=>a+b,0)}</div>
                <div style={{fontSize:".68rem",color:"var(--fg-faint)",marginTop:3}}>gerados</div>
              </div>
              <BarsMetric values={ultimos7} color="#4F7DFF" highlightIndex={6}/>
            </div>
          </motion.div>

          {/* Card 4 — publicados (anel verde) */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.20}} className="glass2" style={{padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,position:"relative",zIndex:1}}>
              <CheckCircle2 size={14} style={{color:"var(--fg-dim)"}}/>
              <span style={{fontSize:".72rem",color:"var(--fg-dim)",fontWeight:500}}>Publicados</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:1}}>
              <div>
                <div className="font-display" style={{fontSize:"1.7rem",lineHeight:1}}>{publicados}</div>
                <div style={{fontSize:".68rem",color:"var(--fg-faint)",marginTop:3}}>{agendados} agendados</div>
              </div>
              <RingMetric value={taxaConclusao} max={Math.max(total,1)} color="#22c55e"/>
            </div>
          </motion.div>
        </div>

        {/* CTA pra gerar conteúdo */}
        <button onClick={()=>router.push("/conteudos")} className="btn-led" style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"relative",zIndex:1}}>
          <PenSquare size={15}/> Gerar novo conteúdo
        </button>

      </main>
      <TabBar/>
    </div>
  )
}
