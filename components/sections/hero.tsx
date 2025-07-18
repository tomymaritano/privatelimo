import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-secondary-50 to-white pt-16 pb-24 sm:pt-24 sm:pb-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <span className="text-sm text-secondary-600">
                +500 clientes satisfechos
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">
              Experiencia Premium en{" "}
              <span className="text-primary-600">Transporte Ejecutivo</span>
            </h1>
            
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Servicio de lujo con conductores profesionales, vehículos de alta gama
              y atención personalizada para todos tus traslados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" asChild>
                <Link href="/reservar">
                  Reservar Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/flota">Ver Nuestra Flota</Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <Shield className="h-8 w-8 text-primary-600 mb-2 mx-auto lg:mx-0" />
                <p className="text-sm font-semibold text-secondary-900">
                  100% Seguro
                </p>
                <p className="text-xs text-secondary-600">
                  Conductores certificados
                </p>
              </div>
              <div className="text-center lg:text-left">
                <Clock className="h-8 w-8 text-primary-600 mb-2 mx-auto lg:mx-0" />
                <p className="text-sm font-semibold text-secondary-900">
                  24/7 Disponible
                </p>
                <p className="text-xs text-secondary-600">
                  Servicio todo el año
                </p>
              </div>
              <div className="text-center lg:text-left">
                <Star className="h-8 w-8 text-primary-600 mb-2 mx-auto lg:mx-0" />
                <p className="text-sm font-semibold text-secondary-900">
                  5 Estrellas
                </p>
                <p className="text-xs text-secondary-600">
                  Calificación promedio
                </p>
              </div>
            </div>
          </div>
          
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-primary-700 font-semibold text-lg">
                  Imagen de vehículo premium
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent-100 rounded-full blur-3xl opacity-30" />
          </div>
        </div>
      </Container>
    </section>
  )
}