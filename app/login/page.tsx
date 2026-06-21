"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Scissors } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function Login() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState("")

  const entrar = async () => {
    if (!email.trim()) return
    setLoading(true)
    setErro("")
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
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
      <header style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:8}}>
        <Link href="/" style={{display:"flex",color:"var(--fg-dim)",marginRight:6}}><ArrowLeft size={18}/></Link>
        <Scissors size={16} style={{color:"var(--acc)"}} />
        <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>FADE</span>
      </header>

      <main style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35}} style={{width:"100%",maxWidth:380}}>
          {!enviado ? (
            <>
              <h1 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:8}}>Entrar</h1>
              <p style={{fontSize:".85rem",color:"var(--fg-dim)",marginBottom:24}}>
                Manda seu e-mail e a gente envia um link de acesso. Sem senha.
              </p>
              <input
                className="inp"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && entrar()}
                style={{marginBottom:14}}
              />
              {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:14}}>{erro}</div>}
              <button onClick={entrar} disabled={loading || !email.trim()} className="btn-primary" style={{width:"100%"}}>
                {loading ? "Enviando..." : "Enviar link de acesso"}
              </button>
              <p style={{fontSize:".78rem",color:"var(--fg-faint)",marginTop:20,textAlign:"center"}}>
                Ainda não tem conta? <Link href="/onboarding" style={{color:"var(--acc)",textDecoration:"underline"}}>Criar minha marca</Link>
              </p>
            </>
          ) : (
            <div style={{textAlign:"center"}}>
              <div className="font-display" style={{fontSize:"1.3rem",fontWeight:700,marginBottom:10}}>Link enviado ✓</div>
              <p style={{fontSize:".88rem",color:"var(--fg-dim)",lineHeight:1.5}}>
                Abre o e-mail que mandamos para <strong style={{color:"var(--fg)"}}>{email}</strong> e clica no link para entrar.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
