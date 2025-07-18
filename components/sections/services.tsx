import Link from "next/link"
import { Plane, Building2, Heart, MapPin, Users, Briefcase } from "lucide-react"
import { Container } from "@/components/ui/container"

const services = [
  {
    name: "Traslados Aeropuerto",
    description: "Servicio puntual y confiable desde y hacia todos los aeropuertos principales.",
    icon: Plane,
    href: "/servicios#aeropuerto",
  },
  {
    name: "Eventos Corporativos",
    description: "Transporte ejecutivo para reuniones, conferencias y eventos empresariales.",
    icon: Building2,
    href: "/servicios#corporativo",
  },
  {
    name: "Bodas y Celebraciones",
    description: "Haz tu día especial aún más memorable con nuestros vehículos de lujo.",
    icon: Heart,
    href: "/servicios#eventos",
  },
  {
    name: "City Tours",
    description: "Descubre la ciudad con estilo y comodidad en tours personalizados.",
    icon: MapPin,
    href: "/servicios#tours",
  },
  {
    name: "Viajes Grupales",
    description: "Soluciones de transporte para grupos grandes con vehículos espaciosos.",
    icon: Users,
    href: "/servicios#grupos",
  },
  {
    name: "Servicio por Horas",
    description: "Flexibilidad total con chofer a tu disposición por el tiempo que necesites.",
    icon: Briefcase,
    href: "/servicios#horas",
  },
]

export function Services() {
  return (
    <section id="servicios" className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-secondary-900 mb-4">
            Nuestros Servicios Premium
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de transporte ejecutivo
            adaptados a tus necesidades específicas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-secondary-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-secondary-600">
                {service.description}
              </p>
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="h-5 w-5 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}