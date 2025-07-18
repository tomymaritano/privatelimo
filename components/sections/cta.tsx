import Link from "next/link"
import { Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            ¿Listo para Experimentar el Lujo?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Reserva tu próximo viaje con nosotros y descubre por qué somos
            la primera opción en transporte ejecutivo premium
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link href="/reservar">
                <Calendar className="mr-2 h-5 w-5" />
                Reservar Ahora
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              asChild
            >
              <a href="tel:+1234567890">
                <Phone className="mr-2 h-5 w-5" />
                Llamar: +1 (234) 567-890
              </a>
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-primary-100">
            Disponible 24/7 • Respuesta inmediata • Sin cargos ocultos
          </p>
        </div>
      </Container>
    </section>
  )
}