"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
  service: z.string().min(1, "Por favor selecciona un servicio"),
  date: z.string().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    details: ["+1 (234) 567-890", "+1 (234) 567-891"],
    action: "tel:+1234567890",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@privatelimo.com", "reservas@privatelimo.com"],
    action: "mailto:info@privatelimo.com",
  },
  {
    icon: MapPin,
    title: "Dirección",
    details: ["123 Business Ave", "Miami, FL 33131"],
    action: "#",
  },
  {
    icon: Clock,
    title: "Horario",
    details: ["24/7 Servicio", "Atención inmediata"],
    action: "#",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulamos envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Form data:", data)
    setIsSubmitting(false)
    setSubmitSuccess(true)
    reset()
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 sm:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-secondary-900 mb-6">
              Contáctanos
            </h1>
            <p className="text-lg text-secondary-600">
              Estamos aquí para ayudarte a planificar tu próximo viaje.
              Contáctanos y recibe una cotización personalizada en minutos.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <a
                key={info.title}
                href={info.action}
                className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100 hover:shadow-lg hover:border-primary-200 transition-all text-center group"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-600 mb-4 group-hover:bg-primary-100 transition-colors">
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, index) => (
                  <p key={index} className="text-sm text-secondary-600">
                    {detail}
                  </p>
                ))}
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100">
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                Solicita una Cotización
              </h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg">
                  ¡Mensaje enviado exitosamente! Nos contactaremos contigo pronto.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Juan Pérez"
                      className="mt-1"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="juan@ejemplo.com"
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+1 (234) 567-890"
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="service">Servicio Requerido *</Label>
                    <select
                      id="service"
                      {...register("service")}
                      className="mt-1 flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="airport">Traslado Aeropuerto</option>
                      <option value="corporate">Evento Corporativo</option>
                      <option value="wedding">Boda/Celebración</option>
                      <option value="hourly">Servicio por Horas</option>
                      <option value="tour">City Tour</option>
                      <option value="other">Otro</option>
                    </select>
                    {errors.service && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.service.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">Fecha del Servicio (Opcional)</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Cuéntanos más sobre tu necesidad de transporte..."
                    className="mt-1"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map/Additional Info */}
            <div className="space-y-8">
              <div className="bg-secondary-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  ¿Por qué elegirnos?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2" />
                    <span className="text-secondary-700">
                      Respuesta en menos de 30 minutos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2" />
                    <span className="text-secondary-700">
                      Cotizaciones transparentes sin cargos ocultos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2" />
                    <span className="text-secondary-700">
                      Atención personalizada 24/7
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2" />
                    <span className="text-secondary-700">
                      Flexibilidad en cambios y cancelaciones
                    </span>
                  </li>
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary-200 to-secondary-300 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-secondary-600 font-medium">
                    Mapa de ubicación
                  </p>
                </div>
              </div>

              <div className="bg-primary-50 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  ¿Necesitas ayuda inmediata?
                </h3>
                <p className="text-secondary-600 mb-4">
                  Llámanos para asistencia instantánea
                </p>
                <Button asChild>
                  <a href="tel:+1234567890">
                    <Phone className="mr-2 h-4 w-4" />
                    +1 (234) 567-890
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}