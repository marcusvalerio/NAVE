"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Trash2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function Configuracoes() {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const exportarDados = () => {
    window.location.href = "/api/dados/exportar"
  }

  const excluirConta = async () => {
    setExcluindo(true)
    const res = await fetch("/api/dados/excluir", { method: "POST" })
    if (res.ok) {
      const supabase = supabaseBrowser()
      await supabase.auth.signOut()
      router.push("/")
    } else {
      setExcluindo(false)
    }
  }

  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
        <button onClick={()=>router.push("/dashboard")} style={{background:"none",border:"none",color:"var(--fg-dim)",cursor:"pointer",display:"flex"}}>
          <ArrowLeft size={18}/>
        </button>
        <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>Configurações</span>
      </header>

      <main style={{maxWidth:560,margin:"0 auto",padding:"28px 20px 60px"}}>

        <div className="card" style={{padding:"20px",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <ShieldCheck size={15} style={{color:"var(--acc)"}}/>
            <span className="font-display" style={{fontWeight:700,fontSize:".95rem"}}>Privacidade e dados</span>
          </div>
          <p style={{fontSize:".82rem",color:"var(--fg-dim)",lineHeight:1.5}}>
            Você tem controle total sobre seus dados, conforme a LGPD. Leia a <Link href="/privacidade" style={{color:"var(--acc)",textDecoration:"underline"}}>Política de Privacidade</Link>.
          </p>
        </div>

        <div className="card card-hover" style={{padding:"18px 20px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:600,fontSize:".88rem",marginBottom:3}}>Exportar meus dados</div>
            <div style={{fontSize:".78rem",color:"var(--fg-faint)"}}>Baixa uma cópia completa em JSON</div>
          </div>
          <button onClick={exportarDados} className="btn-ghost" style={{display:"flex",alignItems:"center",gap:6}}>
            <Download size={14}/> Exportar
          </button>
        </div>

        <div className="card" style={{padding:"18px 20px",borderColor:"rgba(239,68,68,0.25)"}}>
          <div style={{fontWeight:600,fontSize:".88rem",marginBottom:3,color:"#ef4444"}}>Excluir minha conta</div>
          <div style={{fontSize:".78rem",color:"var(--fg-faint)",marginBottom:14}}>
            Remove permanentemente sua marca, conteúdos e assinatura. Esta ação não pode ser desfeita.
          </div>

          {!confirmando ? (
            <button onClick={()=>setConfirmando(true)} className="btn-ghost" style={{display:"flex",alignItems:"center",gap:6,borderColor:"rgba(239,68,68,0.3)",color:"#ef4444"}}>
              <Trash2 size={14}/> Excluir conta e dados
            </button>
          ) : (
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setConfirmando(false)} className="btn-ghost" style={{flex:1}}>Cancelar</button>
              <button
                onClick={excluirConta}
                disabled={excluindo}
                className="btn-primary"
                style={{flex:1,background:"#ef4444"}}>
                {excluindo ? "Excluindo..." : "Confirmar exclusão"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
