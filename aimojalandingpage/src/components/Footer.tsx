import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl" aria-hidden="true">🇸🇮</span>
              <span className="font-bold text-gradient-green">I FEEL SLOVENIA</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Odkrijte deželo čudovitih jezer, alpskih vrhov in skritih jam. Vaša naslednja nepozabna avantura.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Destinacije</h3>
            <ul className="space-y-2">
              {['Blejsko jezero', 'Postojnska jama', 'Ljubljana', 'Triglav', 'Reka Soča', 'Piran'].map((d) => (
                <li key={d}>
                  <a href="#destinations" className="text-sm text-white/40 hover:text-white transition-colors">
                    {d}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Informacije</h3>
            <ul className="space-y-2">
              {['O Sloveniji', 'Kako do nas', 'Nastanitve', 'Gastronomija', 'Dogodki', 'Kontakt'].map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                    {i}
                  </a>
                </li>
              ))}
              <li>
                <a href="/privacy.html" className="text-sm text-white/40 hover:text-white transition-colors">
                  🔒 Pravilnik o zasebnosti
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-sm text-white/30 flex items-center gap-1">
            Narejeno z <Heart size={12} className="text-red-500 fill-red-500" aria-hidden="true" /> za Slovenijo © 2025
          </p>
          <div className="flex gap-4">
            {['slovenia.info', 'Instagram', 'Facebook', 'YouTube'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
                aria-label={s}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
