import { NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Garante que existe assinatura free para o usuário
      await supabase
        .from("assinaturas")
        .upsert({ user_id: data.user.id, plano_id: "free" }, { onConflict: "user_id", ignoreDuplicates: true })

      // Verifica se há marca já criada
      const { data: marcaExistente } = await supabase
        .from("marcas")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle()

      if (!marcaExistente && data.user.email) {
        // Busca dados pendentes do onboarding salvos no banco
        const { data: pendente } = await supabase
          .from("onboarding_pendente")
          .select("dados")
          .eq("email", data.user.email)
          .maybeSingle()

        if (pendente?.dados) {
          const d = pendente.dados as Record<string, unknown>
          await supabase.from("marcas").insert({
            user_id: data.user.id,
            nome: d.nome, cidade: d.cidade, tipo: d.tipo,
            servicos: d.servicos, publico: d.publico, tom: d.tom,
            palavras: d.palavras, redes: d.redes,
            admin_nome: d.admin_nome, admin_whatsapp: d.admin_whatsapp,
            consentimento_aceito_em: d.consentimento_aceito_em,
            consentimento_versao: d.consentimento_versao,
          })
          // Limpa o registro pendente após consumir
          await supabase.from("onboarding_pendente").delete().eq("email", data.user.email)
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
