"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Store } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-client"
import { TabBar } from "@/components/tab-bar"
import type { Marca } from "@/lib/types"

const TIPOS = ["Barbearia clássica","Barbearia moderna","Espaço premium/boutique","Studio de barba"]
const SERVICOS_OPCOES = ["Corte","Barba","Combo corte+barba","Sobrancelha","Pigmentação","Coloração","Tratamentos capilares"]
const PUBLICO_OPCOES = ["18-25 anos","25-35 anos","35-50 anos","Executivos","Universitários","Família"]
const TONS = ["Direto e confiante","Descontraído e brincalhão","Sofisticado e elegante","Caloroso e próximo"]
const REDES_OPCOES = ["Instagram","TikTok","Facebook","WhatsApp"]

export default function MinhaBarbearia() {
  const router = useRouter()
  const [marca, setMarca] = useState<Marca | null>(null)
  const [adminNome, setAdminNome] = useState("")
  const [adminWhatsapp, setAdminWhatsapp] = useState("")

  const [nome, setNome] = useState("")
  const [cidade, setCidade] = useState("")
  const [tipo, setTipo] = useState("")
  const [servicos, setServicos] = useState<string[]>([])
  const [publico, setPublico] = useState<string[]>([])
  const [tom, setTom] = useState("")
  const [palavrasInput, setPalavrasInput] = useState("")
  const [redes, setRedes] = useState<string[]>([])
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

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

  const salvar = async () => {
    setSalvando(true)
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
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Store size={16} style={{color:"var(--acc)"}}/>
          <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>Minha Barbearia</span>
        </div>
      </header>

      <main style={{maxWidth:560,margin:"0 auto",padding:"28px 20px 100px"}}>

        <div className="card" style={{padding:"20px",marginBottom:18}}>
          <div className="label" style={{marginBottom:7}}>SEU NOME</div>
          <input className="inp" placeholder="Como você se chama" value={adminNome} onChange={e=>setAdminNome(e.target.value)} style={{marginBottom:16}}/>

          <div className="label" style={{marginBottom:7}}>WHATSAPP (OPCIONAL)</div>
          <input className="inp" placeholder="(21) 90000-0000" value={adminWhatsapp} onChange={e=>setAdminWhatsapp(e.target.value)} style={{marginBottom:18}}/>

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

          <button onClick={salvar} disabled={salvando} className="btn-led" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%"}}>
            {salvando ? "Salvando..." : salvo ? <><Save size={14}/> Salvo!</> : <><Save size={14}/> Salvar alterações</>}
          </button>
        </div>
      </main>
      <TabBar/>
    </div>
  )
}
