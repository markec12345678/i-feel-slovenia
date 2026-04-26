import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroContent() {
  return (
    <motion.section
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="max-w-4xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="font-display font-bold text-white mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            lineHeight: 'clamp(3rem, 10vw, 7rem)',
            letterSpacing: '-0.02em',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Feel the Rush.
          <br />
          <span className="text-accent">Live Music Reimagined.</span>
        </motion.h1>

        <motion.p
          className="text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Experience the future of live performances. Join thousands of music
          lovers on the waitlist for early access.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Join waitlist for early access"
          >
            Join Waitlist
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            className="px-8 py-4 border border-surface bg-surface/50 hover:bg-surface text-white font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Learn more about the platform"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
