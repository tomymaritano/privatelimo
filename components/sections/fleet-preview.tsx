import Link from "next/link"
import { Users, Fuel, Briefcase, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

const vehicles = [
  {
    name: "Mercedes-Benz S-Class",
    category: "Sedan Ejecutivo",
    capacity: 3,
    features: ["WiFi", "Agua", "Cargadores USB"],
    image: "/images/vehicles/mercedes-s-class.jpg",
  },
  {
    name: "BMW 7 Series",
    category: "Sedan Premium",
    capacity: 3,
    features: ["Asientos masaje", "Climatización", "Sistema de sonido premium"],
    image: "/images/vehicles/bmw-7-series.jpg",
  },
  {
    name: "Cadillac Escalade",
    category: "SUV de Lujo",
    capacity: 6,
    features: ["Amplio espacio", "Entretenimiento", "Ideal para grupos"],
    image: "/images/vehicles/cadillac-escalade.jpg",
  },
]

export function FleetPreview() {
  return (
    <section className="py-24 bg-secondary-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-secondary-900 mb-4">
            Nuestra Flota de Lujo
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Vehículos de última generación mantenidos en perfectas condiciones
            para tu comodidad y seguridad
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary-200 to-secondary-300 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-secondary-600 font-medium">{vehicle.name}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-primary-600 font-medium mb-1">
                  {vehicle.category}
                </p>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {vehicle.name}
                </h3>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-secondary-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{vehicle.capacity} pasajeros</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>Equipaje grande</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {vehicle.features.map((feature) => (
                    <p key={feature} className="text-sm text-secondary-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/flota">
              Ver Toda la Flota
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}