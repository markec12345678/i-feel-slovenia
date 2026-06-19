# Task 6-a — Blog sekcija + napredni filtri v Destinations

**Agent**: full-stack-developer
**Datum**: 2025-03-12 (delo opravljeno v roku ene seje)

## Kontekst
Naloga je razširila obstoječi "I Feel Slovenia" projekt (Next.js 16 slovenska turistična platforma) z dvema novima funkcionalnostma:
1. Blog sekcija s 6 slovenskimi članki (SEO vsebina)
2. Napredni filtri (3 novi) v obstoječi DestinationsSection

## Predhodno delo (povzetek iz worklog.md)
- Task 1: Backend (Prisma schema, types, slovenia-data.ts z 12 destinacijami, affiliate.ts, API routes, slovenska tema)
- Task 2-a: Navigation, Hero, Footer komponente
- Task 2-b: DestinationsSection (original z 2 filtri), DestinationModal, WeatherWidget
- Task 2-c: AI Itinerary Planner z z-ai-web-dev-sdk
- Task 3: Sestavitev page.tsx + Affiliate, Experiences, Stats sekcije
- Task 4: Popravek slik destinacij (image-search skill)
- Task 5: Interaktivni Leaflet zemljevid z AI itinerer integracijo

(Kasneje dodan tudi JoinUs sekcija z /api/leads — opaženo v dev.log, a ni v mojem obsegu.)

## Ustvarjene datoteke

### `src/lib/blog-data.ts` (~290 vrstic)
- `BlogPost` interface: slug, title, excerpt, content (markdown), image, category (narava|kulinarika|kultura|avantura|nasveti), author, date (ISO), readTime, relatedDestination?
- `BLOG_CATEGORIES` array: Vsi + 5 kategorij
- `BLOG_POSTS`: 6 člankov v slovenščini:
  1. **Blejsko jezero: Vodič za popoln obisk** (narava, relatedDestination: "bled", 5 min, 2025-03-12)
  2. **Soča: Adrenalinski vodnik za poletje** (avantura, relatedDestination: "soca", 6 min, 2025-02-18)
  3. **Slovenska kulinarika: 7 jedi ki jih morate poskusiti** (kulinarika, 7 min, 2025-01-22)
  4. **Triglav: Vzpon na najvišji vrh Slovenije** (avantura, relatedDestination: "triglav", 8 min, 2025-02-03)
  5. **Piran in slovenska obala v 24 urah** (kultura, relatedDestination: "piran", 6 min, 2025-03-04)
  6. **Zima v Sloveniji: Smučanje in termalni vrelci** (nasveti, 7 min, 2025-01-08)
- Vsak članek: 3-5 odstavkov markdown vsebine (H2/H3 naslovi, ol/ul liste, bold)
- Slike: 4 iz obstoječih sfile.chatglm.cn URL-jev (bled/soca/triglav/piran), 2 iz Unsplash (kulinarika food photo + zima smučanje)
- Pomožni funkciji: `getPostBySlug(slug)`, `getPostsByCategory(category)`

### `src/components/sections/blog.tsx` (~330 vrstic, "use client")
- `id="blog"`, scroll-mt-20, bg-muted/30, py-16/20
- Header: Badge "Blog & vodičniki" z BookOpen ikono, H2 "Zgodbe iz Slovenije", podnaslov "Vodičniki, nasveti in inspiracije..."
- Filter: shadcn `Tabs` z 6 `TabsTrigger`-ji (Vsi, Narava, Kulinarika, Kultura, Avantura, Nasveti), flex-wrap za mobilne
- Grid 1/2/3 kolone (sm/lg breakpointi)
- `BlogCard`: Card z role="button" + tabIndex + Enter/Space handler, slika aspect-video z group-hover scale-105, category Badge top-left (barve po kategoriji), meta vrstica (Calendar + Clock), H3 naslov (line-clamp-2), excerpt (line-clamp-2), "Preberi več" Button
- `BlogDialog`: Dialog controlled, max-w-3xl p-0 overflow-hidden, scroll-area-custom max-h-[85vh]. Slika z gradient overlay in naslovom. ReactMarkdown render z custom components (h2/h3/p/ul/ol/li/strong) — slovensko tipografsko styling (marker:text-primary). RelatedDestinationLink na dnu z "Razišči destinacijo" gumbom (anchor href="#destinacije")
- `BlogEmptyState`: fallback če filter vrne 0
- Datum formatiran z `date-fns` `format()` + `sl` locale ("d. MMM yyyy")

## Posodobljene datoteke

### `src/components/sections/destinations.tsx` (~370 vrstic, "use client")
- **3 novi filtri** dodani:
  1. **Tip destinacije** — Select z 8 opcijami (Jezero, Mesto, Gorovje, Jama, Obala, Reka, Zdravilišče, Soteska) — iz `DestinationType` union-a
  2. **Cena** — Select z 3 opcijami (€ Nizka, €€ Srednja, €€€ Visoka) — iz `Budget` union-a
  3. **Ocena** — Select z 3 opcijami (4.5+, 4.7+, 4.9+)
- **Reorganizirana filter vrstica** v 2 vrstici znotraj rounded-xl border bg-muted/20 plošče:
  - Glava: "Filtri" z Filter ikono (text-primary) + "Počisti filtre" Button (X ikona) — pogojno prikazan samo ko je `hasActiveFilters` true
  - 1. vrstica (grid sm:grid-cols-2 lg:grid-cols-3): regija, interes, tip
  - 2. vrstica (grid sm:grid-cols-2): cena, ocena
- **FilterSelect** sedaj `w-full` (prej `sm:w-56`) — boljši responsive layout znotraj grid-a
- **Števec rezultatov**: "Prikazujem X od 12 destinacij" (font-semibold za X)
- **useMemo** posodobljen z 5 pogoji (regionOk, interestOk, typeOk, budgetOk, ratingOk z `d.rating >= minRating`)
- **clearFilters()** resetira vseh 5 state-ov na `ALL_VALUE`
- **EmptyState** posodobljen z `onClear` + `canClear` props — prikaže "Počisti filtre" gumb tudi v empty state-u
- `hasActiveFilters` izpeljan iz vseh 5 filtrov
- Dodan `Filter` in `X` ikoni iz lucide-react

### `src/app/page.tsx`
- Dodan import `BlogSection` in `<BlogSection />` med `ExperiencesSection` in `AffiliateSection` (logično mesto — po izkušnjah, pred rezervacijami)

## Tehnične odločitve
- **ReactMarkdown** z `components` prop za custom render markdown elementov — daje popoln nadzor nad tipografijo in barvami (marker:text-primary za liste, text-foreground/90 za odstavke)
- **date-fns** s `sl` locale za slovensko formatiranje datumov ("12. mar. 2025")
- **shadcn Tabs** za kategorije filtra (ne Select) — vizualno lepše, hitro preklapljanje, vse kategorije vidne naenkrat
- **Kategorijske barve badge-ov**: narava=primary(zelena), kulinarika=amber, kultura=accent(terakota), avantura=rose, nasveti=emerald — raznoliko a skladno s slovensko paleto, NO indigo/blue
- **RelatedDestinationLink** uporablja `getDestinationById()` iz obstoječega slovenia-data.ts za prikaz imena in tagline povezane destinacije
- **Filter layout v 2 vrsticah** znotraj obrobe plošče — bolj pregledno kot prejšnja 1-vrstična postavitev, "Počisti filtre" gumb v glavi plošče za enostavno dostop

## Verifikacija
- `bun run lint` → 0 errorjev, 0 opozoril (čisto)
- Dev server HTTP 200, čisto kompajlira brez napak
- Vse komponente "use client" kjer je potrebno (blog.tsx za Tabs/Dialog state, destinations.tsx za Select state)
- TypeScript strikten: DestinationType, Budget, BlogCategory unioni pravilno uporabljeni
- NO indigo/blue barve — samo primary (zelena), accent (terakota), amber/rose/emerald za raznolikost
- Mobile-first responsive (sm/lg breakpointi), touch-friendly (44px+ tarče)

## Ključne ugotovitve za naslednje agente
- Blog sekcija je samostojna (idiomaticna) — ne potrebuje backend API (vsi podatki statični v blog-data.ts)
- Če se doda več člankov, jih samo dodaj v BLOG_POSTS array — komponenta avtomatsko upošteva nove
- `getPostsByCategory` in `getPostBySlug` sta pripravljeni za morebitni future API route (npr. /api/blog ali /api/blog/[slug])
- DestinationsSection ohranja isto DestinationModal — spremembe filtrov ne vplivajo na modal logiko
- FilterSelect helper je generičen (value/onChange/placeholder/ariaLabel/options) — ga lahko reuse-amo v drugih sekcijah
