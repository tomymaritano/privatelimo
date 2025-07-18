"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Users, Briefcase, Fuel, Wifi, Music, Snowflake } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"

// export const metadata: Metadata = {
//   title: "Nuestra Flota - PrivateLimo",
//   description: "Explora nuestra flota de vehículos de lujo, desde sedanes ejecutivos hasta SUVs espaciosas.",
// }

const categories = [
  { id: "all", name: "Todos", count: 12 },
  { id: "sedan", name: "Sedanes", count: 5 },
  { id: "suv", name: "SUVs", count: 4 },
  { id: "van", name: "Vans", count: 3 },
]

const vehicles = [
  {
    id: 1,
    name: "Mercedes-Benz S-Class",
    category: "sedan",
    type: "Sedan Ejecutivo",
    capacity: 3,
    luggage: 3,
    features: ["WiFi", "Climatización", "Asientos de cuero", "Sistema de sonido premium"],
    description: "El epítome del lujo y la elegancia. Perfecto para ejecutivos y ocasiones especiales.",
    priceRange: "$$$",
  },
  {
    id: 2,
    name: "BMW 7 Series",
    category: "sedan",
    type: "Sedan Premium",
    capacity: 3,
    luggage: 3,
    features: ["Asientos con masaje", "Techo panorámico", "Control de clima multizona", "Cargadores USB"],
    description: "Combina deportividad con lujo supremo. Ideal para viajes de negocios.",
    priceRange: "$$$",
  },
  {
    id: 3,
    name: "Audi A8 L",
    category: "sedan",
    type: "Sedan de Lujo",
    capacity: 3,
    luggage: 2,
    features: ["Matrix LED", "Bang & Olufsen", "Asientos ventilados", "WiFi hotspot"],
    description: "Tecnología de vanguardia y confort excepcional en cada viaje.",
    priceRange: "$$$",
  },
  {
    id: 4,
    name: "Tesla Model S",
    category: "sedan",
    type: "Sedan Eléctrico",
    capacity: 4,
    luggage: 2,
    features: ["100% eléctrico", "Autopilot", "Pantalla táctil 17\"", "Carga rápida"],
    description: "Lujo sustentable con la última tecnología en vehículos eléctricos.",
    priceRange: "$$",
  },
  {
    id: 5,
    name: "Mercedes-Benz E-Class",
    category: "sedan",
    type: "Sedan Business",
    capacity: 4,
    luggage: 3,
    features: ["MBUX", "Asistente de voz", "Iluminación ambiental", "Navegación AR"],
    description: "Elegancia y eficiencia para el día a día ejecutivo.",
    priceRange: "$$",
  },
  {
    id: 6,
    name: "Cadillac Escalade",
    category: "suv",
    type: "SUV de Lujo",
    capacity: 6,
    luggage: 6,
    features: ["Pantallas OLED", "Super Cruise", "AKG Studio", "Refrigerador"],
    description: "Espacio y lujo sin compromisos. Perfecto para grupos y familias.",
    priceRange: "$$$",
  },
  {
    id: 7,
    name: "Lincoln Navigator",
    category: "suv",
    type: "SUV Premium",
    capacity: 7,
    luggage: 5,
    features: ["Asientos Perfect Position", "Revel Ultima", "Suspensión adaptativa", "WiFi 4G"],
    description: "Confort supremo con espacio para toda la familia o equipo de trabajo.",
    priceRange: "$$$",
  },
  {
    id: 8,
    name: "BMW X7",
    category: "suv",
    type: "SUV Ejecutiva",
    capacity: 6,
    luggage: 4,
    features: ["Sky Lounge", "Bowers & Wilkins", "Gesture Control", "Asientos calefactados"],
    description: "Presencia imponente con la deportividad característica de BMW.",
    priceRange: "$$$",
  },
  {
    id: 9,
    name: "Range Rover",
    category: "suv",
    type: "SUV Todo Terreno",
    capacity: 5,
    luggage: 4,
    features: ["Terrain Response", "Meridian Sound", "Píxel LED", "Climatización 4 zonas"],
    description: "Lujo británico con capacidades todoterreno incomparables.",
    priceRange: "$$$",
  },
  {
    id: 10,
    name: "Mercedes-Benz Sprinter",
    category: "van",
    type: "Van Ejecutiva",
    capacity: 12,
    luggage: 12,
    features: ["Asientos reclinables", "Mesa de conferencias", "Minibar", "TV LED"],
    description: "Solución perfecta para grupos grandes con máximo confort.",
    priceRange: "$$",
  },
  {
    id: 11,
    name: "Cadillac Escalade ESV",
    category: "van",
    type: "Van de Lujo",
    capacity: 8,
    luggage: 8,
    features: ["Entretenimiento trasero", "Asientos captain", "Cargadores inalámbricos", "Cortinas eléctricas"],
    description: "Versión extendida con espacio adicional para grupos VIP.",
    priceRange: "$$$",
  },
  {
    id: 12,
    name: "Mercedes-Benz V-Class",
    category: "van",
    type: "Van Premium",
    capacity: 7,
    luggage: 7,
    features: ["Configuración VIP", "Burmester 3D", "Mesas plegables", "Refrigerador integrado"],
    description: "Versatilidad y lujo para viajes en grupo con estilo.",
    priceRange: "$$",
  },
]

const featureIcons: Record<string, any> = {
  "WiFi": Wifi,
  "Climatización": Snowflake,
  "Sistema de sonido premium": Music,
  "Bang & Olufsen": Music,
  "Bowers & Wilkins": Music,
  "Burmester 3D": Music,
  "AKG Studio": Music,
  "Revel Ultima": Music,
  "Meridian Sound": Music,
}

export default function FleetPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const filteredVehicles = selectedCategory === "all" 
    ? vehicles 
    : vehicles.filter(v => v.category === selectedCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 sm:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-secondary-900 mb-6">
              Nuestra Flota de Lujo
            </h1>
            <p className="text-lg text-secondary-600">
              Cada vehículo en nuestra flota es cuidadosamente seleccionado y mantenido
              para garantizar la máxima comodidad, seguridad y estilo en cada viaje.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 z-40 bg-white border-b">
        <Container>
          <div className="flex gap-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "pb-2 px-1 border-b-2 whitespace-nowrap transition-colors",
                  selectedCategory === category.id
                    ? "border-primary-600 text-primary-600 font-semibold"
                    : "border-transparent text-secondary-600 hover:text-secondary-900"
                )}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Vehicles Grid */}
      <section className="py-16">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-secondary-100"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary-200 to-secondary-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-secondary-600 font-medium text-center px-4">
                      {vehicle.name}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-secondary-900">
                      {vehicle.priceRange}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-primary-600 font-medium mb-1">
                    {vehicle.type}
                  </p>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-4">
                    {vehicle.description}
                  </p>
                  
                  {/* Capacity */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-secondary-600">
                      <Users className="h-4 w-4" />
                      <span>{vehicle.capacity} pasajeros</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{vehicle.luggage} maletas</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-secondary-700 mb-2">
                      CARACTERÍSTICAS DESTACADAS:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.slice(0, 3).map((feature) => {
                        const Icon = featureIcons[feature] || null
                        return (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-1 text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full"
                          >
                            {Icon && <Icon className="h-3 w-3" />}
                            {feature}
                          </span>
                        )
                      })}
                      {vehicle.features.length > 3 && (
                        <span className="text-xs text-secondary-500">
                          +{vehicle.features.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href="/contacto">Reservar Este Vehículo</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              ¿Necesitas algo especial?
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Si tienes requerimientos específicos o necesitas un vehículo especial,
              contáctanos y encontraremos la solución perfecta para ti.
            </p>
            <Button size="lg" asChild>
              <Link href="/contacto">Contactar con un Asesor</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}