import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import Groq from "groq-sdk"
import { supabaseServer } from "@/lib/supabase-server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const TIPO_LABEL: Record<string, string> = {
  post: "post de feed",
  story: "story",
  reel_script: "roteiro de Reels",
  legenda: "legenda standalone",
  promocao: "post promocional",
}

function montarPrompt(marca: {
  nome: string; cidade: string; tipo: string; servicos: string[]
  publico: string[]; tom: string; palavras?: string[]
}, tipo: string, rede: string, tema?: string) {
  return `Você é um copywriter especialista em redes sociais para barbearias brasileiras.

PERFIL DA MARCA:
- Nome: ${marca.nome}
- Cidade: ${marca.cidade}
- Tipo: ${marca.tipo}
- Serviços: ${marca.servicos.join(", ")}
- Público: ${marca.publico.join(", ")}
- Tom de voz: ${marca.tom}
${marca.palavras?.length ? `- Palavras/expressões típicas do público: ${marca.palavras.join(", ")}` : ""}

TAREFA:
Crie um ${TIPO_LABEL[tipo] || "post"} para ${rede}${tema ? ` sobre: ${tema}` : ""}.

Responda em JSON puro, sem markdown, sem crases, no formato exato:
{"titulo": "título curto interno para identificar o conteúdo", "conteudo": "o texto do post/legenda/roteiro completo", "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}

Regras:
- Tom de voz: ${marca.tom}.
- Nunca use emoji em excesso (no máximo 2-3 no texto todo).
- Hashtags em português, relevantes para barbearia e cidade (${marca.cidade}).
- Se for roteiro de Reels, estruture em cenas curtas (Cena 1, Cena 2...) com indicação visual.
- Nunca invente promoções, preços ou disponibilidade que não foram informados.`
}

async function gerarComClaude(prompt: string) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })
  return msg.content.find(b => b.type === "text")?.text || "{}"
}

async function gerarComGroq(prompt: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1024,
  })
  return completion.choices[0]?.message?.content || "{}"
}

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { marca_id, tipo, rede, tema, motor } = await request.json()
  const motorEscolhido: "claude" | "groq" = motor === "groq" ? "groq" : "claude"

  const { data: assinatura } = await supabase
    .from("assinaturas")
    .select("plano_id, conteudos_usados_mes")
    .eq("user_id", user.id)
    .single()

  const { data: plano } = await supabase
    .from("planos")
    .select("limite_conteudos_mes")
    .eq("id", assinatura?.plano_id || "free")
    .single()

  if (assinatura && plano && assinatura.conteudos_usados_mes >= plano.limite_conteudos_mes) {
    return NextResponse.json({ error: "Limite de conteúdos do plano atingido. Faça upgrade para continuar." }, { status: 403 })
  }

  const { data: marca } = await supabase
    .from("marcas")
    .select("*")
    .eq("id", marca_id)
    .eq("user_id", user.id)
    .single()

  if (!marca) return NextResponse.json({ error: "Marca não encontrada" }, { status: 404 })

  const prompt = montarPrompt(marca, tipo, rede, tema)

  let raw = ""
  try {
    raw = motorEscolhido === "groq" ? await gerarComGroq(prompt) : await gerarComClaude(prompt)
  } catch {
    // Fallback automático: se um motor falhar, tenta o outro antes de desistir
    try {
      raw = motorEscolhido === "groq" ? await gerarComClaude(prompt) : await gerarComGroq(prompt)
    } catch {
      return NextResponse.json({ error: "Erro ao gerar conteúdo. Tente novamente." }, { status: 500 })
    }
  }

  let parsed: { titulo: string; conteudo: string; hashtags: string[] }
  try {
    const clean = raw.replace(/```json|```/g, "").trim()
    parsed = JSON.parse(clean)
  } catch {
    return NextResponse.json({ error: "Erro ao interpretar a resposta gerada." }, { status: 500 })
  }

  const { data: novoConteudo, error: insertError } = await supabase
    .from("conteudos")
    .insert({
      marca_id,
      user_id: user.id,
      tipo,
      rede,
      titulo: parsed.titulo,
      conteudo: parsed.conteudo,
      hashtags: parsed.hashtags || [],
      status: "rascunho",
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 })

  const novoUso = (assinatura?.conteudos_usados_mes || 0) + 1
  await supabase
    .from("assinaturas")
    .update({ conteudos_usados_mes: novoUso })
    .eq("user_id", user.id)

  // ── AUTOMAÇÃO (substitui fluxo n8n) ──
  // Regra: ao se aproximar do limite do plano, sinaliza para o front sugerir upgrade.
  let aviso: string | null = null
  if (plano && novoUso === Math.ceil(plano.limite_conteudos_mes * 0.8)) {
    aviso = "Você já usou 80% dos conteúdos deste mês. Considere um upgrade para não ficar sem."
  }

  return NextResponse.json({ conteudo: novoConteudo, motor: motorEscolhido, aviso })
}
