import { Star, Quote } from "lucide-react"
import { Container } from "@/components/ui/container"

const testimonials = [
  {
    name: "María González",
    role: "CEO, TechCorp",
    content: "El servicio de PrivateLimo es excepcional. Siempre puntuales, vehículos impecables y conductores muy profesionales. Los uso para todos mis viajes de negocios.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "Director de Eventos",
    content: "Hemos utilizado PrivateLimo para múltiples eventos corporativos. Su atención al detalle y flexibilidad para adaptarse a nuestras necesidades es incomparable.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Empresaria",
    content: "La mejor experiencia en transporte ejecutivo. Los conductores conocen perfectamente la ciudad y siempre encuentran las rutas más eficientes. Altamente recomendado.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonios" className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-secondary-900 mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-secondary-50 rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-200" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent-400 text-accent-400" />
                ))}
              </div>
              
              <p className="text-secondary-700 mb-6 relative z-10">
                "{testimonial.content}"
              </p>
              
              <div>
                <p className="font-semibold text-secondary-900">
                  {testimonial.name}
                </p>
                <p className="text-sm text-secondary-600">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}