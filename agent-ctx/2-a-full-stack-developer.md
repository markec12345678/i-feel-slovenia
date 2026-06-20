# Task 2-a — full-stack-developer
## Navigation + Hero + Footer komponente

### Kontekst
Prebral `worklog.md` (Task 1): slovenska turistična platforma, Next.js 16, App Router, TypeScript, Tailwind 4, shadcn/ui. Backend končan (API routes za destinations/itinerary/weather), statični podatki (12 destinacij), affiliate model brez baze. Slovenska tema (zelena primary oklch 0.45 0.12 150, terakota accent oklch 0.92 0.04 50) v `globals.css`.

### Ustvarjene datoteke
1. **`src/components/sections/navigation.tsx`** — `"use client"`, sticky top z backdrop-blur, logo (Mountain icon), 5 desktop anchor linkov, theme toggle (next-themes z mounted guard), CTA "Načrtuj potovanje", mobile hamburger → Sheet (right side) z avto-close.
2. **`src/components/sections/hero.tsx`** — server component, min-h-[90vh], next/image z Blejskim jezerom (priority), `hero-overlay` iz globals.css, badge "🇸🇮 12 destinacij · AI načrtovalec", H1 "Odkrijte Slovenijo" (text-5xl→7xl), 2 CTA gumbi (primarni bg-background, sekundarni outline border-white/40), 3 StatCard (translucent bg-white/10 backdrop-blur: 2,4 mio / 60% / 47 km). Animiran fade-in preko tw-animate-css (dela v RSC).
3. **`src/components/sections/footer.tsx`** — server component, border-t + bg-muted/30 + mt-auto (sticky-ready), 4-kolončni grid (1/2/4 responsive): Brand+social / Destinacije / Podpora / Pravno. Spodaj copyright + affiliate disclaimer.

### Tehnične odločitve
- **Hero kot server component** — namesto framer-motion (ki zahteva "use client") uporabljen tw-animate-css (animate-in fade-in slide-in-from-bottom-* z delay stopnjevanjem). Isto vizualno izkušnjo, brez client JS.
- **Theme toggle hidracija** — `mounted` state + placeholder span med SSR/CSR, da se izognemo mismatch warningu next-themes.
- **Sheet avto-close** — vsak link v mobilnem meniju ovit v `SheetClose asChild`, da se meni zapre ob kliku.
- **Sticky footer** — Footer ima `mt-auto`, parent page mora imeti `min-h-screen flex flex-col` (po navodilih — page skrbi za to).
- **Barvna paleta** — izključno `bg-primary`, `text-foreground`, `bg-accent`, `bg-background`, `bg-muted` itd. Nobenih indigo/blue. Hero uporablja belo/translucent ker je čez temno sliko.

### Lint rezultat
- `bun run lint`: MOJE 3 datoteke čiste (0 errors, 0 warnings).
- Obstajajo lint napake v `destination-modal.tsx` (warning) in `weather-widget.tsx` (error) — to sta datoteki paralelnih agentov (Task 2-b/c?), ne moje.

### Za naslednje agente (page.tsx integracija)
```tsx
// src/app/page.tsx predlog
import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/sections/footer";
// + Destinations, ItineraryPlanner, WeatherWidget, Map, Experiences, Booking

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        {/* Druge sekcije z id-ji: #destinacije, #načrtuj, #zemljevid, #izkušnje, #rezerviraj */}
      </main>
      <Footer />
    </div>
  );
}
```
