import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://fade-e4jf.vercel.app"),
  title: {
    default: "FADE Conteúdo — Conteúdo para Redes Sociais de Barbearias",
    template: "%s | FADE Conteúdo",
  },
  description: "FADE gera posts, legendas e roteiros de Reels para barbearias em minutos, com inteligência artificial e a identidade da sua marca. Pare de perder horas criando conteúdo.",
  keywords: ["conteúdo para barbearia", "marketing para barbearia", "instagram para barbearia", "ia para redes sociais", "agência de barbearia", "posts para barbearia", "gerador de conteúdo com ia"],
  authors: [{ name: "FADE" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FADE",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "FADE Conteúdo — Conteúdo para Redes Sociais de Barbearias",
    description: "Gere posts, legendas e roteiros de Reels para sua barbearia em minutos, com IA e a identidade da sua marca.",
    siteName: "FADE Conteúdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "FADE Conteúdo — Conteúdo para Redes Sociais de Barbearias",
    description: "Gere posts, legendas e roteiros de Reels para sua barbearia em minutos, com IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
