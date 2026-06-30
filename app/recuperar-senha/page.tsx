"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Scissors } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function RecuperarSenha() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState("")

  const enviar = async () => {
    if (!email.trim()) return
    setLoading(true)
    setErro("")
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    setLoading(false)
    if (error) {
      setErro("Não conseguimos enviar o link agora. Tenta de novo em alguns segundos.")
    } else {
      setEnviado(true)
    }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <Link href="/login" style={{display:"flex",color:"var(--fg-dim)",marginRight:6}}><ArrowLeft size={18}/></Link>
        <Scissors size={16} style={{color:"var(--acc)"}} />
        <span className="font-brand" style={{fontSize:"1rem"}}>FADE Conteúdo</span>
      </header>

      <main style={{flex:1,padding:"24px 24px 0",display:"flex",flexDirection:"column"}}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}} style={{width:"100%",maxWidth:380}}>
          {!enviado ? (
            <>
              <h1 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:8}}>Esqueci minha senha</h1>
              <p style={{fontSize:".85rem",color:"var(--fg-dim)",marginBottom:24,lineHeight:1.5}}>
                Manda seu e-mail e a gente envia um link para você criar uma nova senha.
              </p>
              <input
                className="inp"
                type="email"
                inputMode="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && enviar()}
                style={{marginBottom:14}}
              />
              {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:14}}>{erro}</div>}
              <button onClick={enviar} disabled={loading || !email.trim()} className="btn-led" style={{width:"100%"}}>
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </button>
            </>
          ) : (
            <div style={{textAlign:"center"}}>
              <div className="font-display" style={{fontSize:"1.3rem",fontWeight:700,marginBottom:10}}>Link enviado ✓</div>
              <p style={{fontSize:".88rem",color:"var(--fg-dim)",lineHeight:1.5}}>
                Abre o e-mail que mandamos para <strong style={{color:"var(--fg)"}}>{email}</strong> e clica no link para criar uma nova senha.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
