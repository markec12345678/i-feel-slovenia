import React, { useState } from 'react';
import { Instagram, Youtube, Facebook, ArrowUp } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Prosim vnesite veljaven e-poštni naslov.');
      return;
    }
    setError(undefined);
    // Simulacija pošiljanja
    alert('Hvala za prijavo na novice!');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface/50 border-t border-white/10 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-primary">
              The <span className="text-accent">Drinkers</span>
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              The Drinkers nadaljujejo svojo glasbeno pot z novo generacijo. 
              Domen Kolenc, sin pokojnega Sandija Kolenca-Kolija (1965–2017), 
              prevzema vokal ob originalnih članih. Na zdravje! 🍻
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Hitre povezave
            </h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-secondary hover:text-accent transition-colors text-sm">
                    Funkcije
                  </a>
                </li>
                <li>
                  <a href="#tour" className="text-secondary hover:text-accent transition-colors text-sm">
                    Turneja
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:text-accent transition-colors text-sm">
                    O nas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary hover:text-accent transition-colors text-sm">
                    Kontakt
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Sledi nam
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-white/5 rounded-lg text-secondary hover:text-accent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.youtube.com/@TheDrinkersSlovenija"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg text-secondary hover:text-accent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100049091725618"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg text-secondary hover:text-accent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Novice
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="E-pošta"
                type="email"
                placeholder="tvoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
                aria-required="true"
              />
              <Button type="submit" variant="primary" className="w-full" isLoading={false}>
                Prijavi se
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} The Drinkers. Vse pravice pridržane. Na zdravje! 🍻
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-secondary hover:text-accent transition-colors">
              Zasebnost
            </a>
            <a href="#" className="text-secondary hover:text-accent transition-colors">
              Pogoji
            </a>
            <a href="#" className="text-secondary hover:text-accent transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-accent hover:bg-accent-hover text-white rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Nazaj na vrh"
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>
    </footer>
  );
};
