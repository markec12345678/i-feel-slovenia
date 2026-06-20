# Task 18-b/c — Marketplace API + UI komponente

**Agent**: full-stack-developer
**Task**: Marketplace (Products + Experiences) API routes in UI komponente za "I Feel Slovenia"

## Predhodno delo (kontekst)
- Prebral `/home/z/my-project/worklog.md` — zadnji opravljen task: 16-17 (POI sistem z OpenStreetMap + Wikipedia)
- Prebral `prisma/schema.prisma` — `Product` in `Experience` modela že obstajata (seedani 8+8 zapisov prek `prisma/seed-marketplace.ts`)
- Prebral `src/app/api/listings/route.ts` in `[slug]/route.ts` za vzorčen API pattern (where filter, orderBy, JSON.parse, viewCount increment)
- Prebral `src/components/sections/listings.tsx` in `listing-modal.tsx` za vzorčno UI komponento (Card z badge layout, Dialog z galerijo, StatCard, InfoItem pomožne komponente)

## Ustvarjene datoteke (8)

### 1. `src/lib/marketplace-types.ts`
- Tipi: `ProductCategory`, `ExperienceCategory`, `MarketplacePlan`, `Product`, `Experience`
- `PRODUCT_CATEGORY_LABELS` (food→Hrana, wine→Vino, honey→Med, oil→Olje, craft→Obrt, souvenir→Suvenir, other→Drugo)
- `PRODUCT_CATEGORY_ICONS` (🧀🍷🍯🫒🧶🎁📦)
- `EXPERIENCE_CATEGORY_LABELS` (tour→Voden ogled, workshop→Delavnica, tasting→Degustacija, outdoor→Narava, cultural→Kultura, adventure→Avantura, wellness→Wellness)
- `EXPERIENCE_CATEGORY_ICONS` (🗺️🎨🍽️🌲🏛️🧗💆)
- `LANGUAGE_LABELS` (sl→Slovenščina, en→Angleščina, de→Nemščina, it→Italijanščina, hr, fr, es, ru, nl)
- `formatDuration(hours)` — npr. "45 min", "3 h", "2 dni"
- `formatPrice(value, currency)` — Intl.NumberFormat("sl-SI", currency EUR)

### 2. `src/app/api/products/route.ts`
- `GET /api/products` — filtri: category, destinationId, plan, featured, limit (default 50, max 100), sort (featured | price-asc | price-desc | rating | newest)
- `JSON.parse(images)` pred vračanjem
- Vrača `{ products, total }`

### 3. `src/app/api/products/[slug]/route.ts`
- `GET /api/products/[slug]` — findUnique, 404 če ni najden
- viewCount increment (async, ne blokirajoč, `.catch(() => {})`)
- `JSON.parse(images)`, vrača `{ product }`

### 4. `src/app/api/experiences/route.ts`
- `GET /api/experiences` — enaki filtri kot products, sort na pricePerPerson namesto price
- `JSON.parse(images)` in `JSON.parse(languages)`
- Vrača `{ experiences, total }`

### 5. `src/app/api/experiences/[slug]/route.ts`
- `GET /api/experiences/[slug]` — findUnique, 404, viewCount increment
- `JSON.parse(images + languages)`, vrača `{ experience }`

### 6. `src/components/sections/product-modal.tsx`
- Dialog (controlled: open ko product !== null)
- Velika slika aspect-video + thumbnail strip (več slik)
- Featured badge + category badge na sliki
- Velika cena + compareAtPrice prečrtana + discount % badge
- Grid 2x2: Kategorija, Lokacija, Zaloga, Teža
- Atributi badges: Ekološko (zelena primary), Ročna izdelava (modra — semantična izjema), Lokalno, Vegansko, Brezplačna dostava (amber), Dostava EU, Dostava svet
- Seller info: ime, Phone/Mail/Website gumbi
- CTA: "Dodaj v košaro" (disabled ko stock=0) + "Spletna stran prodajalca"
- Statistika: Ogledov + Prodanih
- Source note: "Lokalni ponudnik"
- Render-phase ref reset activeImage (ne useEffect — lint rule)

### 7. `src/components/sections/experience-modal.tsx`
- Dialog (controlled)
- Velika slika + thumbnail strip + duration badge (Clock icon)
- Featured + category badge
- Cena "od €XX / osebo"
- Grid 2x2: Trajanje, Skupina (min-max), Jeziki (slovenski prevod), Lokacija
- Meeting point blok z MapPin + address
- Atributi: Družinsko prijazno (Baby icon), Dostopno za invalide (Accessibility icon)
- Provider info: ime, Phone/Mail/Website
- CTA: "Rezerviraj" + "Spletna stran"
- Statistika: Ogledov + Rezervacij
- Source note: "Lokalni ponudnik"

### 8. `src/components/sections/marketplace.tsx`
- `"use client"`, `id="trznica"`, scroll-mt-20
- Header: Badge "Tržnica" + H2 "Tržnica Slovenije" + podnaslov
- Tabs (shadcn): "Izdelki" | "Izkušnje"
- Filter vrstica (max-w-3xl, mx-auto): Select kategorija + Select sort — odvisna od aktivnega tab-a
- Števec (slovenska množina: izdelek/izdelke/izdelkov, izkušnjo/izkušnje/izkušenj)
- Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- `ProductCard`: aspect-square slika, atributi badges (top-left), featured (top-right amber), discount (bottom-right), ime (line-clamp-1), opis (line-clamp-2), rating z zvezdico, cena bold + compareAtPrice prečrtana, seller name + MapPin, shipping badge, CTA "V košaro" + "Podrobnosti"
- `ExperienceCard`: aspect-video slika, category badge (top-left), featured (top-right), duration (bottom-right), ime, opis, rating, "od €XX / osebo", provider + MapPin, family-friendly/accessibility badges, CTA "Rezerviraj" + "Podrobnosti"
- Skeleton loaderji, EmptyState ("Ni najdenih rezultatov"), ErrorState (retry), footer CTA #pridruzi-se
- Produkts in izkušnje fetchajo vzporedno (oba useEffect se izvržeta ob mountu)

## Tehnične odločitve
- Render-phase ref reset activeImage (namesto useEffect) — zaradi `react-hooks/set-state-in-effect` lint rule v Next.js 16
- `JSON.parse` v API-jih vrača typed array (ne string), frontend tipi so strict
- `viewCount` increment je non-blocking (`db.product.update(...).catch(() => {})`)
- Limitiranje limit parameter: `Math.min(Math.max(limit, 1), 100)` — prepreči negativne in prevelike zahtevke
- Modra barva za "Ročna izdelava" badge je dovoljena kot semantična izjema (pravila specifikacije)
- Sort opcije so različne za vsak tab (PRODUCT_SORT_OPTIONS, EXPERIENCE_SORT_OPTIONS) — isti 4 vrednosti, ločene konstante za jasnost

## Testiranje
- `bun run lint` — 0 errorjev, 0 opozoril ✓
- API testi (curl localhost):
  - `GET /api/products?sort=featured&limit=2` → 200, vrača "Ročno pleteni copati" + "Oljčno olje Slovenska Istra"
  - `GET /api/products/rocno-pleteni-copati` → 200, vrača en zapis z vsemi field-i
  - `GET /api/experiences?sort=featured&limit=2` → 200, vrača "Wellness dan v Rogaški Slatini"
  - `GET /api/experiences/wellness-dan-rogaska` → 200
- ViewCount increment dela (async fire-and-forget)

## Glavni agent — kar je še treba narediti
Komponenta `MarketplaceSection` še NI integrirana v `src/app/page.tsx`. Glavni agent naj:
```tsx
import { MarketplaceSection } from "@/components/sections/marketplace";
// ...v page.tsx JSX:
<MarketplaceSection />
```
Lahko tudi doda link v Navigation menu: `<a href="#trznica">Tržnica</a>`.

## Lint status
```
$ bun run lint
$ eslint .
# (no output = clean)
```
