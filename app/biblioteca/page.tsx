"use client"
import { BookOpen } from "lucide-react"
import { TabBar } from "@/components/tab-bar"

export default function Biblioteca() {
  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <BookOpen size={16} style={{color:"var(--acc)"}}/>
          <span className="font-display" style={{fontSize:"1rem",fontWeight:700}}>Biblioteca</span>
        </div>
      </header>

      <main style={{maxWidth:680,margin:"0 auto",padding:"60px 24px 100px",textAlign:"center"}}>
        <BookOpen size={28} style={{color:"var(--acc)",marginBottom:16,opacity:.7}}/>
        <div className="font-display" style={{fontWeight:700,fontSize:"1.1rem",marginBottom:8}}>Em construção</div>
        <p style={{fontSize:".85rem",color:"var(--fg-faint)",lineHeight:1.5,maxWidth:300,margin:"0 auto"}}>
          Aqui vão ficar templates e exemplos prontos para inspirar seus próximos conteúdos.
        </p>
      </main>
      <TabBar/>
    </div>
  )
}
