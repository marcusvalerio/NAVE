"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Scissors } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""])
  const [etapa, setEtapa] = useState<"email" | "codigo">("email")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const enviarCodigo = async () => {
    if (!email.trim()) return
    setLoading(true)
    setErro("")
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    setLoading(false)
    if (error) {
      setErro("Não conseguimos enviar o código agora. Tenta de novo em alguns segundos.")
    } else {
      setEtapa("codigo")
      setTimeout(() => inputsRef.current[0]?.focus(), 100)
    }
  }

  const handleDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const novo = [...codigo]
    novo[idx] = val
    setCodigo(novo)
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus()
    if (novo.every(d => d !== "")) confirmarCodigo(novo.join(""))
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codigo[idx] && idx > 0) inputsRef.current[idx - 1]?.focus()
  }

  const confirmarCodigo = async (token: string) => {
    setLoading(true)
    setErro("")
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" })
    setLoading(false)
    if (error) {
      setErro("Código inválido ou expirado. Confere os números ou peça um novo código.")
      setCodigo(["", "", "", "", "", ""])
      inputsRef.current[0]?.focus()
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <button onClick={()=> etapa==="codigo" ? setEtapa("email") : router.push("/")} style={{display:"flex",color:"var(--fg-dim)",marginRight:6,background:"none",border:"none",cursor:"pointer"}}><ArrowLeft size={18}/></button>
        <Scissors size={16} style={{color:"var(--acc)"}} />
        <span className="font-brand" style={{fontSize:"1rem"}}>FADE Conteúdo</span>
      </header>

      {/* Conteúdo no topo, não centralizado verticalmente — evita ficar escondido pelo teclado em telas pequenas */}
      <main style={{flex:1,padding:"24px 24px 0",display:"flex",flexDirection:"column"}}>
        <AnimatePresence mode="wait">
          {etapa === "email" ? (
            <motion.div key="email" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.25}} style={{width:"100%",maxWidth:380}}>
              <h1 className="font-display" style={{fontSize:"1.6rem",fontWeight:700,marginBottom:8,letterSpacing:"-.01em"}}>Entrar</h1>
              <p style={{fontSize:".85rem",color:"var(--fg-dim)",marginBottom:26,lineHeight:1.5}}>
                Manda seu e-mail e a gente envia um código de acesso. Sem senha.
              </p>
              <input
                className="inp"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && enviarCodigo()}
                style={{marginBottom:14}}
              />
              {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:14}}>{erro}</div>}
              <button onClick={enviarCodigo} disabled={loading || !email.trim()} className="btn-led" style={{width:"100%"}}>
                {loading ? "Enviando..." : "Enviar código de acesso"}
              </button>
              <p style={{fontSize:".78rem",color:"var(--fg-faint)",marginTop:20,textAlign:"center"}}>
                Ainda não tem conta? <Link href="/onboarding" style={{color:"var(--acc)",textDecoration:"underline"}}>Criar minha marca</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div key="codigo" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.25}} style={{width:"100%",maxWidth:380,textAlign:"center"}}>
              <h1 className="font-display" style={{fontSize:"1.4rem",fontWeight:700,marginBottom:8}}>Digite o código</h1>
              <p style={{fontSize:".84rem",color:"var(--fg-dim)",marginBottom:26,lineHeight:1.5}}>
                Enviamos um código de 6 dígitos para <strong style={{color:"var(--fg)"}}>{email}</strong>
              </p>
              <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:18}}>
                {codigo.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { inputsRef.current[i] = el }}
                    className="inp"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e=>handleDigit(i, e.target.value)}
                    onKeyDown={e=>handleKeyDown(i, e)}
                    style={{width:42,height:50,textAlign:"center",fontSize:"1.2rem",fontWeight:600,padding:0}}
                  />
                ))}
              </div>
              {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:14}}>{erro}</div>}
              {loading && <div style={{fontSize:".8rem",color:"var(--fg-faint)",marginBottom:14}}>Verificando...</div>}
              <button onClick={enviarCodigo} disabled={loading} className="btn-ghost" style={{width:"100%"}}>Reenviar código</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
