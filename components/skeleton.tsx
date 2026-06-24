"use client"
import { motion } from "framer-motion"

export function Skeleton({ width = "100%", height = 16, radius = 6, style = {} }: { width?: string|number; height?: number; radius?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      style={{
        width, height, borderRadius: radius,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 100px"}}>
      <Skeleton width={180} height={26} style={{marginBottom:10}}/>
      <Skeleton width={240} height={14} style={{marginBottom:24}}/>
      <Skeleton height={72} radius={16} style={{marginBottom:20}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
        <Skeleton height={86} radius={16}/>
        <Skeleton height={86} radius={16}/>
        <Skeleton height={86} radius={16}/>
      </div>
      <Skeleton height={48} radius={10}/>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{padding:"16px 18px",borderRadius:16,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)"}}>
          <Skeleton width="60%" height={14} style={{marginBottom:10}}/>
          <Skeleton width="100%" height={12} style={{marginBottom:6}}/>
          <Skeleton width="85%" height={12}/>
        </div>
      ))}
    </div>
  )
}
