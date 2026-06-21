import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await request.json()
  const { nome, cidade, tipo, servicos, publico, tom, palavras, redes, consentimento_aceito_em, consentimento_versao } = body

  const { data: existing } = await supabase
    .from("marcas")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("marcas")
      .update({ nome, cidade, tipo, servicos, publico, tom, palavras, redes })
      .eq("id", existing.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ id: existing.id })
  }

  const { data, error } = await supabase
    .from("marcas")
    .insert({
      user_id: user.id, nome, cidade, tipo, servicos, publico, tom, palavras, redes,
      consentimento_aceito_em: consentimento_aceito_em || new Date().toISOString(),
      consentimento_versao: consentimento_versao || "v1",
    })
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: data.id })
}

export async function GET() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { data } = await supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle()
  return NextResponse.json({ marca: data })
}
