import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const [marca, assinatura, conteudos] = await Promise.all([
    supabase.from("marcas").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("assinaturas").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("conteudos").select("*").eq("user_id", user.id),
  ])

  const exportacao = {
    gerado_em: new Date().toISOString(),
    titular: { id: user.id, email: user.email, criado_em: user.created_at },
    marca: marca.data,
    assinatura: assinatura.data,
    conteudos: conteudos.data,
  }

  return new NextResponse(JSON.stringify(exportacao, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="fade-meus-dados-${user.id}.json"`,
    },
  })
}
