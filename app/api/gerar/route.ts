import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { supabaseServer } from "@/lib/supabase-server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TIPO_LABEL: Record<string, string> = {
  post: "post de feed",
  story: "story",
  reel_script: "roteiro de Reels",
  legenda: "legenda standalone",
  promocao: "post promocional",
}

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { marca_id, tipo, rede, tema } = await request.json()

  // Verificar limite do plano
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

  const prompt = `Você é um copywriter especialista em redes sociais para barbearias brasileiras.

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

  let raw = ""
  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })
    raw = msg.content.find(b => b.type === "text")?.text || "{}"
  } catch (e) {
    return NextResponse.json({ error: "Erro ao gerar conteúdo. Tente novamente." }, { status: 500 })
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

  await supabase
    .from("assinaturas")
    .update({ conteudos_usados_mes: (assinatura?.conteudos_usados_mes || 0) + 1 })
    .eq("user_id", user.id)

  return NextResponse.json({ conteudo: novoConteudo })
}
