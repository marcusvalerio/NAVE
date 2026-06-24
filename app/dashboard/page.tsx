"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Scissors, LogOut, PenSquare, TrendingUp, FileText, Calendar as CalIcon } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"
import { TabBar } from "@/components/tab-bar"
import { DashboardSkeleton } from "@/components/skeleton"
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
          <h1 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,letterSpacing:"-.01em"}}>
            {periodo}{primeiroNome ? `, ${primeiroNome}` : ""}!
          </h1>
          <p style={{fontSize:".84rem",color:"var(--fg-dim)",marginTop:4}}>Aqui está toda a evolução da {marca?.nome || "sua marca"}.</p>
        </motion.div>

        {/* Status do plano */}
        <div className="glass" style={{padding:"16px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
          <div>
            <div className="label" style={{marginBottom:5}}>PLANO {plano?.nome?.toUpperCase() || "FREE"}</div>
            <div style={{fontSize:".82rem",color:"var(--fg-dim)"}}>{usados} de {limite} conteúdos usados este mês</div>
          </div>
          <div style={{width:50,height:50,position:"relative"}}>
            <svg width="50" height="50" viewBox="0 0 50 50" style={{transform:"rotate(-90deg)"}}>
              <circle cx="25" cy="25" r="21" fill="none" stroke="var(--border)" strokeWidth="4"/>
              <circle cx="25" cy="25" r="21" fill="none" stroke={pct>=90?"#ef4444":"var(--acc)"} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*21}`} strokeDashoffset={`${2*Math.PI*21*(1-pct/100)}`}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".68rem",fontWeight:600}}>{pct}%</div>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24,position:"relative",zIndex:1}}>
          <div className="glass" style={{padding:"14px 12px",textAlign:"center"}}>
            <FileText size={16} style={{color:"var(--fg-faint)",marginBottom:6}}/>
            <div className="font-display" style={{fontSize:"1.3rem",fontWeight:700}}>{rascunhos}</div>
            <div style={{fontSize:".62rem",color:"var(--fg-faint)"}}>Rascunhos</div>
          </div>
          <div className="glass" style={{padding:"14px 12px",textAlign:"center"}}>
            <CalIcon size={16} style={{color:"#f59e0b",marginBottom:6}}/>
            <div className="font-display" style={{fontSize:"1.3rem",fontWeight:700}}>{agendados}</div>
            <div style={{fontSize:".62rem",color:"var(--fg-faint)"}}>Agendados</div>
          </div>
          <div className="glass" style={{padding:"14px 12px",textAlign:"center"}}>
            <TrendingUp size={16} style={{color:"#22c55e",marginBottom:6}}/>
            <div className="font-display" style={{fontSize:"1.3rem",fontWeight:700}}>{publicados}</div>
            <div style={{fontSize:".62rem",color:"var(--fg-faint)"}}>Publicados</div>
          </div>
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
