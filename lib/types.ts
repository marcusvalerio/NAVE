export interface Marca {
  id: string
  user_id: string
  nome: string
  cidade: string
  tipo: string
  servicos: string[]
  publico: string[]
  tom: string
  palavras: string[]
  redes: string[]
  created_at: string
  updated_at: string
}

export interface Plano {
  id: string
  nome: string
  preco_mensal: number
  limite_conteudos_mes: number
  recursos: string[]
  ordem: number
}

export interface Assinatura {
  id: string
  user_id: string
  plano_id: string
  status: "ativa" | "cancelada" | "trial" | "inadimplente"
  conteudos_usados_mes: number
  ciclo_inicio: string
}

export interface Conteudo {
  id: string
  marca_id: string
  user_id: string
  tipo: "post" | "story" | "reel_script" | "legenda" | "promocao"
  titulo: string
  conteudo: string
  hashtags: string[]
  rede: "instagram" | "tiktok" | "facebook" | "whatsapp"
  status: "rascunho" | "agendado" | "publicado" | "arquivado"
  data_agendada: string | null
  data_publicado: string | null
  created_at: string
  updated_at: string
}
