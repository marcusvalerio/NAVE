"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Scissors, Check } from "lucide-react"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase-client"

const TIPOS = ["Barbearia clássica","Barbearia moderna","Espaço premium/boutique","Studio de barba"]
const SERVICOS_OPCOES = ["Corte","Barba","Combo corte+barba","Sobrancelha","Pigmentação","Coloração","Tratamentos capilares"]
const PUBLICO_OPCOES = ["18-25 anos","25-35 anos","35-50 anos","Executivos","Universitários","Família"]
const TONS = ["Direto e confiante","Descontraído e brincalhão","Sofisticado e elegante","Caloroso e próximo"]
const REDES_OPCOES = ["Instagram","TikTok","Facebook","WhatsApp"]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const [nome, setNome] = useState("")
  const [cidade, setCidade] = useState("")
  const [tipo, setTipo] = useState("")
  const [servicos, setServicos] = useState<string[]>([])
  const [publico, setPublico] = useState<string[]>([])
  const [tom, setTom] = useState("")
  const [palavrasInput, setPalavrasInput] = useState("")
  const [redes, setRedes] = useState<string[]>([])
  const [aceitouPolitica, setAceitouPolitica] = useState(false)

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) =>
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])

  const steps = ["Marca", "Serviços", "Público & tom", "Redes", "Acesso"]
  const canNext = [
    !!(nome.trim() && cidade.trim() && tipo),
    servicos.length > 0,
    publico.length > 0 && !!tom,
    redes.length > 0,
    aceitouPolitica,
  ]

  const finalizar = async () => {
    if (!email.trim() || !aceitouPolitica) return
    setLoading(true)
    const supabase = supabaseBrowser()
    const palavras = palavrasInput.split(",").map(p => p.trim()).filter(Boolean)

    sessionStorage.setItem("fade_onboarding", JSON.stringify({
      nome, cidade, tipo, servicos, publico, tom, palavras, redes,
      consentimento_aceito_em: new Date().toISOString(),
      consentimento_versao: "v1",
    }))

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })

    setLoading(false)
    if (!error) setEmailSent(true)
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:8}}>
        <Scissors size={16} style={{color:"var(--acc)"}} />
        <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>FADE</span>
      </header>

      <div style={{display:"flex",gap:4,padding:"0 24px",marginBottom:32,maxWidth:480,margin:"0 auto",width:"100%"}}>
        {steps.map((s,i)=>(
          <div key={s} style={{flex:1,height:3,borderRadius:2,background:i<=step?"var(--acc)":"var(--border)",transition:"background .2s"}}/>
        ))}
      </div>

      <main style={{flex:1,maxWidth:480,margin:"0 auto",width:"100%",padding:"0 24px 40px"}}>
        <AnimatePresence mode="wait">

          {step===0 && (
            <motion.div key="0" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.2}}>
              <div className="label" style={{marginBottom:8}}>SOBRE A MARCA</div>
              <h2 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:24}}>Como sua barbearia se chama?</h2>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <input className="inp" placeholder="Nome da barbearia" value={nome} onChange={e=>setNome(e.target.value)} />
                <input className="inp" placeholder="Cidade" value={cidade} onChange={e=>setCidade(e.target.value)} />
                <div style={{marginTop:6}}>
                  <div className="label" style={{marginBottom:10}}>TIPO DE BARBEARIA</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {TIPOS.map(t=>(
                      <button key={t} onClick={()=>setTipo(t)} className={`chip ${tipo===t?"chip-on":""}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step===1 && (
            <motion.div key="1" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.2}}>
              <div className="label" style={{marginBottom:8}}>SERVIÇOS</div>
              <h2 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:24}}>O que vocês oferecem?</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {SERVICOS_OPCOES.map(s=>(
                  <button key={s} onClick={()=>toggle(servicos,setServicos,s)} className={`chip ${servicos.includes(s)?"chip-on":""}`}>{s}</button>
                ))}
              </div>
            </motion.div>
          )}

          {step===2 && (
            <motion.div key="2" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.2}}>
              <div className="label" style={{marginBottom:8}}>PÚBLICO E VOZ</div>
              <h2 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:24}}>Quem é seu cliente e como você fala com ele?</h2>
              <div className="label" style={{marginBottom:10}}>PÚBLICO PRINCIPAL</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
                {PUBLICO_OPCOES.map(p=>(
                  <button key={p} onClick={()=>toggle(publico,setPublico,p)} className={`chip ${publico.includes(p)?"chip-on":""}`}>{p}</button>
                ))}
              </div>
              <div className="label" style={{marginBottom:10}}>TOM DE VOZ</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
                {TONS.map(t=>(
                  <button key={t} onClick={()=>setTom(t)} className={`chip ${tom===t?"chip-on":""}`}>{t}</button>
                ))}
              </div>
              <div className="label" style={{marginBottom:10}}>PALAVRAS QUE SEU CLIENTE USA (opcional)</div>
              <input className="inp" placeholder="ex: estiloso, navalhado, raiz" value={palavrasInput} onChange={e=>setPalavrasInput(e.target.value)} />
            </motion.div>
          )}

          {step===3 && (
            <motion.div key="3" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.2}}>
              <div className="label" style={{marginBottom:8}}>CANAIS</div>
              <h2 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:24}}>Onde você posta?</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {REDES_OPCOES.map(r=>(
                  <button key={r} onClick={()=>toggle(redes,setRedes,r)} className={`chip ${redes.includes(r)?"chip-on":""}`}>{r}</button>
                ))}
              </div>
            </motion.div>
          )}

          {step===4 && (
            <motion.div key="4" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.2}}>
              {!emailSent ? (
                <>
                  <div className="label" style={{marginBottom:8}}>ÚLTIMO PASSO</div>
                  <h2 className="font-display" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:10}}>Qual seu e-mail?</h2>
                  <p style={{fontSize:".85rem",color:"var(--fg-dim)",marginBottom:22}}>Enviamos um link de acesso — sem senha, sem complicação.</p>
                  <input className="inp" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{marginBottom:18}} />

                  <button
                    onClick={()=>setAceitouPolitica(v=>!v)}
                    style={{display:"flex",alignItems:"flex-start",gap:10,background:"none",border:"none",cursor:"pointer",textAlign:"left",width:"100%"}}>
                    <div style={{
                      width:18,height:18,flexShrink:0,marginTop:1,borderRadius:5,
                      border:`1px solid ${aceitouPolitica?"var(--acc)":"var(--border-h)"}`,
                      background:aceitouPolitica?"var(--acc)":"transparent",
                      display:"flex",alignItems:"center",justifyContent:"center",transition:"all .12s"
                    }}>
                      {aceitouPolitica && <Check size={11} style={{color:"#fff"}}/>}
                    </div>
                    <span style={{fontSize:".78rem",color:"var(--fg-dim)",lineHeight:1.5}}>
                      Li e aceito a <Link href="/privacidade" target="_blank" style={{color:"var(--acc)",textDecoration:"underline"}} onClick={e=>e.stopPropagation()}>Política de Privacidade</Link>, e autorizo o uso dos meus dados para a prestação do serviço.
                    </span>
                  </button>
                </>
              ) : (
                <div style={{textAlign:"center",padding:"30px 0"}}>
                  <div className="font-display" style={{fontSize:"1.3rem",fontWeight:700,marginBottom:10}}>Link enviado ✓</div>
                  <p style={{fontSize:".88rem",color:"var(--fg-dim)",lineHeight:1.5}}>Abre o e-mail que mandamos para <strong style={{color:"var(--fg)"}}>{email}</strong> e clica no link para entrar.</p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {!emailSent && (
        <footer style={{maxWidth:480,margin:"0 auto",width:"100%",padding:"0 24px 32px",display:"flex",gap:10}}>
          {step>0 && (
            <button onClick={()=>setStep(s=>s-1)} className="btn-ghost" style={{display:"flex",alignItems:"center",gap:6}}>
              <ArrowLeft size={14}/> Voltar
            </button>
          )}
          <button
            onClick={()=> step<4 ? setStep(s=>s+1) : finalizar()}
            disabled={!canNext[step] || loading}
            className="btn-primary"
            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            {loading ? "Enviando..." : step<4 ? <>Continuar <ArrowRight size={14}/></> : "Enviar link de acesso"}
          </button>
        </footer>
      )}
    </div>
  )
}
