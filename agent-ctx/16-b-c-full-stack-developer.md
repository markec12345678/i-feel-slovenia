# Task 16-b/c — POI layer v MapView + PoiModal z Wikipedia

**Agent:** full-stack-developer
**Datum:** nadaljevanje projekta "I Feel Slovenia"
**Predhodni task:** 15 (popravek Otočec slike)

## Kaj je bilo narejeno

### 1. Ustvarjena: `src/components/sections/poi-modal.tsx` (~310 vrstic)

PoiModal — Dialog komponenta s podrobnostmi POI-ja:

- **"use client"**, props `{ poi: Poi | null, onClose: () => void }`
- **Controlled Dialog** — open ko `poi !== null`
- **useEffect fetch** `/api/pois/${poi.id}?osmId=X&type=node&wikidata=Y&wikipedia=Z` ko se poi spremeni (cancel-safe)
- **Header slika**: poi.image (iz OSM) → wikiImage (Wikipedia thumbnail) → fallback placeholder z emoji iz CATEGORY_META (color-tinted background)
- **Vsebina**:
  - Category badge (barvast, z emoji) iz CATEGORY_META
  - Ime (H2) + subcategory (text-xs capitalize)
  - Naslov (MapPin ikona) če obstaja
  - OSM description če obstaja
  - Wikipedia extract (skeleton med loading, amber alert ob error-ju)
  - Link "Preberi več na Wikipediji" (target=_blank, ExternalLink ikona)
  - Kontakt grid 2x2: phone (tel:), website (target=_blank), openingHours, cuisine
  - Koordinate (tabular-nums)
  - Source attribution: "Podatki: OpenStreetMap" z linkom na osm.org + "opis: Wikipedia"
- **CATEGORY_META exportan** (uporablja tudi v map-view): 9 kategorij z emoji + barva + slovenski label
- **Helper funkcije**: `prettyUrl`, `buildWikiLinkFromTag` (fallback iz OSM wikipedia taga "sl:Naslov"), `escapeHtml`/`escapeAttr` v map-view
- **a11y**: DialogTitle/Description sr-only, ARIA labels na ikonah, focus-visible ring na povezavah

### 2. Posodobljena: `src/components/sections/map-view.tsx` (~470 vrstic, prej ~290)

POI layer dodan **brez poškodbe** obstoječih funkcionalnosti:

- **Nov state**:
  - `selectedPoi: Poi | null` — za PoiModal
  - `showPois: boolean` (default `false` — stran se hitro naloži, ker Overpass API traja 20-70s)
  - `poiCategory: string` (default `"attraction"`)
  - `pois: Poi[]`, `loadingPois`, `poiError`
- **Nov `poiLayerRef`** (L.LayerGroup) inicializiran v map init useEffect
- **useEffect za POI fetch** (odvisen `[showPois, poiCategory]`): cancel-safe, kliče `/api/pois?category=X&limit=200`
- **useEffect za render POI markerjev** (odvisen `[pois, showPois]`):
  - Manjši markerji (28px / size-7) z emoji iz CATEGORY_META
  - Barva glede na kategorijo (semantične barve — dovoljena izjema "no indigo/blue")
  - Beli border + shadow, cursor: pointer
  - Popup: ime + barvast category badge + "Podrobnosti" gumb (data-poi-id, class `map-poi-cta`)
- **Event delegation** posodobljen: razlikuje `.map-poi-cta` (→ PoiModal) in `.map-popup-cta` (→ DestinationModal). `poisRef` za closure-safe iskanje.
- **Novi kontrolni elementi** (zgoraj desno, pod obstoječimi):
  - Toggle gumb "Pokaži/Skrij POI" (Eye/EyeOff ikona, aria-pressed, variant=default ko aktiven)
  - Select za kategorijo POI-jev (Layers ikona + SelectTrigger size=sm) — prikaže se samo ko je `showPois=true`. Opcije: Atrakcije / Muzeji / Narava / Razgledišča / Religiozno
- **Loading state**: mali spinner (Loader2 animate-spin) v zgornjem levem kotu — ne blokira zemljevida
- **Error state**: amber badge pod spinnerjem ko `showPois && !loadingPois && poiError`
- **Info badge** (spodaj levo) posodobljen: prikaže "{N} POI" badge ko je POI layer vklopljen
- **PoiModal** renderan na dnu komponente

### 3. Integracija

- Klik na **POI marker** → `setSelectedPoi(poi)` → odpre **PoiModal** (z Wikipedia extract)
- Klik na **destinacijski marker** → še vedno odpre **DestinationModal** (kot prej, nespremenjeno)
- Route polyline, kontrolni gumbi (Vse destinacije, Ponastavi, Pokaži/Skrij pot) — vse nespremenjeno

## Tehnične podrobnosti

- **TypeScript strict** — lokalno definiran `Poi` interface v obeh datotekah (po API specifikaciji)
- **shadcn/ui**: Dialog, Badge, Skeleton, Select (SelectTrigger/Content/Item/Value), Button
- **lucide-react**: MapPin, ExternalLink, Phone, Globe, Clock, Loader2, AlertCircle, Navigation, Layers, Eye, EyeOff, Star, X
- **Tailwind CSS 4** — primary (zelena), accent (terakota), muted, amber za error badge; category barve so semantične izjeme
- **Mobile-first responsive** — sm/lg breakpointi, Select se prilagaja
- **Slovenščina** v vsem UI
- **XSS zaščita**: `escapeHtml` / `escapeAttr` helper funkciji za OSM podatke v HTML popup-ih

## Verifikacija

- ✅ `bun run lint` — 0 errorjev, 0 opozoril
- ✅ Dev server: `✓ Compiled`, `GET / 200` OK
- ✅ API endpoints delujejo (počasni zaradi Overpass API-ja — zato je POI default OFF)

## Datoteke

| Datoteka | Akcija | Vrstice |
|----------|--------|---------|
| `src/components/sections/poi-modal.tsx` | Ustvarjena | ~310 |
| `src/components/sections/map-view.tsx` | Posodobljena | ~470 (prej ~290) |
