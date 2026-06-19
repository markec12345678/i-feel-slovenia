# Task 6-b — Koledar dogodkov (EventsCalendar)

**Agent**: full-stack-developer
**Task ID**: 6-b
**Datum**: 2025-03-12

## Kontekst
- Prebral `worklog.md` za celoten kontekst projekta "I Feel Slovenia" (Next.js 16 slovenska turistična platforma, statični podatki, affiliate model, AI itinerer, Leaflet zemljevid).
- Prebral `src/lib/slovenia-data.ts` za `REGIONS` konstanto (5 regij: alpine, coastal, central, karst, pannonian) in strukturo destinacij (12 ID-jev: bled, bohinj, ljubljana, postojna, piran, soca, triglav, kobard, maribor, portoroz, vintgar, rogaska).
- Prebral `src/lib/types.ts` za osnovne tipe (Region, Budget, Season, Destination).
- Prebral obstoječe sekcije (`destinations.tsx`, `hero.tsx`) za patterns (FilterSelect helper, Card struktura, badge styling).
- Preveril shadcn/ui komponente v `src/components/ui/` — na voljo: card, badge, button, select, tabs, scroll-area, dialog, skeleton, itd.
- Opozorilo v `next.config.ts`: dovoljeni image hosti so `images.unsplash.com`, `plus.unsplash.com`, `sfile.chatglm.cn` — uporabljen Unsplash za slike dogodkov.
- V `globals.css` preverjena slovenska paleta: primary=zelena (Triglav), accent=terakota, secondary=siva, destructive=rdeča.

## Ustvarjene datoteke

### 1. `src/lib/events-data.ts` (~310 vrstic)

**Tipi** (vsako izvoženo kot `type`):
- `EventCategory` = `"festival" | "glasba" | "sport" | "kultura" | "hrana" | "tradicija"`
- `EventRegion` = `"alpine" | "coastal" | "central" | "karst" | "pannonian"`
- `PriceRange` = `"brezplačno" | "€" | "€€" | "€€€"`
- `EventItem` interface: id, name, description, date, endDate?, location, destinationId?, category, region, image, website?, priceRange, featured

**Konstante**:
- `SLOVENIAN_MONTHS_SHORT` = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"]
- `SLOVENIAN_MONTHS_FULL` = ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"]
- `MONTH_OPTIONS` = array 12 mesecev z value (0-11) in label
- `EVENT_CATEGORIES` = 6 kategorij z ikonami emoji (🎪🎵🏃🎭🍷🎨)
- `EVENT_CATEGORY_LABELS` = slovar za slovenska imena kategorij

**`EVENTS` array — 12 realnih slovenskih dogodkov razporejenih skozi vse leto** (datumi 2025):

1. **Ljubljanski zimski festival** (15.-26. jan) — glasba, central, "ljubljana", €€
2. **Kurentovanje — Pustni karneval Ptuj** (8.-18. feb) — tradicija, pannonian, brezplačno, ★featured
3. **Planica Nordic Festival** (21.-23. mar) — sport, alpine, €€, ★featured
4. **Blejski danovski festival** (10.-13. apr) — glasba, alpine, "bled", €€
5. **Festival Soča** (23.-25. maj) — sport, alpine, "soca", €€
6. **Bled Days with Kremšnita** (13.-15. jun) — hrana, alpine, "bled", brezplačno, ★featured
7. **Ljubljana Festival** (1. jul - 31. avg) — glasba, central, "ljubljana", €€, ★featured
8. **Piran Music Nights** (10. jul - 20. avg) — glasba, coastal, "piran", €
9. **Kmečki ohcet** (15. avg) — tradicija, alpine, brezplačno
10. **Olive Festival** (27. sep) — hrana, coastal, €
11. **Festival Stara trta** (3.-12. okt) — tradicija, pannonian, "maribor", €
12. **Božični sejmi v Ljubljani in Mariboru** (29. nov - 31. dec) — tradicija, central, "ljubljana", brezplačno, ★featured

Slike: vse iz Unsplash (images.unsplash.com/photo-XXX?w=1200&h=800&fit=crop&q=80) z relevantnimi temami (koncert, karneval, smučanje, violina, rafting, torta, oder, plaža, ljudska ples, olive, vino, božič).

**Pomožne funkcije**:
- `formatEventDate(date, endDate?)` — slovensko formatiran datum: enodnevni "15. jul 2025", večdnevni isti mesec "15. – 17. jul 2025", večdnevni različen mesec "15. jul – 15. avg 2025". Implementirano ročno (ne toLocaleDateString) zaradi konsistentnosti skupaj z `SLOVENIAN_MONTHS_SHORT` array.
- `getEventsByMonth(month: number)` — dogodki ki potekajo v podanem mesecu (start <= month <= end)
- `getEventsByCategory(category)` — filter po kategoriji
- `getEventsByRegion(region)` — filter po regiji
- `getFeaturedEvents()` — samo izpostavljeni dogodki
- `getEventYear(event)` — leto dogodka

### 2. `src/components/sections/events-calendar.tsx` (~340 vrstic, "use client")

**Struktura**:
- `id="dogodki"`, `scroll-mt-20` (za sticky nav offset), `bg-muted/30`, `py-16 sm:py-20`
- **Header**: Badge "Vse leto" z Calendar ikono (border-primary/30 text-primary), H2 "Koledar dogodkov" (text-3xl/4xl), podnaslov "Festivali, prireditve in dogodki skozi vse leto"
- **Filter vrstica**: 3 `Select` komponente (sm:w-56 w-full):
  - Mesec (Vsi meseci + 12 iz MONTH_OPTIONS)
  - Kategorija (Vse kategorije + 6 iz EVENT_CATEGORIES z emoji prefiksi)
  - Regija (Vse regije + 5 iz REGIONS iz `slovenia-data.ts`)
- **Števec**: "X dogodkov" (pravilna slovenska množina: 1 dogodek / 2+ dogodkov / 0 = "Ni dogodkov za izbrane filtre")
- **Mesečni prikaz**: dogodki grupirani po mesecu — vsak mesec je naslov sekcije (SLOVENIAN_MONTHS_FULL[month]) z Badge števca "X dogodkov" + border-b separator
- **Empty state**: "Ni dogodkov za izbrane filtre." z CalendarX ikono v muted krogu + podnaslov "Poskusite spremeniti mesec, kategorijo ali regijo."

**EventCard komponenta** (znotraj lg:grid-cols-2):
- Card z `gap-0 overflow-hidden py-0 transition-all hover:shadow-lg`
- Layout: `flex flex-col sm:flex-row`
- **Slika**: `sm:w-40 sm:shrink-0` (levo na sm+), `aspect-video sm:aspect-square`, `group-hover:scale-105` transition
- **Featured badge** (top-right na sliki): `bg-amber-400 text-amber-950` z Star ikono (fill-amber-950), text "Izpostavljeno"
- **Vsebina** (CardContent p-4 sm:p-5):
  - Category Badge z ikono + labelo, barva po kategoriji (glej spodaj)
  - H4 ime dogodka (text-lg font-semibold)
  - Meta vrstica (flex-wrap, gap-x-4 gap-y-1.5, text-sm text-muted-foreground):
    - Calendar ikona + `<time dateTime={event.date}>` formatiran datum (font-medium text-foreground/80)
    - MapPin ikona + lokacija
    - Ticket ikona + cena: "Brezplačno" (text-emerald-700 dark:text-emerald-400) ali €/€€/€€€
  - Opis (text-sm leading-relaxed line-clamp-2)
  - CTA gumbi (flex-wrap gap-2):
    - "Spletna stran" Button outline (če `event.website`) → `<a target="_blank" rel="noopener noreferrer">` z ExternalLink ikono
    - "Razišči destinacijo" Button ghost text-primary (če `event.destinationId`) → `<a href="#destinacije">` z ArrowRight ikono (group-hover translate-x-0.5)

**Kategorijske barve** (NO indigo/blue):
- glasba → `bg-primary text-primary-foreground` (zelena)
- sport → `bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100`
- hrana → `bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100`
- tradicija → `bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100`
- kultura → `bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100`
- festival → `bg-accent text-accent-foreground` (terakota)

**Kategorijske ikone** (lucide-react):
- glasba → Music, sport → Trophy, hrana → UtensilsCrossed, tradicija → Sparkles, kultura → Theater, festival → PartyPopper

**Filter logika** (useMemo):
- `filtered`: kombinacija vseh 3 filtrov (mesec upošteva tudi endDate za večdnevne dogodke — npr. Ljubljana Festival v juliju IN avgustu)
- `groupedByMonth`: če je izbran konkreten mesec, vsi dogodki prikazani pod tem mesecem; sicer grupirano po začetnem mesecu, kronološko sortirano

### 3. `src/app/page.tsx` (posodobljen)
- Dodan import `EventsCalendar` in `<EventsCalendar />` med `<ExperiencesSection />` in `<BlogSection />`
- Logični tok: Hero → Stats → Destinations → ItineraryPlanner → Map → Experiences → **Events** → Blog → Affiliate → JoinUs → Footer

## Tehnične odločitve
- **Statični podatki**: `EVENTS` array uvožen direktno v komponento (brez API klica) za najhitrejši render — enak pattern kot `DESTINATIONS` in `BLOG_POSTS`
- **Ročno formatiranje datuma** namesto `toLocaleDateString("sl-SI", ...)` — Node.js včasih daje nedosledne rezultate za sl-SI lokalne podatke; z ročnim SLOVENIAN_MONTHS_SHORT array dobimo garantiran "15. jul 2025" format
- **`<time dateTime={event.date}>`** za semantično pravilno Oznako časa (a11y + SEO)
- **multi-month eventi**: Ljubljana Festival (jul-avg) in Piran Music Nights (jul-avg) se prikažejo v obeh mesecih ko je filter "Vsi meseci" — v praksi grupirano po začetnem mesecu (julij), a ko uporabnik filtrira "Avgust", oba prikažeta (ker endDate sega v avgust)
- **FilterSelect helper** je generičen (value/onChange/placeholder/ariaLabel/options) — consistent z destinations.tsx pattern
- **lucide-react ikone**: Calendar, MapPin, Ticket, Star, ExternalLink, ArrowRight, Music, Trophy, UtensilsCrossed, Sparkles, Theater, PartyPopper, CalendarX, `type LucideIcon` za type-safe ikone
- **shadcn/ui komponente**: Card, CardContent, Badge, Button (asChild za `<a>`), Select/SelectTrigger/Content/Item/Value
- **Mobile-first responsive**: sm:w-56 w-full za filtre, sm:w-40 za slike kartic, lg:grid-cols-2 za kartice, sm:aspect-square za slike
- **A11y**: aria-label na SelectTrigger-jih, aria-hidden na dekorativnih ikonah, `<time dateTime>` za strojno berljive datume, title atributi na meta vrstici

## Verifikacija
- `bun run lint` → 0 errorjev, 0 opozoril (exit code 0, čisto)
- `npx tsc --noEmit` → 0 napak v mojih datotekah
- Dev server: HTTP 200 na `/`, čisto kompajlira brez napak
- Vse komponente "use client" (zaradi Select state in useMemo)
- TypeScript strikten: EventCategory, EventRegion, PriceRange unioni pravilno uporabljeni
- NO indigo/blue — samo primary (zelena), accent (terakota), emerald/amber/rose/violet za raznolikost kategorij
- Mobile-first responsive, touch-friendly (min 8px padding okoli gumba, 32px+ tarče)
- Vsa UI besedila v slovenščini (meseci, kategorije, regije, gumbi, empty state)

## Ključne ugotovitve za naslednje agente
- `events-data.ts` je samostojen modul — pripravljen za morebitni future API route (npr. `/api/events` ali `/api/events/[id]`)
- `getEventsByMonth`, `getEventsByCategory`, `getEventsByRegion`, `getFeaturedEvents` so pripravljene za reuse v drugih komponentah (npr. featured dogodki na homepage, dogodki v destinacijskem modalu)
- Če se doda več dogodkov, jih samo dodaj v `EVENTS` array — komponenta avtomatsko upošteva nove
- Povezava z destinacijami preko `destinationId` — "Razišči destinacijo" gumb anchora na `#destinacije` (kjer je DestinationsSection)
- Sledi enak patterns kot blog.tsx in destinations.tsx (FilterSelect helper, Card z role/slika/badge, empty state z ikono v krogu)
