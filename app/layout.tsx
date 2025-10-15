import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "PrivateLimo - Servicio Premium de Transporte Ejecutivo",
  description: "Experiencia de lujo en transporte ejecutivo. Servicio de limusinas y vehículos premium para aeropuertos, eventos corporativos y ocasiones especiales.",
  keywords: "limusina, transporte ejecutivo, servicio premium, aeropuerto, eventos corporativos",
  openGraph: {
    title: "PrivateLimo - Servicio Premium de Transporte Ejecutivo",
    description: "Experiencia de lujo en transporte ejecutivo. Servicio de limusinas y vehículos premium para aeropuertos, eventos corporativos y ocasiones especiales.",
    type: "website",
    locale: "es_ES",
    siteName: "PrivateLimo",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrivateLimo - Servicio Premium de Transporte Ejecutivo",
    description: "Experiencia de lujo en transporte ejecutivo. Servicio de limusinas y vehículos premium para aeropuertos, eventos corporativos y ocasiones especiales.",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
