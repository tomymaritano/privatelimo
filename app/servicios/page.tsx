import { Metadata } from "next"
import { Plane, Building2, Heart, MapPin, Users, Briefcase, CheckCircle2 } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Servicios - PrivateLimo",
  description: "Descubre nuestra amplia gama de servicios de transporte ejecutivo premium adaptados a tus necesidades.",
}

const services = [
  {
    id: "aeropuerto",
    icon: Plane,
    title: "Traslados Aeropuerto",
    description: "Servicio de transporte confiable y puntual desde y hacia todos los aeropuertos principales.",
    features: [
      "Monitoreo de vuelos en tiempo real",
      "30 minutos de espera gratuita",
      "Asistencia con equipaje",
      "Servicio puerta a puerta",
      "Tarifas fijas sin sorpresas",
    ],
    image: "/images/services/airport-transfer.jpg",
  },
  {
    id: "corporativo",
    icon: Building2,
    title: "Eventos Corporativos",
    description: "Transporte ejecutivo profesional para reuniones de negocios, conferencias y eventos empresariales.",
    features: [
      "Conductores con experiencia ejecutiva",
      "Facturación empresarial",
      "Cuentas corporativas",
      "Reservas para grupos",
      "Servicio 24/7",
    ],
    image: "/images/services/corporate.jpg",
  },
  {
    id: "eventos",
    icon: Heart,
    title: "Bodas y Celebraciones",
    description: "Haz que tu día especial sea aún más memorable con nuestros vehículos de lujo y servicio excepcional.",
    features: [
      "Decoración personalizada",
      "Champagne de cortesía",
      "Coordinación con planificadores",
      "Múltiples vehículos disponibles",
      "Servicio de fotografía",
    ],
    image: "/images/services/weddings.jpg",
  },
  {
    id: "tours",
    icon: MapPin,
    title: "City Tours Privados",
    description: "Explora la ciudad con estilo y comodidad en tours personalizados con conductores conocedores.",
    features: [
      "Rutas personalizables",
      "Guías multilingües",
      "Paradas ilimitadas",
      "Recomendaciones locales",
      "Tours de medio día o día completo",
    ],
    image: "/images/services/city-tours.jpg",
  },
  {
    id: "grupos",
    icon: Users,
    title: "Transporte para Grupos",
    description: "Soluciones de transporte para grupos grandes con nuestra flota de vehículos espaciosos.",
    features: [
      "Vehículos para hasta 20 personas",
      "Coordinación de múltiples vehículos",
      "Tarifas grupales especiales",
      "Planificación de rutas",
      "Servicio de coordinador dedicado",
    ],
    image: "/images/services/group-transport.jpg",
  },
  {
    id: "horas",
    icon: Briefcase,
    title: "Servicio por Horas",
    description: "Máxima flexibilidad con un conductor y vehículo a tu disposición por el tiempo que necesites.",
    features: [
      "Mínimo 2 horas",
      "Conductor dedicado",
      "Cambios de destino ilimitados",
      "Ideal para múltiples reuniones",
      "Tarifas por hora competitivas",
    ],
    image: "/images/services/hourly-service.jpg",
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 sm:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-secondary-900 mb-6">
              Nuestros Servicios Premium
            </h1>
            <p className="text-lg text-secondary-600">
              Ofrecemos una experiencia de transporte ejecutivo incomparable,
              adaptada a cada necesidad con la más alta calidad y profesionalismo.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Detail */}
      <section className="py-16">
        <Container>
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-600 mb-4">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-secondary-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span className="text-secondary-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild>
                    <Link href="/contacto">Solicitar Cotización</Link>
                  </Button>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary-200 to-secondary-300 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-secondary-600 font-medium">
                        {service.title} - Imagen
                      </p>
                    </div>
                  </div>
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
              ¿No encuentras el servicio que necesitas?
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Ofrecemos soluciones personalizadas para cualquier necesidad de transporte.
              Contáctanos para discutir tu requerimiento específico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contacto">Contactar Ahora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+1234567890">Llamar: +1 (234) 567-890</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}