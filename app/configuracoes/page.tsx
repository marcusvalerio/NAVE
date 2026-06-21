"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Trash2, ShieldCheck, User, Save, Scissors } from "lucide-react"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase-client"
import type { Marca } from "@/lib/types"

const TIPOS = ["Barbearia clássica","Barbearia moderna","Espaço premium/boutique","Studio de barba"]
const SERVICOS_OPCOES = ["Corte","Barba","Combo corte+barba","Sobrancelha","Pigmentação","Coloração","Tratamentos capilares"]
const PUBLICO_OPCOES = ["18-25 anos","25-35 anos","35-50 anos","Executivos","Universitários","Família"]
const TONS = ["Direto e confiante","Descontraído e brincalhão","Sofisticado e elegante","Caloroso e próximo"]
const REDES_OPCOES = ["Instagram","TikTok","Facebook","WhatsApp"]

export default function Configuracoes() {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [marca, setMarca] = useState<Marca | null>(null)

  const [adminNome, setAdminNome] = useState("")
  const [adminWhatsapp, setAdminWhatsapp] = useState("")
  const [salvandoContato, setSalvandoContato] = useState(false)
  const [salvoContato, setSalvoContato] = useState(false)

  const [nome, setNome] = useState("")
  const [cidade, setCidade] = useState("")
  const [tipo, setTipo] = useState("")
  const [servicos, setServicos] = useState<string[]>([])
  const [publico, setPublico] = useState<string[]>([])
  const [tom, setTom] = useState("")
  const [palavrasInput, setPalavrasInput] = useState("")
  const [redes, setRedes] = useState<string[]>([])
  const [salvandoMarca, setSalvandoMarca] = useState(false)
  const [salvoMarca, setSalvoMarca] = useState(false)

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) =>
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])

  useEffect(() => { init() }, [])

  const init = async () => {
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/onboarding"); return }
    const { data } = await supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle()
    if (data) {
      setMarca(data)
      setAdminNome(data.admin_nome || "")
      setAdminWhatsapp(data.admin_whatsapp || "")
      setNome(data.nome || "")
      setCidade(data.cidade || "")
      setTipo(data.tipo || "")
      setServicos(data.servicos || [])
      setPublico(data.publico || [])
      setTom(data.tom || "")
      setPalavrasInput((data.palavras || []).join(", "))
      setRedes(data.redes || [])
    }
  }

  const salvarContato = async () => {
    if (!marca) return
    setSalvandoContato(true)
    await fetch("/api/marca", {
      method: "POST",
      body: JSON.stringify({
        nome: marca.nome, cidade: marca.cidade, tipo: marca.tipo,
        servicos: marca.servicos, publico: marca.publico, tom: marca.tom,
        palavras: marca.palavras, redes: marca.redes,
        admin_nome: adminNome, admin_whatsapp: adminWhatsapp,
      }),
    })
    setSalvandoContato(false)
    setSalvoContato(true)
    setTimeout(() => setSalvoContato(false), 2000)
  }

  const salvarMarca = async () => {
    setSalvandoMarca(true)
    const palavras = palavrasInput.split(",").map(p => p.trim()).filter(Boolean)
    const res = await fetch("/api/marca", {
      method: "POST",
      body: JSON.stringify({
        nome, cidade, tipo, servicos, publico, tom, palavras, redes,
        admin_nome: adminNome, admin_whatsapp: adminWhatsapp,
      }),
    })
    if (res.ok) {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle()
        if (data) setMarca(data)
      }
    }
    setSalvandoMarca(false)
    setSalvoMarca(true)
    setTimeout(() => setSalvoMarca(false), 2000)
  }

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

        {/* Dados de contato */}
        <div className="card" style={{padding:"20px",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <User size={15} style={{color:"var(--acc)"}}/>
            <span className="font-display" style={{fontWeight:700,fontSize:".95rem"}}>Seus dados</span>
          </div>

          <div className="label" style={{marginBottom:7}}>SEU NOME</div>
          <input className="inp" placeholder="Como você se chama" value={adminNome} onChange={e=>setAdminNome(e.target.value)} style={{marginBottom:16}}/>

          <div className="label" style={{marginBottom:7}}>WHATSAPP (OPCIONAL)</div>
          <input className="inp" placeholder="(21) 90000-0000" value={adminWhatsapp} onChange={e=>setAdminWhatsapp(e.target.value)} style={{marginBottom:8}}/>
          <p style={{fontSize:".72rem",color:"var(--fg-faint)",marginBottom:16,lineHeight:1.5}}>
            Usamos apenas para falar com você sobre sua conta — nunca para divulgação a terceiros.
          </p>

          <button onClick={salvarContato} disabled={salvandoContato} className="btn-primary" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%"}}>
            {salvandoContato ? "Salvando..." : salvoContato ? <><Save size={14}/> Salvo!</> : <><Save size={14}/> Salvar</>}
          </button>
        </div>

        {/* Editar marca */}
        <div className="card" style={{padding:"20px",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <Scissors size={15} style={{color:"var(--acc)"}}/>
            <span className="font-display" style={{fontWeight:700,fontSize:".95rem"}}>Sua marca</span>
          </div>

          <div className="label" style={{marginBottom:7}}>NOME DA BARBEARIA</div>
          <input className="inp" value={nome} onChange={e=>setNome(e.target.value)} style={{marginBottom:14}}/>

          <div className="label" style={{marginBottom:7}}>CIDADE</div>
          <input className="inp" value={cidade} onChange={e=>setCidade(e.target.value)} style={{marginBottom:14}}/>

          <div className="label" style={{marginBottom:8}}>TIPO DE BARBEARIA</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {TIPOS.map(t=>(
              <button key={t} onClick={()=>setTipo(t)} className={`chip ${tipo===t?"chip-on":""}`}>{t}</button>
            ))}
          </div>

          <div className="label" style={{marginBottom:8}}>SERVIÇOS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {SERVICOS_OPCOES.map(s=>(
              <button key={s} onClick={()=>toggle(servicos,setServicos,s)} className={`chip ${servicos.includes(s)?"chip-on":""}`}>{s}</button>
            ))}
          </div>

          <div className="label" style={{marginBottom:8}}>PÚBLICO PRINCIPAL</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {PUBLICO_OPCOES.map(p=>(
              <button key={p} onClick={()=>toggle(publico,setPublico,p)} className={`chip ${publico.includes(p)?"chip-on":""}`}>{p}</button>
            ))}
          </div>

          <div className="label" style={{marginBottom:8}}>TOM DE VOZ</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {TONS.map(t=>(
              <button key={t} onClick={()=>setTom(t)} className={`chip ${tom===t?"chip-on":""}`}>{t}</button>
            ))}
          </div>

          <div className="label" style={{marginBottom:7}}>PALAVRAS QUE SEU CLIENTE USA</div>
          <input className="inp" placeholder="ex: estiloso, navalhado, raiz" value={palavrasInput} onChange={e=>setPalavrasInput(e.target.value)} style={{marginBottom:16}}/>

          <div className="label" style={{marginBottom:8}}>CANAIS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:18}}>
            {REDES_OPCOES.map(r=>(
              <button key={r} onClick={()=>toggle(redes,setRedes,r)} className={`chip ${redes.includes(r)?"chip-on":""}`}>{r}</button>
            ))}
          </div>

          <button onClick={salvarMarca} disabled={salvandoMarca} className="btn-primary" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%"}}>
            {salvandoMarca ? "Salvando..." : salvoMarca ? <><Save size={14}/> Salvo!</> : <><Save size={14}/> Salvar alterações da marca</>}
          </button>
        </div>

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
