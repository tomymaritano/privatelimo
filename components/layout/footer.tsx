import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"
import { Container } from "@/components/ui/container"

const navigation = {
  empresa: [
    { name: "Sobre Nosotros", href: "/nosotros" },
    { name: "Nuestra Flota", href: "/flota" },
    { name: "Testimonios", href: "/#testimonios" },
    { name: "Blog", href: "/blog" },
  ],
  servicios: [
    { name: "Traslados Aeropuerto", href: "/servicios#aeropuerto" },
    { name: "Eventos Corporativos", href: "/servicios#corporativo" },
    { name: "Bodas y Eventos", href: "/servicios#eventos" },
    { name: "City Tours", href: "/servicios#tours" },
  ],
  legal: [
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "Términos de Servicio", href: "/terminos" },
    { name: "Política de Cancelación", href: "/cancelacion" },
  ],
}

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Company info */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-display font-bold mb-4">
                PrivateLimo
              </h3>
              <p className="text-sm text-secondary-300 mb-6">
                Servicio premium de transporte ejecutivo. Experiencia, seguridad y confort en cada viaje.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-secondary-300 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +1 (234) 567-890
                </a>
                <a
                  href="mailto:info@privatelimo.com"
                  className="flex items-center gap-2 text-sm text-secondary-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  info@privatelimo.com
                </a>
                <div className="flex items-start gap-2 text-sm text-secondary-300">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>
                    123 Business Ave,<br />
                    Miami, FL 33131
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation columns */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold mb-4">Empresa</h4>
                <ul className="space-y-3">
                  {navigation.empresa.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-secondary-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4">Servicios</h4>
                <ul className="space-y-3">
                  {navigation.servicios.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-secondary-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4">Legal</h4>
                <ul className="space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-secondary-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-semibold mb-4">
                Suscríbete a nuestro Newsletter
              </h4>
              <p className="text-sm text-secondary-300 mb-4">
                Recibe ofertas exclusivas y novedades directamente en tu correo.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-3 py-2 text-sm bg-secondary-800 border border-secondary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                >
                  Suscribirse
                </button>
              </form>
              
              {/* Social links */}
              <div className="mt-6 flex gap-4">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-secondary-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-secondary-800 py-6">
          <p className="text-center text-sm text-secondary-400">
            © {new Date().getFullYear()} PrivateLimo. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  )
}