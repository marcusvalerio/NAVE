"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center"}}>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
        <Scissors size={28} style={{color:"var(--acc)",marginBottom:18}}/>
        <div className="font-display" style={{fontSize:"2.4rem",fontWeight:700,marginBottom:8}}>404</div>
        <h1 className="font-display" style={{fontSize:"1.2rem",fontWeight:700,marginBottom:10}}>Essa página deu um fade</h1>
        <p style={{fontSize:".88rem",color:"var(--fg-dim)",marginBottom:26,maxWidth:340,lineHeight:1.5}}>
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <Link href="/" className="btn-primary" style={{display:"inline-flex",alignItems:"center",gap:8}}>
          <ArrowLeft size={14}/> Voltar para o início
        </Link>
      </motion.div>
    </div>
  )
}
