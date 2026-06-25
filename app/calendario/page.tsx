"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalIcon, X } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"
import type { Conteudo } from "@/lib/types"

// Sinalizadores conforme definido:
// vermelho = não tem nada gerado · laranja = gerado e não produzido
// azul = produzido e pronto pra postar · verde = finalizado e postado
const DOT: Record<string, string> = {
  vazio: "#ef4444",
  rascunho: "#f59e0b",
  agendado: "#3b82f6",
  publicado: "#22c55e",
  arquivado: "var(--fg-faint)",
}
const STATUS_LABEL: Record<string, string> = {
  rascunho: "Gerado, não produzido",
  agendado: "Produzido, pronto pra postar",
  publicado: "Finalizado e postado",
  arquivado: "Arquivado",
}

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const DIAS_SEMANA = ["D","S","T","Q","Q","S","S"]

export default function Calendario() {
  const router = useRouter()
  const [conteudos, setConteudos] = useState<Conteudo[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)

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

  const ano = cursor.getFullYear()
  const mes = cursor.getMonth()
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()
  const hoje = new Date()

  const mesmoDia = (d1: Date, d2: Date) => d1.getFullYear()===d2.getFullYear() && d1.getMonth()===d2.getMonth() && d1.getDate()===d2.getDate()

  const conteudosPorDia = (dia: number) => {
    const data = new Date(ano, mes, dia)
    return conteudos.filter(c => mesmoDia(new Date(c.created_at), data))
  }

  const statusDominante = (lista: Conteudo[]) => {
    if (lista.length === 0) return "vazio"
    if (lista.some(c => c.status === "publicado")) return "publicado"
    if (lista.some(c => c.status === "agendado")) return "agendado"
    return "rascunho"
  }

  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ]

  const conteudosDoDiaSelecionado = diaSelecionado
    ? conteudos.filter(c => mesmoDia(new Date(c.created_at), diaSelecionado))
    : []

  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <CalIcon size={16} style={{color:"var(--acc)"}}/>
          <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>Calendário de conteúdo</span>
        </div>
      </header>

      <main style={{maxWidth:520,margin:"0 auto",padding:"20px 16px 100px"}}>

        {/* Navegação de mês */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <button onClick={()=>setCursor(new Date(ano, mes-1, 1))} className="btn-ghost" style={{padding:"8px"}}>
            <ChevronLeft size={15}/>
          </button>
          <span className="font-display" style={{fontSize:"1.05rem",fontWeight:700}}>{MESES[mes]} {ano}</span>
          <button onClick={()=>setCursor(new Date(ano, mes+1, 1))} className="btn-ghost" style={{padding:"8px"}}>
            <ChevronRight size={15}/>
          </button>
        </div>

        {/* Legenda */}
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:18,padding:"10px 14px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:10}}>
          {[["vazio","Sem nada gerado"],["rascunho","Gerado, falta produzir"],["agendado","Pronto pra postar"],["publicado","Postado"]].map(([k,label])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:DOT[k]}}/>
              <span style={{fontSize:".66rem",color:"var(--fg-faint)"}}>{label}</span>
            </div>
          ))}
        </div>

        {/* Cabeçalho dias da semana */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
          {DIAS_SEMANA.map((d,i)=>(
            <div key={i} style={{textAlign:"center",fontSize:".64rem",color:"var(--fg-faint)",fontWeight:600,padding:"4px 0"}}>{d}</div>
          ))}
        </div>

        {/* Grid do mês */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {celulas.map((dia, idx) => {
            if (dia === null) return <div key={idx}/>
            const data = new Date(ano, mes, dia)
            const lista = conteudosPorDia(dia)
            const status = statusDominante(lista)
            const isHoje = mesmoDia(data, hoje)

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.92 }}
                onClick={()=>setDiaSelecionado(data)}
                className="card-hover"
                style={{
                  aspectRatio:"1",
                  background: isHoje ? "var(--acc-dim)" : "var(--card)",
                  border: isHoje ? "1px solid var(--acc-bd)" : "1px solid var(--border)",
                  borderRadius:9,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  gap:3,cursor:"pointer",position:"relative"
                }}>
                <span style={{fontSize:".74rem",fontWeight: isHoje ? 700 : 400, color: isHoje ? "var(--acc)" : "var(--fg-dim)"}}>{dia}</span>
                <div style={{width:6,height:6,borderRadius:"50%",background:DOT[status]}}/>
              </motion.button>
            )
          })}
        </div>
      </main>

      {/* Painel do dia selecionado */}
      <AnimatePresence>
        {diaSelecionado && (
          <>
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>setDiaSelecionado(null)}
              style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:40}}/>
            <motion.div
              initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"tween",duration:.25,ease:[.22,1,.36,1]}}
              className="glass-sheet" style={{position:"fixed",left:0,right:0,bottom:90,maxWidth:520,margin:"0 auto",zIndex:40,borderRadius:"20px 20px 0 0",padding:"18px 20px",maxHeight:"60vh",overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span className="font-display" style={{fontWeight:700,fontSize:"1rem"}}>
                  {diaSelecionado.getDate()} de {MESES[diaSelecionado.getMonth()]}
                </span>
                <button onClick={()=>setDiaSelecionado(null)} style={{background:"none",border:"none",color:"var(--fg-faint)"}}><X size={18}/></button>
              </div>

              {conteudosDoDiaSelecionado.length === 0 ? (
                <div style={{textAlign:"center",padding:"24px 0",color:"var(--fg-faint)",fontSize:".82rem"}}>Nada gerado para este dia.</div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {conteudosDoDiaSelecionado.map(c=>(
                    <div key={c.id} className="card" style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{fontWeight:600,fontSize:".86rem"}}>{c.titulo}</div>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:DOT[c.status]}}/>
                          <span style={{fontSize:".68rem",color:"var(--fg-faint)"}}>{STATUS_LABEL[c.status]}</span>
                        </div>
                      </div>
                      <select
                        value={c.status}
                        onChange={e=>atualizarStatus(c.id, e.target.value)}
                        className="inp"
                        style={{fontSize:".78rem",padding:"8px 10px"}}>
                        <option value="rascunho">Gerado, não produzido</option>
                        <option value="agendado">Produzido, pronto pra postar</option>
                        <option value="publicado">Finalizado e postado</option>
                        <option value="arquivado">Arquivado</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <TabBar/>
    </div>
  )
}