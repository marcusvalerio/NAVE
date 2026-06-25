"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ChevronDown, Lightbulb } from "lucide-react"
import { TabBar } from "@/components/tab-bar"

const DICAS = [
  {
    categoria: "Frequência",
    titulo: "Poste menos, mas poste o que importa",
    resumo: "3 posts bons por semana superam 7 posts genéricos.",
    texto: "A maioria das barbearias posta demais e pensa pouco. O algoritmo do Instagram não recompensa volume — recompensa engajamento real. Um post sobre o resultado de um corte específico, com antes/depois, costuma performar melhor que cinco posts de \"promoção\" genéricos na mesma semana. Escolha qualidade sobre quantidade: 3 posts bem pensados por semana é mais sustentável e mais eficaz do que postar todo dia sem direção.",
  },
  {
    categoria: "Prova social",
    titulo: "O cliente satisfeito vende mais que você",
    resumo: "Depoimentos em vídeo convertem mais que qualquer anúncio.",
    texto: "Ninguém confia 100% no que a marca diz sobre si mesma — mas confia no que outro cliente diz. Peça para 2-3 clientes fiéis gravarem 15 segundos falando por que voltam sempre. Não precisa ser produção profissional; autenticidade vale mais que qualidade de câmera aqui.",
  },
  {
    categoria: "Posicionamento",
    titulo: "Defina quem NÃO é seu cliente",
    resumo: "Tentar agradar todo mundo dilui sua marca.",
    texto: "Philip Kotler, um dos pais do marketing moderno, defendia que a segmentação é a base de qualquer estratégia eficaz. Uma barbearia que tenta ser \"para todo mundo\" acaba não sendo memorável para ninguém. Escolha um público mais específico (executivos, pais, universitários) e fale diretamente com ele — o resto vem como consequência.",
  },
  {
    categoria: "Conteúdo",
    titulo: "Mostre o processo, não só o resultado",
    resumo: "Bastidores geram mais conexão que fotos finalizadas.",
    texto: "Um Reels mostrando a técnica de degradê em construção gera mais retenção de visualização do que a foto final do corte pronto. As pessoas se interessam por como as coisas são feitas — isso também constrói percepção de profissionalismo e cuidado técnico.",
  },
  {
    categoria: "Recorrência",
    titulo: "Lembre o cliente antes que ele esqueça de você",
    resumo: "O cliente não some por insatisfação — some por esquecimento.",
    texto: "A maior parte da perda de clientes em barbearias não é insatisfação, é simplesmente o cliente esquecer de remarcar. Uma mensagem simples de WhatsApp 3-4 semanas depois do último corte (\"Bora dar uma repaginada?\") recupera uma fatia relevante de clientes que iriam parar de voltar.",
  },
  {
    categoria: "Tom de voz",
    titulo: "Escreva como você fala, não como uma empresa",
    resumo: "Legendas formais demais soam distantes.",
    texto: "Se você não diria aquela frase em voz alta para um cliente na cadeira, provavelmente não deveria escrevê-la na legenda. Tom de voz consistente — seja descontraído, direto ou sofisticado — é o que faz a marca parecer uma pessoa de verdade, não um departamento de marketing genérico.",
  },
]

export default function Biblioteca() {
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <div style={{minHeight:"100vh"}}>
      <header style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <BookOpen size={16} style={{color:"var(--acc)"}}/>
          <span className="font-display" style={{fontSize:"1.1rem"}}>Biblioteca</span>
        </div>
      </header>

      <main style={{maxWidth:680,margin:"0 auto",padding:"24px 20px 100px"}}>
        <div style={{marginBottom:22}}>
          <div className="label" style={{marginBottom:6}}>ESTRATÉGIA E MARKETING</div>
          <p style={{fontSize:".84rem",color:"var(--fg-dim)",lineHeight:1.5}}>
            Princípios de marketing aplicados ao dia a dia da barbearia — para pensar além do post de hoje.
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {DICAS.map((d, i) => {
            const isOpen = aberto === i
            return (
              <div key={i} className="glass2" style={{padding:"16px 18px",cursor:"pointer"}} onClick={()=>setAberto(isOpen ? null : i)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,position:"relative",zIndex:1}}>
                  <div style={{flex:1}}>
                    <div className="label" style={{marginBottom:6,fontSize:".6rem"}}>{d.categoria.toUpperCase()}</div>
                    <div style={{fontWeight:600,fontSize:".92rem",marginBottom:isOpen?8:2}}>{d.titulo}</div>
                    {!isOpen && <div style={{fontSize:".78rem",color:"var(--fg-faint)"}}>{d.resumo}</div>}
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{flexShrink:0,marginTop:2}}>
                    <ChevronDown size={16} style={{color:"var(--fg-faint)"}}/>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden", position: "relative", zIndex: 1 }}>
                      <p style={{fontSize:".84rem",color:"var(--fg-dim)",lineHeight:1.6,paddingTop:4}}>{d.texto}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="card" style={{marginTop:18,padding:"16px 18px",display:"flex",gap:12,alignItems:"flex-start"}}>
          <Lightbulb size={16} style={{color:"var(--acc)",flexShrink:0,marginTop:2}}/>
          <p style={{fontSize:".8rem",color:"var(--fg-faint)",lineHeight:1.5}}>
            Novas dicas são adicionadas regularmente. Tem um tema que gostaria de ver aqui? Fale com a gente em Configurações.
          </p>
        </div>
      </main>
      <TabBar/>
    </div>
  )
}
