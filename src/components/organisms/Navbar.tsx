import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const NAV_LINKS = [
  { href: '#features', label: 'O nas' },
  { href: '#tour', label: 'Turneja' },
  { href: '#contact', label: 'Kontakt' }
];

export const Navbar: React.FC = () => {
  const isScrolled = useScrollPosition(50);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Zapri mobilni meni ob prehodu na desktop breakpoint
  useEffect(() => {
    const handleResize = () => window.innerWidth >= 768 && setIsMenuOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-surface/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Glavna navigacija">
        {/* Logo */}
        <a href="#" className="font-display text-xl font-bold text-primary tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1" aria-label="The Drinkers Domov">
          The <span className="text-accent">Drinkers</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-3 py-2"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-label={isMenuOpen ? 'Zapri navigacijski meni' : 'Odpri navigacijski meni'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                <X className="w-6 h-6" aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                <Menu className="w-6 h-6" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobilna navigacija"
            className="md:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/10"
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0, y: -12 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ul className="flex flex-col px-4 py-6 gap-2" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-lg font-medium text-secondary hover:text-primary hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-3 py-3"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
