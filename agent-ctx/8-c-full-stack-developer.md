# Task 8-c — ListingsSection + ListingModal + integracija v DestinationModal

**Agent:** full-stack-developer
**Task ID:** 8-c
**Date:** 2026-06-19

## Kontekst
- Prebral `worklog.md` — platforma "I Feel Slovenia" (Next.js 16) je v fazi B2B monetizacije. Prejšnji taski (1-7) postavili destinacije, AI itinerer, vreme, mapo, blog, koledar dogodkov, "Pridruži se" landing za lokale + leads API.
- Task 6-c je dodal PricingPlan strukturo + leads capture.
- Listing model v Prisma schema obstaja (10 seedanih lokalov v SQLite prek `prisma/seed-listings.ts`).
- API routes obstajajo: `GET /api/listings?category=&destinationId=&plan=&featured=&limit=&sort=` in `GET /api/listings/[slug]` (z viewCount increment).
- Moja naloga: javni prikaz vseh lokalov + integracija v DestinationModal kot "Lokali v bližini" sekcija.

## Ustvarjene datoteke

### 1. `src/lib/listings-types.ts` (~55 vrstic)
- `ListingCategory` union: `"hotel" | "restaurant" | "bar" | "activity" | "shop" | "transport" | "other"`
- `ListingPlan` union: `"free" | "premium" | "enterprise"`
- `Listing` interface — strikno ujema z API odgovorom (vsa polja iz specifikacije)
- `CATEGORY_LABELS` — slovenske oznake (Hotel, Restavracija, Bar, Aktivnost, Trgovina, Transport, Drugo)
- `CATEGORY_ICONS` — emoji ikone za badge + modal fallback
- `PLAN_LABELS` — slovenske oznake paketov (Osnovni, Premium, Enterprise)

### 2. `src/components/sections/listing-modal.tsx` (~290 vrstic, "use client")
`ListingModal` komponenta — controlled Dialog s `listing: Listing | null` in `onClose` props.
- **Galerija slik**: glavna slika aspect-video z gradientom + badge kategorije (top-left) + plan badge (top-right) + ime + verified + destinationName (bottom). Thumbnail strip pod glavno sliko če >1 slika (klik spremeni aktivno)
- **Telo**: rating (z zvezdico + reviewCount) + priceRange badge + featured badge; kratek opis; longDescription v ločeni kartici z bg-muted/30
- **Grid 2x2 info**: Kategorija (Building2), Lokacija (MapPin), Naslov (Compass), Odpiralni čas (Clock)
- **Specialties**: badge lista (če obstajajo)
- **Kontakt**: phone (tel:), email (mailto:), website — gumbi z ikonami
- **Statistika**: viewCount (Eye) + clickCount (MousePointerClick) v 2x1 grid
- **CTA**: velik gumb "Obišči spletno stran" (external link)
- **Povezava**: link na #destinacije (onClick zapre modal)
- Scroll: `max-h-[80vh] overflow-y-auto scroll-area-custom`
- `PlanBadge` pomožna komponenta: premium = amber, enterprise = primary, free = null
- `InfoItem` + `StatCard` pomožni komponenti

### 3. `src/components/sections/listings.tsx` (~360 vrstic, "use client", `id="lokali"`)
`ListingsSection` komponenta — glavni javni imenik lokalov.
- **Header**: Badge "B2B imenik" (Store ikona, primary/10), H2 "Lokali v Sloveniji", podnaslov "Hotelir, restavracije in aktivnosti — neposredno od lastnikov"
- **Filter vrstica** (rounded-xl border): glava z Filter ikono + "Počisti filtre" gumb (samo ko so aktivni). Grid `sm:grid-cols-3`:
  - Kategorija (Vse + 7)
  - Destinacija (Vse + 12 iz `DESTINATIONS` iz slovenia-data.ts)
  - Sort (Izpostavljeni / Najvišja ocena / Najnovejši) — `showAllOption=false`
- **Fetch**: `useCallback` + `useEffect`, klice `/api/listings?category=&destinationId=&sort=&limit=50` z `cache: "no-store"`. State: listings, total, loading, error, selected (za modal). Error handling: try/catch + error state z "Poskusi znova" gumbom
- **Števec**: "Prikazujem X lokalov" (slovenska pluralizacija: lokal/lokale/lokalov)
- **Loading**: 6x `ListingSkeleton` (Skeleton: aspect-video + h-5/h-4/h-6/h-8)
- **Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- **ListingCard** — `getPlanCardStyles(plan)` vrača:
  - **Free**: `bg-muted/20` (siva), brez plan badge-a
  - **Premium**: `border-primary` + amber "★ Premium" badge (top-right)
  - **Enterprise**: `border-2 border-primary shadow-lg scale-[1.02]` + primary "Enterprise" badge z Sparkles ikono (top-right)
  - Vsebina: slika aspect-video (object-cover, group-hover:scale-105) + category badge (bg-background/90 backdrop-blur, top-left) + plan badge (top-right) + verified badge (bg-primary, bottom-left); ime (text-lg font-semibold) + opis line-clamp-2; rating (zvezdica + številka + število mnenj); lokacija (MapPin + destinationName + address); cena (Badge secondary) + openingHours (Clock, line-clamp-1); specialties (prve 3 kot mali chipi); CTA vrstica — "Podrobnosti" (outline, flex-1) + "Spletna stran" (ghost, external link z Globe + ExternalLink ikono)
- **EmptyState**: rounded-xl border-dashed, Store ikona, "Ni lokalov za izbrane filtre", "Počisti filtre" gumb
- **Footer note**: rounded-xl border-primary/30 bg-primary/5, Building2 ikona, "Želite biti tukaj? Pridruži se in izpostavite svoj lokal.", link "Pridruži se" (#pridruzi-se z ArrowRight)

### 4. `src/components/sections/destination-modal.tsx` (posodobljen, +~200 vrstic)
- Dodal import: `useEffect`, `useState`, `Skeleton`, `ListingModal`, `CATEGORY_LABELS`, `CATEGORY_ICONS`, `PLAN_LABELS`, `Listing` tip, ikone `Building2`, `Star`, `ArrowRight`, `Store`
- Dodan state: `nearbyListings: Listing[]`, `loadingNearby: boolean`, `selectedListing: Listing | null`
- Dodan `useEffect` ki:
  - Ko `destination` null → reset state
  - Drugače fetch-a `/api/listings?destinationId=${destination.id}&limit=4&sort=featured` z `cache: "no-store"`
  - `cancelled` flag preprečuje race condition ob hitrih spremembah destinacije
- Vstavil **"Lokali v bližini"** sekcijo PRED affiliate "Rezerviraj direktno" CTA:
  - `SectionTitle` z `Building2` ikono + podnaslov "Hotelir, restavracije in aktivnosti — prijavljeni lastniki."
  - Loading: 4x `NearbySkeleton` v 2x2 grid
  - Empty: rounded-lg border-dashed, Store ikona, "Ni registriranih lokalov v bližini. Postanite prvi!", link "Pridruži se" (#pridruzi-se, onClick zapre destination modal)
  - List: 2x2 grid `NearbyListingCard` + link na dnu "Vsi lokalci v regiji" (#lokali, onClick zapre destination modal)
- `NearbyListingCard`: Card role="button" tabindex=0 (keyboard dostopen, Enter/Space odpre); aspect-square slika z group-hover scale; plan badge top-right (enterprise=primary, premium=amber, free=brez); category badge secondary z emoji + label (top); ime line-clamp-1; rating z zvezdico
- `NearbySkeleton`: Skeleton aspect-square + 3 vrstice
- `ListingModal` renderiran ZUNAJ `DialogContent`-a ampak ZNOTRAJ `Dialog`-a (omogoča dvojno odpiranje — destination modal + listing modal)

## Tehnične specifikacije
- **TypeScript strict** — vse tipizirano, union tipi za category/plan
- **ESLint**: `bun run lint` → 0 errors, exit 0 ✓
- **shadcn/ui**: Card, CardContent, Badge, Button, Dialog, DialogContent, DialogTitle, DialogDescription, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton
- **lucide-react**: Star, MapPin, Clock, Phone, Mail, Globe, ExternalLink, CheckCircle2, Eye, MousePointerClick, Building2, Filter, X, ArrowRight, Store, Sparkles, Tag, Compass
- **NO indigo/blue** — samo primary (zelena), accent (terakota), muted, amber za premium badge, primary/10 za footer note bg
- **Slovenski UI** — vsa besedila v slovenščini (kategorije, paketi, akcije, opisi)
- **Mobile-first responsive** — grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, mini-card grid `grid-cols-2`
- **Accessibility**: semantic HTML (section, h2, h3, h4), ARIA labels na ikonah (`aria-hidden="true"`), keyboard navigacija (Card role=button + tabindex + onKeyDown), `sr-only` naslovi v modalih
- **Performance**: `loading="lazy"` na slikah, `cache: "no-store"` na fetch, cancelled flag preprečuje zombie state update, Skeleton loading state

## API testiranje (curl)
- `GET /api/listings?limit=4` → 200, vrača 4 lokale s parsanimi images/specialties ✓
- `GET /api/listings?destinationId=bled&limit=4` → 200, vrača 3 lokale (Vila Bled enterprise, Penzion Berc premium, Bled Taxi premium) ✓
- Prisma query log potrjuje: `WHERE destinationId = ? ORDER BY featured DESC LIMIT 4`

## Rezultat
- Javni imenik lokalov polno funkcionalen (filtri + sort + modal s podrobnostmi)
- ListingModal reusable — uporabljen v listings.tsx in destination-modal.tsx
- DestinationModal zdaj kontekstualno prikazuje lokale v bližini (B2B cross-sell priložnost)
- Footer note in empty state vodijo v #pridruzi-se (monetizacijski funnel)
- Pripravljeno za integracijo v `src/app/page.tsx` (glavni agent bo dodal `<ListingsSection />`)
