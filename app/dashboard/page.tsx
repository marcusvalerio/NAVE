"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Scissors, Sparkles, Copy, Calendar, LayoutDashboard, LogOut, Check, Settings } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"
import type { Marca, Conteudo, Assinatura, Plano } from "@/lib/types"

const TIPOS = [
  { id: "post", label: "Post" },
  { id: "story", label: "Story" },
  { id: "reel_script", label: "Roteiro Reels" },
  { id: "legenda", label: "Legenda" },
  { id: "promocao", label: "Promoção" },
]
const REDES = ["instagram", "tiktok", "facebook", "whatsapp"]

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [marca, setMarca] = useState<Marca | null>(null)
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null)
  const [plano, setPlano] = useState<Plano | null>(null)
  const [conteudos, setConteudos] = useState<Conteudo[]>([])

  const [tipo, setTipo] = useState("post")
  const [rede, setRede] = useState("instagram")
  const [tema, setTema] = useState("")
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState("")
  const [copiadoId, setCopiadoId] = useState<string | null>(null)

  useEffect(() => { init() }, [])

  const init = async () => {
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/onboarding"); return }

    // Vincular dados do onboarding se ainda não houver marca
    const pending = sessionStorage.getItem("fade_onboarding")
    let marcaAtual: Marca | null = null

    const { data: marcaExistente } = await supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle()

    if (!marcaExistente && pending) {
      const parsed = JSON.parse(pending)
      const res = await fetch("/api/marca", { method: "POST", body: JSON.stringify(parsed) })
      if (res.ok) {
        sessionStorage.removeItem("fade_onboarding")
        const { data } = await supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle()
        marcaAtual = data
      }
    } else {
      marcaAtual = marcaExistente
    }

    setMarca(marcaAtual)

    const { data: assin } = await supabase.from("assinaturas").select("*").eq("user_id", user.id).maybeSingle()
    setAssinatura(assin)

    if (assin) {
      const { data: pl } = await supabase.from("planos").select("*").eq("id", assin.plano_id).single()
      setPlano(pl)
    }

    if (marcaAtual) {
      const { data: cs } = await supabase.from("conteudos").select("*").eq("marca_id", marcaAtual.id).order("created_at", { ascending: false }).limit(20)
      setConteudos(cs || [])
    }

    setLoading(false)
  }

  const gerar = async () => {
    if (!marca) return
    setGerando(true)
    setErro("")
    try {
      const res = await fetch("/api/gerar", {
        method: "POST",
        body: JSON.stringify({ marca_id: marca.id, tipo, rede, tema }),
      })
      const data = await res.json()
      if (!res.ok) { setErro(data.error || "Erro ao gerar conteúdo."); return }
      setConteudos(prev => [data.conteudo, ...prev])
      setTema("")
      if (assinatura) setAssinatura({ ...assinatura, conteudos_usados_mes: assinatura.conteudos_usados_mes + 1 })
    } finally {
      setGerando(false)
    }
  }

  const copiar = (c: Conteudo) => {
    const texto = `${c.conteudo}\n\n${c.hashtags.map(h => `#${h.replace(/^#/, "")}`).join(" ")}`
    navigator.clipboard.writeText(texto)
    setCopiadoId(c.id)
    setTimeout(() => setCopiadoId(null), 1800)
  }

  const sair = async () => {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="font-display" style={{color:"var(--fg-faint)"}}>Carregando...</div>
    </div>
  }

  const usados = assinatura?.conteudos_usados_mes || 0
  const limite = plano?.limite_conteudos_mes || 5
  const pct = Math.min(100, Math.round((usados / limite) * 100))

  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"rgba(10,10,10,0.92)",backdropFilter:"blur(12px)",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Scissors size={16} style={{color:"var(--acc)"}} />
          <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>FADE</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>router.push("/calendario")} className="btn-ghost" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px"}}>
            <Calendar size={14}/> Calendário
          </button>
          <button onClick={()=>router.push("/configuracoes")} style={{background:"none",border:"none",color:"var(--fg-faint)",cursor:"pointer"}}><Settings size={16}/></button>
          <button onClick={sair} style={{background:"none",border:"none",color:"var(--fg-faint)",cursor:"pointer"}}><LogOut size={16}/></button>
        </div>
      </header>

      <main style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 80px"}}>

        {/* Status do plano */}
        <div className="card" style={{padding:"16px 18px",marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
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

        {/* Gerador */}
        <div className="card" style={{padding:"22px",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
            <Sparkles size={15} style={{color:"var(--acc)"}}/>
            <span className="font-display" style={{fontSize:"1.05rem",fontWeight:700}}>Gerar conteúdo</span>
          </div>

          <div className="label" style={{marginBottom:8}}>TIPO</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {TIPOS.map(t=>(
              <button key={t.id} onClick={()=>setTipo(t.id)} className={`chip ${tipo===t.id?"chip-on":""}`}>{t.label}</button>
            ))}
          </div>

          <div className="label" style={{marginBottom:8}}>REDE</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {REDES.map(r=>(
              <button key={r} onClick={()=>setRede(r)} className={`chip ${rede===r?"chip-on":""}`} style={{textTransform:"capitalize"}}>{r}</button>
            ))}
          </div>

          <div className="label" style={{marginBottom:8}}>TEMA (OPCIONAL)</div>
          <input className="inp" placeholder="ex: promoção de terça, novo serviço, dica de cuidado" value={tema} onChange={e=>setTema(e.target.value)} style={{marginBottom:16}}/>

          {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:14}}>{erro}</div>}

          <button onClick={gerar} disabled={gerando || usados >= limite} className="btn-primary" style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {gerando ? "Gerando..." : usados >= limite ? "Limite do plano atingido" : <>Gerar conteúdo <Sparkles size={14}/></>}
          </button>
        </div>

        {/* Lista de conteúdos */}
        <div className="label" style={{marginBottom:14}}>CONTEÚDOS RECENTES</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <AnimatePresence>
            {conteudos.map(c=>(
              <motion.div key={c.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card card-hover" style={{padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:".88rem",marginBottom:3}}>{c.titulo}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span className="label" style={{fontSize:".62rem"}}>{TIPOS.find(t=>t.id===c.tipo)?.label}</span>
                      <span style={{color:"var(--fg-faint)"}}>·</span>
                      <span className="label" style={{fontSize:".62rem",textTransform:"capitalize"}}>{c.rede}</span>
                    </div>
                  </div>
                  <button onClick={()=>copiar(c)} className="btn-ghost" style={{padding:"6px 10px",display:"flex",alignItems:"center",gap:5}}>
                    {copiadoId===c.id ? <><Check size={12}/> Copiado</> : <><Copy size={12}/> Copiar</>}
                  </button>
                </div>
                <p style={{fontSize:".84rem",color:"var(--fg-dim)",lineHeight:1.55,whiteSpace:"pre-wrap"}}>{c.conteudo}</p>
                {c.hashtags?.length > 0 && (
                  <div style={{marginTop:10,fontSize:".78rem",color:"var(--acc)"}}>{c.hashtags.map(h=>`#${h.replace(/^#/,"")}`).join(" ")}</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {conteudos.length===0 && (
            <div style={{textAlign:"center",padding:"40px 0",color:"var(--fg-faint)",fontSize:".85rem"}}>Nenhum conteúdo gerado ainda. Comece acima.</div>
          )}
        </div>
      </main>
    </div>
  )
}
