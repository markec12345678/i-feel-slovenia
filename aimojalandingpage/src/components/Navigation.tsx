import { useState, useEffect } from 'react';
import { navigationLinks } from '../data/sloveniaData';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-dark py-3 shadow-2xl shadow-black/20'
          : 'bg-transparent py-5'
      }`}
      role="navigation"
      aria-label="Glavna navigacija"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-3 group"
            aria-label="I Feel Slovenia - domov"
          >
            <span className="text-2xl" aria-hidden="true">🇸🇮</span>
            <span className="text-xl font-bold text-gradient-green tracking-tight">
              I FEEL SLOVENIA
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#plan"
              className="ml-4 px-6 py-2.5 bg-slovenia-green hover:bg-green-600 text-white text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
            >
              Načrtuj potovanje
            </a>
          </div>

          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Zapri meni' : 'Odpri meni'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-slide-up">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#plan"
              className="block mt-3 mx-4 py-3 bg-slovenia-green text-white text-center font-semibold rounded-full"
              onClick={() => setIsMobileOpen(false)}
            >
              Načrtuj potovanje
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
