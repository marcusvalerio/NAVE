import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  // Apaga marca, conteúdos, métricas e assinatura via função no banco
  const { error } = await supabase.rpc("excluir_dados_usuario", { p_user_id: user.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Encerra a sessão. A remoção do registro em auth.users requer a service role key
  // e deve ser feita por um processo administrativo (não exposto ao client).
  await supabase.auth.signOut()

  return NextResponse.json({ ok: true })
}
