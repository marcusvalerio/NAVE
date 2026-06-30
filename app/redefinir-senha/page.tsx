"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Scissors } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"

export default function RedefinirSenha() {
  const router = useRouter()
  const [senha, setSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const salvar = async () => {
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.")
      return
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.")
      return
    }
    setLoading(true)
    setErro("")
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.updateUser({ password: senha })
    setLoading(false)
    if (error) {
      setErro("Não conseguimos salvar a nova senha. O link pode ter expirado — solicite um novo.")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <Scissors size={16} style={{color:"var(--acc)"}} />
        <span className="font-brand" style={{fontSize:"1rem"}}>FADE Conteúdo</span>
      </header>

      <main style={{flex:1,padding:"24px 24px 0",display:"flex",flexDirection:"column"}}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}} style={{width:"100%",maxWidth:380}}>
          <h1 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:8}}>Crie uma nova senha</h1>
          <p style={{fontSize:".85rem",color:"var(--fg-dim)",marginBottom:24,lineHeight:1.5}}>
            Escolha uma senha com pelo menos 6 caracteres.
          </p>
          <input
            className="inp"
            type="password"
            autoComplete="new-password"
            placeholder="Nova senha"
            value={senha}
            onChange={e=>setSenha(e.target.value)}
            style={{marginBottom:12}}
          />
          <input
            className="inp"
            type="password"
            autoComplete="new-password"
            placeholder="Confirme a nova senha"
            value={confirmar}
            onChange={e=>setConfirmar(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && salvar()}
            style={{marginBottom:14}}
          />
          {erro && <div style={{fontSize:".8rem",color:"#ef4444",marginBottom:14}}>{erro}</div>}
          <button onClick={salvar} disabled={loading} className="btn-led" style={{width:"100%"}}>
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </motion.div>
      </main>
    </div>
  )
}
