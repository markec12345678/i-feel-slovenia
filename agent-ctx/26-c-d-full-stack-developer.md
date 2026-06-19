# Task 26-c/d — SEO optimizacija + PWA za I Feel Slovenia

**Agent:** full-stack-developer
**Datum:** 2026-06-19
**Predhodno:** Task 24-25 (pavšalni oglasni model — products/experiences CRUD v owner dashboardu)

## Povzetek

Implementiral sem celovito SEO optimizacijo (dynamic metadata, Schema.org strukturirani podatki, sitemap.xml, robots.txt, OpenGraph/Twitter) in PWA podporo (manifest.json, service worker z offline fallback, Apple touch icon, theme-color). Popravil sem tudi pre-existing bug: `IntlProvider` (next-intl) ni bil integriran v `layout.tsx`, kar je povzročalo `useTranslations` runtime error in 404 na `/` po restartu dev serverja.

## Delovni log

1. Prebral `/home/z/my-project/worklog.md` za kontekst projekta
2. Prebral obstoječe datoteke: `src/app/layout.tsx`, `public/robots.txt`, `src/lib/slovenia-data.ts`, `src/lib/types.ts`, `src/lib/marketplace-types.ts`, `src/lib/listings-types.ts`, `src/app/page.tsx`, `next.config.ts`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/components/intl-provider.tsx`
3. Ustvaril `src/lib/seo.ts` — helperji za Metadata (destinationMetadata, productMetadata, experienceMetadata, listingMetadata, siteMetadata) z BASE_URL iz env, OG/Twitter slike, alternates.canonical
4. Ustvaril `src/components/structured-data.tsx` — server component z JSON-LD komponentami: DestinationJsonLd (TouristDestination), ListingJsonLd (LocalBusiness), ProductJsonLd (Product), ExperienceJsonLd (TouristTrip), WebSiteJsonLd, OrganizationJsonLd, BreadcrumbJsonLd
5. Ustvaril `src/app/sitemap.ts` — Next.js 16 MetadataRoute.Sitemap s 9 statičnimi sekcijami + 22 dinamičnimi destinacijami
6. Ustvaril `src/app/robots.ts` — Next.js 16 MetadataRoute.Robots z disallow pravili za /admin, /owner, /api/
7. **Pobrisal `public/robots.txt`** (konflikt z `src/app/robots.ts` — Next.js prioritizira statično datoteko)
8. Ustvaril `scripts/gen-icons.ts` — sharp skripta, ki iz SVG generira `icon-192.png` in `icon-512.png` (alpsko zeleno ozadje, stiliziran Triglav, "IFS" monogram)
9. Generiral PWA ikone: `public/icon-192.png` (5.8KB), `public/icon-512.png` (19KB), `public/icon-192.src.svg`, `public/icon-512.src.svg`
10. Ustvaril `public/manifest.json` — PWA manifest z 4 ikonami (any+maskable za obe velikosti), 4 shortcuts (AI načrtovalec, Zemljevid, Tržnica, Destinacije), slovenščina, theme_color #2d6a3e
11. Ustvaril `public/sw.js` — service worker: cache-first za statične vire (slike, stili, skripte, fonti), network-first za navigacije z offline fallback na cache, skip API/admin/owner, version key ifeelslovenia-v1
12. Ustvaril `src/components/sw-register.tsx` — client component, registrira SW samo v production + secureContext (izpusti v dev)
13. Posodobil `src/app/layout.tsx`:
    - Uvoz `siteMetadata` iz `@/lib/seo` (metadataBase, OG, Twitter, manifest, ikone, robots)
    - Dodan `export const viewport: Viewport` z `themeColor` (light/dark/default #2d6a3e), colorScheme
    - `<head>` eksplicitno: manifest link, apple-touch-icon, favicon SVG, apple-mobile-web-app-capable, mobile-web-app-capable, format-detection
    - `<head>` vključuje `<WebSiteJsonLd />` in `<OrganizationJsonLd />`
    - `<body>` vključuje `<ServiceWorkerRegister />`
    - **FIX:** Dodal `<IntlProvider>` wrapper (prej manjkal — povzročalo `useTranslations` error in 404 na `/`)
14. Lint: `bun run lint` → exit 0, 0 errorjev, 0 opozoril
15. Verifikacija s curl: `/` 200, `/sitemap.xml` 200, `/robots.txt` 200, `/manifest.json` 200, `/sw.js` 200, `/icon-192.png` 200, `/icon-512.png` 200, `/logo.svg` 200
16. Verifikacija JSON-LD v HTML: 2 strukturirana bloka (WebSite + Organization) pravilno izpisana v `<head>`

## Bug fix: IntlProvider

Ob restartu dev serverja (po init-fullstack script) je `/` začel vračati 404. V dev.log se je pojavilo:
```
⨯ Error: Failed to call `useTranslations` because the context from `NextIntlClientProvider` was not found.
> 42 |   const t = useTranslations("nav");
```

Vzrok: prejšnja naloga je dodala `useTranslations("nav")` klice v `navigation.tsx`, `footer.tsx`, `hero.tsx` ter ustvarila `src/components/intl-provider.tsx`, vendar ga NI integrirala v `layout.tsx`. Pred restartom je dev server imel cached compile, kjer to ni bilo vidno.

Rešitev: v `layout.tsx` dodana `<IntlProvider>` (async server component, kliče `getMessages()` iz `next-intl/server`) znotraj `<SessionProviderWrapper>`. Zdaj `useTranslations` dela v vseh client komponentah.

## Ustvarjene datoteke (10)

### 1. `src/lib/seo.ts` (213 vrstic)
- `BASE_URL`, `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION` konstante
- `destinationMetadata(dest)` — Metadata za destinacijo (title, description, keywords, OG, Twitter, canonical)
- `productMetadata(product)` — Metadata za izdelek iz tržnice
- `experienceMetadata(exp)` — Metadata za izkušnjo
- `listingMetadata(listing)` — Metadata za B2B listing
- `siteMetadata` — glavni Metadata objekt (metadataBase, title.template `%s | I Feel Slovenia`, OG, Twitter, robots, manifest, icons)

### 2. `src/components/structured-data.tsx` (233 vrstic)
Server component (brez "use client"). `JsonLdScript` wrapper izpiše `<script type="application/ld+json">`.
- `DestinationJsonLd` — `TouristDestination` z GeoCoordinates, AggregateRating, PostalAddress (SI + region), touristType
- `ListingJsonLd` — `LocalBusiness` z address, telephone, email, priceRange, openingHours, specialty, aggregateRating, sameAs
- `ProductJsonLd` — `Product` z brand, offers (price, currency, availability), aggregateRating
- `ExperienceJsonLd` — `TouristTrip` z provider (LocalBusiness), offers, inLanguage, aggregateRating
- `WebSiteJsonLd` — `WebSite` z publisher, potentialAction (SearchAction)
- `OrganizationJsonLd` — `Organization` z logo, areaServed, sameAs (Instagram/Facebook/YouTube), contactPoint
- `BreadcrumbJsonLd` — `BreadcrumbList` z itemListElement

### 3. `src/app/sitemap.ts` (54 vrstice)
Next.js 16 MetadataRoute.Sitemap. 9 statičnih URL-jev (homepage + 8 hash sekcij) + 22 dinamičnih URL-jev za destinacije (1.0 → 0.6 priority).

### 4. `src/app/robots.ts` (24 vrstice)
Next.js 16 MetadataRoute.Robots. Dve pravilni bloki: `*` (allow /, disallow admin/owner/api) + `Googlebot/Bingbot/Twitterbot/facebookexternalhit`. Host + sitemap URL.

### 5. `public/manifest.json` (59 vrstic)
PWA manifest:
- name/short_name v slovenščini
- theme_color `#2d6a3e` (alpsko zelena, NO indigo/blue)
- 4 ikone (192+512, vsaka z "any" in "maskable" purpose)
- 4 shortcuts (AI načrtovalec, Zemljevid, Tržnica, Destinacije) z lastno ikono
- lang sl-SI, display standalone, orientation portrait-primary

### 6. `public/sw.js` (118 vrstic)
Service worker:
- `install`: predpomni 5 statičnih virov (/, manifest, icon-192, icon-512, logo.svg) z individual `cache.add()` (ne `addAll()` da ne odpade ob enem miss-u)
- `activate`: izbriše stare cache verzije, `clients.claim()`
- `fetch`: 
  - skip non-GET, cross-origin, /api/, /admin/, /owner/
  - cache-first za slike/stili/skripte/fonti (z runtime caching)
  - network-first za navigacije (HTML) z offline fallback na cache ali `/`
  - cache-first z network fallback za ostalo
- `message`: podpira `SKIP_WAITING` ukaz

### 7. `src/components/sw-register.tsx` (52 vrstic)
Client component (`"use client"`). `useEffect` registrira `/sw.js` z `updateViaCache: "none"` samo če:
- `process.env.NODE_ENV === "production"` (izpusti v dev)
- `window.isSecureContext` (HTTPS ali localhost)
- `"serviceWorker" in navigator`

Posluša `updatefound` dogodek in pošlje `SKIP_WAITING` kadar je nova verzija pripravljena.

### 8. `src/app/layout.tsx` (posodobljen, 76 vrstic)
- `export const metadata = siteMetadata` (metadataBase, OG, Twitter, robots, manifest, icons)
- `export const viewport: Viewport` (themeColor light/dark/default, width, initialScale, colorScheme)
- `<head>`: manifest link, apple-touch-icon, favicon SVG, apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style, apple-mobile-web-app-title, mobile-web-app-capable, format-detection, `<WebSiteJsonLd />`, `<OrganizationJsonLd />`
- `<body>`: ThemeProvider → SessionProviderWrapper → **IntlProvider** (FIX!) → children + Toaster, nato ServiceWorkerRegister

### 9. `scripts/gen-icons.ts` (49 vrstic)
Sharp generator. SVG vir: gradient zeleno ozadje (#2d6a3e → #1f4f2c), stiliziran Triglav (polygon), valovi, "IFS" text (Georgia bold), "SLOVENIJA" subtext (Arial, letter-spacing 2). Generira PNG 192x192 in 512x512. Po zagonu pobrišemo (enkratni generator).

### 10. PWA ikone (public/)
- `icon-192.png` (5.8KB)
- `icon-512.png` (19KB)
- `icon-192.src.svg` (1.3KB) — izvorni SVG
- `icon-512.src.svg` (1.2KB) — izvorni SVG

## Tehnične odločitve

1. **`metadataBase` v `siteMetadata`** — Next.js 16 ga potrebuje za resolucijo relativnih URL-jev v OG slikah. Default `https://ifeelslovenia.si` (override z `NEXT_PUBLIC_BASE_URL` env).
2. **`title.template: "%s | I Feel Slovenia"`** — vsi podnaslovi dobijo končnico " | I Feel Slovenia", homepage pa default "I Feel Slovenia — AI načrtovalec potovanj".
3. **JSON-LD v `<head>` namesto `<body>`** — standardno mesto za strukturirane podatke, Google parserji pričakujejo tam.
4. **`touristType` v TouristDestination** — uporablja `dest.bestFor` (romantika, družina, narava, ...) namesto fiksne vrednosti.
5. **Cache-first za statične vire** — slike/stili/skripte se ne spreminjajo pogosto, hit cache hit je veliko hitrejši.
6. **Network-first za navigacije** — HTML se lahko spremeni (npr. nov dodan listing), zato najprej network; ob offline fallback na cache.
7. **API/admin/owner izključeni iz SW** — nikoli ne cachiramo API odgovorov (vedno fresh), privatne rute pa naj SW ne dostopa.
8. **`updateViaCache: "none"` pri SW registraciji** — vsakič preveri server za novo sw.js (ne uporabi HTTP cache).
9. **PNG ikone z "any" in "maskable" purpose** — Android adaptive icon zahteva maskable; some launchers pričakujejo "any".
10. **Slovenija tematika za ikone** — alpsko zeleno ozadje (#2d6a3e), stiliziran Triglav (najvišji vrh), "IFS" monogram.
11. **`pobrisal public/robots.txt`** — Next.js prioritizira statično datoteko nad `src/app/robots.ts`. Če obstaja obe, se `robots.ts` ne upošteva. Da `src/app/robots.ts` deluje, sem moral pobrisati statično.
12. **FIX: IntlProvider** — `getMessages()` iz `next-intl/server` potrebuje request config (request.ts), kar zahteva `withNextIntl` plugin v `next.config.ts`. Plugin je bil prisoten, vendar `IntlProvider` komponenta ni bila nikjer uporabljena.

## Lint status
- `bun run lint` → exit 0, 0 errorjev, 0 opozoril
- Dev log: `GET / 200`, `GET /sitemap.xml 200`, `GET /robots.txt 200`, `GET /manifest.json 200`, `GET /sw.js 200`, `GET /icon-192.png 200`, `GET /icon-512.png 200`

## Stage Summary

- ✅ Dynamic metadata helperji za destinacije, izdelke, izkušnje, listinge
- ✅ Schema.org JSON-LD komponente: TouristDestination, LocalBusiness, Product, TouristTrip, WebSite, Organization, BreadcrumbList
- ✅ `sitemap.xml` dostopen na `/sitemap.xml` (9 statičnih + 22 dinamičnih URL-jev)
- ✅ `robots.txt` dostopen na `/robots.txt` (disallow admin/owner/api, sitemap reference)
- ✅ `manifest.json` dostopen na `/manifest.json` (4 ikone, 4 shortcuts, slovenščina)
- ✅ PWA ikone: `icon-192.png` in `icon-512.png` (alpsko zelena, Triglav motiv)
- ✅ Service worker z offline fallback (cache-first za statične, network-first za navigacije)
- ✅ SW se registrira samo v production (izpusti v dev)
- ✅ `metadataBase` nastavljen za pravilno resolucijo OG slik
- ✅ `theme-color` meta (light/dark/default #2d6a3e)
- ✅ Apple touch icon, apple-mobile-web-app-capable, mobile-web-app-capable
- ✅ JSON-LD WebSite + Organization pravilno izpisana v `<head>`
- ✅ Lint čist (0 errorjev)
- ✅ Slovenščina v UI, NO indigo/blue (alpsko zelena #2d6a3e)
- ✅ Mobile-first responsive (viewport, theme-color, apple meta tags)
- ✅ **BONUS FIX:** Integriran `IntlProvider` v layout.tsx (prej manjkal — povzročalo 404 na `/`)
- ✅ Worklog.md appendan + ta agent-ctx zapisan
