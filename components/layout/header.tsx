"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils/cn"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Servicios", href: "/servicios" },
  { name: "Flota", href: "/flota" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Contacto", href: "/contacto" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-display font-bold text-primary-700">
                PrivateLimo
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+1234567890">
                <Phone className="h-4 w-4" />
                Llamar Ahora
              </a>
            </Button>
            <Button size="sm">
              Reservar Viaje
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={cn(
          "lg:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}>
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2 px-3">
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+1234567890">
                  <Phone className="h-4 w-4" />
                  Llamar Ahora
                </a>
              </Button>
              <Button className="w-full">
                Reservar Viaje
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}