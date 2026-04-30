import { useState } from 'react';
import { Language } from '../i18n';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg px-4 py-2 hover:border-green-400 transition-colors"
      >
        <span className="text-2xl">{currentLang?.flag}</span>
        <span className="text-white font-semibold">{currentLang?.name}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                lang.code === currentLanguage ? 'bg-gray-700' : ''
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-white">{lang.name}</span>
              {lang.code === currentLanguage && <span className="text-green-400 ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
