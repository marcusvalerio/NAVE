"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar as CalIcon } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"
import type { Conteudo, Marca } from "@/lib/types"

const STATUS_COLOR: Record<string,string> = {
  rascunho: "var(--fg-faint)",
  agendado: "#f59e0b",
  publicado: "#22c55e",
  arquivado: "var(--fg-faint)",
}
const STATUS_LABEL: Record<string,string> = {
  rascunho: "Rascunho", agendado: "Agendado", publicado: "Publicado", arquivado: "Arquivado"
}

export default function Calendario() {
  const router = useRouter()
  const [conteudos, setConteudos] = useState<Conteudo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { init() }, [])

  const init = async () => {
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/onboarding"); return }
    const { data: marca } = await supabase.from("marcas").select("id").eq("user_id", user.id).maybeSingle()
    if (marca) {
      const { data: cs } = await supabase.from("conteudos").select("*").eq("marca_id", marca.id).order("created_at", { ascending: false })
      setConteudos(cs || [])
    }
    setLoading(false)
  }

  const atualizarStatus = async (id: string, status: string) => {
    const supabase = supabaseBrowser()
    await supabase.from("conteudos").update({ status }).eq("id", id)
    setConteudos(prev => prev.map(c => c.id === id ? { ...c, status: status as Conteudo["status"] } : c))
  }

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--fg-faint)"}}>Carregando...</div>

  const grupos = {
    rascunho: conteudos.filter(c => c.status === "rascunho"),
    agendado: conteudos.filter(c => c.status === "agendado"),
    publicado: conteudos.filter(c => c.status === "publicado"),
  }

  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
        <button onClick={()=>router.push("/dashboard")} style={{background:"none",border:"none",color:"var(--fg-dim)",cursor:"pointer",display:"flex"}}>
          <ArrowLeft size={18}/>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <CalIcon size={16} style={{color:"var(--acc)"}}/>
          <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>Calendário de conteúdo</span>
        </div>
      </header>

      <main style={{maxWidth:720,margin:"0 auto",padding:"24px 20px 60px"}}>
        {(["rascunho","agendado","publicado"] as const).map(status=>(
          <div key={status} style={{marginBottom:30}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:STATUS_COLOR[status]}}/>
              <span className="label">{STATUS_LABEL[status].toUpperCase()} · {grupos[status].length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {grupos[status].map(c=>(
                <div key={c.id} className="card" style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:".86rem",marginBottom:4}}>{c.titulo}</div>
                    <div style={{fontSize:".76rem",color:"var(--fg-faint)",textTransform:"capitalize"}}>{c.rede} · {new Date(c.created_at).toLocaleDateString("pt-BR")}</div>
                  </div>
                  <select
                    value={c.status}
                    onChange={e=>atualizarStatus(c.id, e.target.value)}
                    className="inp"
                    style={{width:"auto",fontSize:".74rem",padding:"6px 10px"}}>
                    <option value="rascunho">Rascunho</option>
                    <option value="agendado">Agendado</option>
                    <option value="publicado">Publicado</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>
              ))}
              {grupos[status].length===0 && (
                <div style={{fontSize:".8rem",color:"var(--fg-faint)",padding:"8px 0"}}>Nada aqui ainda.</div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
