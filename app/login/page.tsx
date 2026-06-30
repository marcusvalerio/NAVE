"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Scissors, Eye, EyeOff } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const entrar = async () => {
    if (!email.trim() || !senha.trim()) return
    setLoading(true)
    setErro("")
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setLoading(false)
    if (error) {
      setErro(
        error.message.includes("Invalid login credentials")
          ? "E-mail ou senha incorretos."
          : "Não conseguimos entrar agora. Tenta de novo em alguns segundos."
      )
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <Link href="/" style={{display:"flex",color:"var(--fg-dim)",marginRight:6}}><ArrowLeft size={18}/></Link>
        <Scissors size={16} style={{color:"var(--acc)"}} />
        <span className="font-brand" style={{fontSize:"1rem"}}>FADE Conteúdo</span>
      </header>

      <main style={{flex:1,padding:"24px 24px 0",display:"flex",flexDirection:"column"}}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}} style={{width:"100%",maxWidth:380}}>
          <h1 className="font-display" style={{fontSize:"1.6rem",fontWeight:700,marginBottom:8,letterSpacing:"-.01em"}}>Entrar</h1>
          <p style={{fontSize:".85rem",color:"var(--fg-dim)",marginBottom:26,lineHeight:1.5}}>
            Acesse sua conta com e-mail e senha.
          </p>

          <input
            className="inp"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            style={{marginBottom:12}}
          />

          <div style={{position:"relative",marginBottom:8}}>
            <input
              className="inp"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Sua senha"
              value={senha}
              onChange={e=>setSenha(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && entrar()}
              style={{paddingRight:42}}
            />
            <button
              type="button"
              onClick={()=>setMostrarSenha(v=>!v)}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--fg-faint)",cursor:"pointer",display:"flex"}}>
              {mostrarSenha ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          <div style={{textAlign:"right",marginBottom:18}}>
            <Link href="/recuperar-senha" style={{fontSize:".76rem",color:"var(--fg-faint)",textDecoration:"underline"}}>Esqueci minha senha</Link>
          </div>

          {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:16}}>{erro}</div>}

          <button onClick={entrar} disabled={loading || !email.trim() || !senha.trim()} className="btn-led" style={{width:"100%"}}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p style={{fontSize:".78rem",color:"var(--fg-faint)",marginTop:20,textAlign:"center"}}>
            Ainda não tem conta? <Link href="/onboarding" style={{color:"var(--acc)",textDecoration:"underline"}}>Criar minha marca</Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
