import { useState, useEffect } from 'react';

// Spremlja scroll pozicijo za spremembo UI stanja navbara
export const useScrollPosition = (threshold = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Passive listener za boljšo scroll performanco (brez blockiranja main threada)
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Preveri začetno stanje
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};
