"use client"

import React from "react"
import { motion } from "framer-motion"

export interface TestimonialItem {
  text: string
  image: string
  name: string
  role: string
}

export interface TestimonialsV2Props {
  badge?: string
  headline?: string
  description?: string
  testimonials?: TestimonialItem[]
  dark?: boolean
}

const defaultTestimonials: TestimonialItem[] = [
  {
    text: "Bu çözüm operasyonlarımızı devrim niteliğinde dönüştürdü. Bulut tabanlı platform uzaktan bile üretken kalmamızı sağlıyor.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Briana Patton",
    role: "Operasyon Müdürü",
  },
  {
    text: "Kurulum sorunsuz ve hızlıydı. Özelleştirilebilir arayüz ekip eğitimini çok kolaylaştırdı.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Bilal Ahmed",
    role: "BT Müdürü",
  },
  {
    text: "Destek ekibi olağanüstü, kurulum sırasında bize rehberlik etti ve sürekli yardım sağlıyor.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Saman Malik",
    role: "Müşteri Destek Lideri",
  },
  {
    text: "Sorunsuz entegrasyon iş operasyonlarımızı ve verimliliğimizi artırdı. Kesinlikle tavsiye ederim.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Güçlü özellikleri ve hızlı desteği iş akışımızı dönüştürdü, çok daha verimli olduk.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zainab Hussain",
    role: "Proje Müdürü",
  },
  {
    text: "Sorunsuz uygulama beklentileri aştı. Süreçleri iyileştirdi ve iş performansımızı artırdı.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aliza Khan",
    role: "İş Analisti",
  },
  {
    text: "Kullanıcı dostu tasarım ve olumlu müşteri geri bildirimleri ile işlerimiz gelişti.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Farhan Siddiqui",
    role: "Pazarlama Direktörü",
  },
  {
    text: "Beklentileri aşan bir çözüm sundular, ihtiyaçlarımızı anlayıp operasyonlarımızı geliştirdiler.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sana Sheikh",
    role: "Satış Müdürü",
  },
  {
    text: "Online varlığımız ve dönüşümlerimiz önemli ölçüde arttı, iş performansı yükseldi.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Hassan Ali",
    role: "E-ticaret Müdürü",
  },
]

function TestimonialsColumn(props: {
  className?: string
  testimonials: TestimonialItem[]
  duration?: number
  dark?: boolean
}) {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <li
                key={`${index}-${i}`}
                aria-hidden={index === 1 ? "true" : "false"}
                className={`p-10 rounded-3xl border shadow-lg shadow-black/5 max-w-xs w-full transition-all duration-300 cursor-default select-none group ${
                  props.dark
                    ? "border-neutral-800 bg-neutral-900"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <blockquote className="m-0 p-0">
                  <p
                    className={`leading-relaxed font-normal m-0 ${
                      props.dark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {text}
                  </p>
                  <footer className="flex items-center gap-3 mt-6">
                    {image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className={`h-10 w-10 rounded-full object-cover ring-2 ${
                          props.dark ? "ring-neutral-800" : "ring-neutral-100"
                        }`}
                      />
                    )}
                    <div className="flex flex-col">
                      <cite
                        className={`font-semibold not-italic tracking-tight leading-5 ${
                          props.dark ? "text-white" : "text-neutral-900"
                        }`}
                      >
                        {name}
                      </cite>
                      <span
                        className={`text-sm leading-5 tracking-tight mt-0.5 ${
                          props.dark ? "text-neutral-500" : "text-neutral-500"
                        }`}
                      >
                        {role}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  )
}

export function TestimonialsV2({
  badge = "Yorumlar",
  headline = "Kullanıcılarımız ne diyor?",
  description = "",
  testimonials,
  dark = false,
}: TestimonialsV2Props) {
  const list = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials
  const firstColumn = list.slice(0, Math.ceil(list.length / 3))
  const secondColumn = list.slice(Math.ceil(list.length / 3), Math.ceil((list.length * 2) / 3))
  const thirdColumn = list.slice(Math.ceil((list.length * 2) / 3))

  return (
    <section
      aria-labelledby="testimonials-v2-heading"
      className={`py-24 relative overflow-hidden ${dark ? "bg-neutral-950" : "bg-white"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 },
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          {badge && (
            <div className="flex justify-center">
              <div
                className={`border py-1 px-4 rounded-full text-xs font-semibold tracking-wide uppercase ${
                  dark
                    ? "border-neutral-700 text-neutral-400 bg-neutral-800/50"
                    : "border-neutral-300 text-neutral-600 bg-neutral-100/50"
                }`}
              >
                {badge}
              </div>
            </div>
          )}

          <h2
            id="testimonials-v2-heading"
            className={`text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-center ${
              dark ? "text-white" : "text-neutral-900"
            }`}
          >
            {headline}
          </h2>
          {description && (
            <p
              className={`text-center mt-5 text-lg leading-relaxed max-w-sm ${
                dark ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        <div
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} dark={dark} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
            dark={dark}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
            dark={dark}
          />
        </div>
      </motion.div>
    </section>
  )
}
