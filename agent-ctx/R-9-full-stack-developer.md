# Task R-9 — Content sekcije: beta-banner, events-data, events-calendar, blog-data, blog, pitch-deck

Agent: full-stack-developer (Z.ai Code)
Task ID: R-9
Datum: 2025

## Kontekst
Projekt "I Feel Slovenia" (Next.js 16, App Router, TypeScript, Tailwind 4, shadcn/ui) se rekonstruira.
Prejšnji taski (1–35) so vzpostavili celotno platformo — vse 6 zahtevanih datotek ŽE OBSTAJA in je bilo le treba preveriti skladnost s specifikacijo + lint čistost.

Predhodno delo prebrano iz `/home/z/my-project/worklog.md` (2227 vrstic).

## Specifikacija → Realizacija

### 1. `src/components/beta-banner.tsx` ✅
- "use client" ✅
- Fetch iz `/api/beta-status` (useEffect) ✅
- Zelena pasica na vrhu (gradient `from-primary to-primary/90`) ✅
- Besedilo: "Beta obdobje: Vsi paketi BREZPLAČNI za lokalce. Še **X** lokalov do vklopa monetizacije." ✅
- Dismissable (X gumb → `setDismissed(true)`) ✅
- CTA "Pridruži se" → `<a href="#pridruzi-se">` ✅
- Mobile-first: skrajšano besedilo na mobilcih ("BREZPLAČNO · še X lokalov") ✅
- Atributi: `aria-label="Zapri pasico"`, `aria-hidden` na ikonah ✅

### 2. `src/lib/events-data.ts` ✅
- 12 realnih slovenskih dogodkov skozi vse leto — vsi zahtevani prisotni:
  - Ljubljanski zimski festival (jan) ✅
  - Kurentovanje Ptuj (feb) ✅
  - Planica Nordic Festival (mar) ✅
  - Blejski danovski festival (apr) ✅
  - Festival Soča (maj) ✅
  - Bled Days with Kremšnita (jun) ✅
  - Ljubljana Festival (jul–avg) ✅
  - Piran Music Nights (jul–avg) ✅
  - Kmečki ohcet (avg) ✅
  - Olive Festival (sep) ✅
  - Festival Stara trta Maribor (okt) ✅
  - Božični sejmi Ljubljana/Maribor (dec) ✅
- +18 dodatnih dogodkov = 30 skupaj (vsi meseci ≥2, vseh 9 regij zastopanih)
- `interface EventItem { id, name, description, date, endDate?, location, destinationId?, category, region, image, website?, priceRange, featured }` ✅
- Funkcije: `formatEventDate` (3 oblike), `getEventsByMonth`, `getEventsByCategory`, `getFeaturedEvents`, `getEventsByRegion`, `getEventYear` ✅
- Slovenski meseci: `SLOVENIAN_MONTHS_SHORT` (jan…dec) + `SLOVENIAN_MONTHS_FULL` (Januar…December) + `MONTH_OPTIONS` ✅
- Kategorije: festival, glasba, sport, kultura, hrana, tradicija (z ikonami + labelami) ✅

### 3. `src/components/sections/events-calendar.tsx` ✅
- "use client" ✅
- `id="dogodki"` ✅ (scroll-mt-20)
- 3 filtri: mesec, kategorija, regija (Select komponente) ✅
- Mesečni prikaz z `MonthGroup` komponento (glava meseca + grid kartic) ✅
- Kartice z: sliko, kategorija-badge (z ikono), datumom (`formatEventDate` + `<time>`), lokacijo, ceno (z "Brezplačno" zeleno) ✅
- Empty state: `EmptyState` komponenta ("Ni dogodkov za izbrane filtre.") ✅
- Števec rezultatov ✅
- Mobile-first: grid 1/2 (lg), slika levo/desno na sm: ✅
- NO indigo/blue: emerald, amber, rose, violet, accent ✅

### 4. `src/lib/blog-data.ts` ✅
- 16 blog člankov (več kot 6 zahtevanih), vsi 6 zahtevani prisotni:
  - "Blejsko jezero: Vodič za popoln obisk" (blejsko-jezero-vodic) ✅
  - "Soča: Adrenalinski vodnik za poletje" (soca-adrenalinski-vodnik) ✅
  - "Slovenska kulinarika: 7 jedi ki jih morate poskusiti" (slovenska-kulinarika-7-jedi) ✅
  - "Triglav: Vzpon na najvišji vrh Slovenije" (triglav-vzpon-vodic) ✅
  - "Piran in slovenska obala v 24 urah" (piran-slovenska-obala-24-ur) ✅
  - "Zima v Sloveniji: Smučanje in termalni vrelci" (zima-v-sloveniji-smucanje-thermalni) ✅
- `interface BlogPost { slug, title, excerpt, content (markdown), image, category, author, date, readTime, relatedDestination? }` ✅
- 5 kategorij: narava, kulinarika, kultura, avantura, nasveti ✅
- `BLOG_CATEGORIES` (z "all" opcijo), `getPostsByCategory`, `getPostBySlug` ✅
- Vsi `relatedDestination` ID-ji obstajajo v `DESTINATIONS` razen "Slapovi Slovenije" (splošni vodnik) ✅

### 5. `src/components/sections/blog.tsx` ✅
- "use client" ✅
- `id="blog"` ✅ (scroll-mt-20)
- Filter tabs po kategoriji (Tabs komponenta, 6 TabsTrigger: Vsi + 5 kategorij) ✅
- Grid 1/2/3 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) ✅
- Kartice z: sliko (aspect-video), kategorija-badge, datumom (`date-fns` slovenski format), read-time ✅
- Click odpre `Dialog` z markdown vsebino (`ReactMarkdown` z custom renderers za h2/h3/p/ul/ol/li/strong) ✅
- `DialogTitle` + `DialogDescription` (sr-only za a11y) ✅
- Povezava na povezano destinacijo v modalu ✅
- Empty state ✅
- Mobile-first, touch-friendly (role=button, tabIndex=0, Enter/Space) ✅

### 6. `src/components/sections/pitch-deck.tsx` ✅
- `id="partnerji"` ✅ (scroll-mt-20)
- 4 benefiti:
  1. "Dosežite prave potnike" — "32% konverzija v kontakt" ✅
  2. "12.000+ obiskovalcev mesečno" ✅
  3. "AI distribucijski kanal" ✅
  4. "Polna transparenca" — "Real-time dashboard" ✅
- 4-koračni proces (Prijavite se → Dodajte lokal → AI prevzame → Prejemajte stranke) ✅
- 3 pričevanja (Ana K. / Marko P. / Tina R., vsi ★★★★★) ✅
- Final CTA z "Brezplačno med beta" (velik amber badge + 4 beta ugodnosti: Gift/CreditCard/LogOut/Clock) ✅
- CTA gumbi → `#pridruzi-se` ✅
- BETA_INFO.threshold integracija ✅

## Integracija v `src/app/page.tsx`
```
<BetaBanner />
<main>
  <Hero />
  ...
  <EventsCalendar />
  <BlogSection />
  <AffiliateSection />
  <JoinUs />
  <PitchDeckSection />
</main>
```
Vse sekcije so registrirane v pravilnem vrstnem redu.

## Verifikacija
- `bun run lint` — 0 errorjev, 0 opozoril ✅
- Dev server: `GET / 200 in 327ms` ✅
- Vsi importi (REGIONS, getDestinationById, BETA_INFO, BLOG_POSTS, EVENTS, formatEventDate, getPostsByCategory) obstajajo in so pravilno tipizirani ✅
- Slovenski diakritični znaki (č, š, ž) pravilno uporabljeni v vseh besedilih ✅
- NO indigo/blue barve v nobeni komponenti (uporabljene: primary zelena, emerald, amber, rose, violet, accent terakota) ✅

## Sklep
Vseh 6 datotek je bilo prisotnih iz predhodnih taskov (1–35) in popolnoma ustreza specifikaciji R-9. Lint čist, dev server odgovarja 200.

Vračilo poti:
1. `src/components/beta-banner.tsx`
2. `src/lib/events-data.ts`
3. `src/components/sections/events-calendar.tsx`
4. `src/lib/blog-data.ts`
5. `src/components/sections/blog.tsx`
6. `src/components/sections/pitch-deck.tsx`
