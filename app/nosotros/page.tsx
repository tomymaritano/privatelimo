import { Metadata } from "next"
import { Trophy, Shield, Users, Target, Heart, Clock } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sobre Nosotros - PrivateLimo",
  description: "Conoce la historia de PrivateLimo, nuestros valores y el equipo comprometido con brindarte el mejor servicio de transporte ejecutivo.",
}

const values = [
  {
    icon: Shield,
    title: "Seguridad Primero",
    description: "Conductores certificados y vehículos inspeccionados regularmente para tu tranquilidad.",
  },
  {
    icon: Trophy,
    title: "Excelencia",
    description: "Nos esforzamos por superar expectativas en cada viaje con atención al detalle.",
  },
  {
    icon: Clock,
    title: "Puntualidad",
    description: "Tu tiempo es valioso. Garantizamos llegadas y salidas según lo programado.",
  },
  {
    icon: Heart,
    title: "Servicio Personalizado",
    description: "Cada cliente es único y adaptamos nuestro servicio a sus necesidades específicas.",
  },
]

const milestones = [
  { year: "2015", event: "Fundación de PrivateLimo con 3 vehículos" },
  { year: "2017", event: "Expansión de flota a 15 vehículos de lujo" },
  { year: "2019", event: "Lanzamiento de app móvil y reservas online" },
  { year: "2021", event: "Certificación ISO 9001 en calidad de servicio" },
  { year: "2023", event: "Flota 100% híbrida y eléctrica" },
  { year: "2024", event: "Más de 50,000 clientes satisfechos" },
]

const team = [
  {
    name: "Roberto Martínez",
    role: "CEO & Fundador",
    bio: "Con más de 20 años en la industria del transporte de lujo.",
  },
  {
    name: "Laura González",
    role: "Directora de Operaciones",
    bio: "Experta en logística y gestión de flotas premium.",
  },
  {
    name: "Carlos Rodríguez",
    role: "Jefe de Conductores",
    bio: "Garantiza los más altos estándares de profesionalismo.",
  },
  {
    name: "Ana Silva",
    role: "Gerente de Experiencia al Cliente",
    bio: "Dedicada a crear experiencias memorables para cada cliente.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 sm:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-secondary-900 mb-6">
                Redefiniendo el Transporte Ejecutivo desde 2015
              </h1>
              <p className="text-lg text-secondary-600 mb-6">
                En PrivateLimo, no solo ofrecemos transporte; creamos experiencias
                excepcionales. Desde nuestra fundación, hemos establecido el estándar
                en servicio de limusinas y transporte ejecutivo premium.
              </p>
              <p className="text-lg text-secondary-600">
                Nuestra misión es simple: proporcionar el más alto nivel de servicio,
                comodidad y confiabilidad en cada viaje, superando las expectativas
                de nuestros clientes más exigentes.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-primary-700 font-semibold text-lg">
                    Imagen del equipo PrivateLimo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y definen nuestra cultura empresarial
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-600 mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-secondary-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-secondary-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Un viaje de crecimiento constante y compromiso con la excelencia
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                      {milestone.year}
                    </h3>
                    <p className="text-secondary-600">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Profesionales apasionados dedicados a brindarte el mejor servicio
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 flex items-center justify-center">
                  <Users className="h-12 w-12 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-secondary-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white mb-2">50K+</p>
              <p className="text-primary-100">Clientes Satisfechos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">30+</p>
              <p className="text-primary-100">Vehículos de Lujo</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">24/7</p>
              <p className="text-primary-100">Disponibilidad</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">4.9★</p>
              <p className="text-primary-100">Calificación Promedio</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Únete a Miles de Clientes Satisfechos
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Descubre por qué somos la primera opción en transporte ejecutivo premium.
              Tu próximo viaje de lujo te espera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/flota">Explorar Nuestra Flota</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contacto">Contactar</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}