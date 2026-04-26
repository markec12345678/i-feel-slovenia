import { motion } from 'framer-motion'
import { useState } from 'react'

interface Logo {
  name: string
  width: number
  height: number
}

const logos: Logo[] = [
  { name: 'Rolling Stone', width: 120, height: 40 },
  { name: 'Billboard', width: 100, height: 40 },
  { name: 'Pitchfork', width: 110, height: 40 },
  { name: 'NME', width: 80, height: 40 },
]

export default function SocialProof() {
  const [loadedLogos, setLoadedLogos] = useState<Set<number>>(new Set())

  const handleLogoLoad = (index: number) => {
    setLoadedLogos((prev) => new Set([...prev, index]))
  }

  return (
    <motion.section
      className="relative z-10 py-16 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      aria-labelledby="social-proof-heading"
    >
      <h2 id="social-proof-heading" className="sr-only">
        Featured in
      </h2>
      
      <p className="text-center text-secondary text-sm mb-8 uppercase tracking-wider">
        Featured in
      </p>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        {logos.map((logo, index) => (
          <motion.div
            key={logo.name}
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className={`relative transition-opacity duration-300 ${
                loadedLogos.has(index) ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ width: logo.width, height: logo.height }}
            >
              {/* Logo placeholder with lazy loading */}
              <img
                src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${logo.width}' height='${logo.height}' viewBox='0 0 ${logo.width} ${logo.height}'%3E%3Crect fill='%231a1a2e' width='${logo.width}' height='${logo.height}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b3b3b3' font-family='Inter, sans-serif' font-size='12'%3E${logo.name}%3C/text%3E%3C/svg%3E`}
                alt={`${logo.name} logo`}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                onLoad={() => handleLogoLoad(index)}
                className="opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
