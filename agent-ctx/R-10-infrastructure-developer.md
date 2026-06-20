# Task R-10 — Infrastrukturne komponente (sitemap, robots, PWA, POI, email, booking)

Agent: infrastructure-developer (Z.ai Code)
Datum: 2026-06-20

## Kontekst

Prebral `worklog.md` (Task 1–35). Ugotovljeno: vseh 10 zahtevanih datotek je **že obstajalo** iz prejšnjih faz (predvsem Task 1, 7, 18). Pred rekonstrukcijo so bile komponente povrnjene iz originalnega repozitorija in integrirane v novo Next.js 16 kodo. Moja naloga je bila: **verificirati, da vsaka datoteka ustreza specifikaciji, popraviti manjše odstopanje v manifest.json, in potrditi lint + runtime**.

## Verifikacija obstoječih datotek

### 1. `src/app/sitemap.ts` ✅ (brez sprememb)
- Next.js 16 `MetadataRoute.Sitemap`
- 9 statičnih URL-jev: `/`, `/#destinacije`, `/#načrtuj`, `/#trznica`, `/#izkušnje`, `/#zemljevid`, `/#dogodki`, `/#blog`, `/#pridruzi-se`
- 22 dinamičnih destinacij iz `DESTINATIONS` (preverjeno: `grep -c "slug:" src/lib/slovenia-data.ts` = 22)
- Base URL: `https://ifeelslovenia.si` (iz `@/lib/seo`)
- HTTP 200, 31 `<url>` elementov v XML

### 2. `src/app/robots.ts` ✅ (brez sprememb)
- Next.js 16 `MetadataRoute.Robots`
- `Allow: /`, `Disallow: /admin`, `/owner`, `/api/`
- Dodatno pravilo za socialne crawlerje (Googlebot, Bingbot, Twitterbot, facebookexternalhit)
- `Sitemap: https://ifeelslovenia.si/sitemap.xml`
- HTTP 200, pravilen TXT izpis

### 3. `public/manifest.json` ⚠️ → popravek
- **Pred popravkom**: `name` = "I Feel Slovenia — AI turistična platforma" (predolgo); 4. shortcut = "Destinacije" → `/?section=destinacije`
- **Po popravku**:
  - `name` = "I Feel Slovenia"
  - `short_name` = "I Feel Slovenia"
  - `start_url` = "/", `scope` = "/"
  - `display` = "standalone"
  - `theme_color` = "#2d6a3e" (slovenska alpsko zelena)
  - `background_color` = "#ffffff"
  - 4 shortcuts z **hash URL-ji** (ustrezajo `<section id>` v komponentah):
    - Načrtuj → `/#načrtuj` (scroll-mt na itinerary-planner)
    - Zemljevid → `/#zemljevid` (map-section)
    - Tržnica → `/#trznica` (marketplace)
    - Pridruži se → `/#pridruzi-se` (join-us)
  - 4 ikone (192 + 512, any + maskable)
- HTTP 200, valid JSON

### 4. `public/sw.js` ✅ (brez sprememb)
- Cache-first za statične vire (image, style, script, font)
- Network-first za navigacije (HTML/document) z offline fallback na `/`
- Skip cross-origin, `/api/`, `/admin`, `/owner`
- `install` → predpomni 5 statičnih virov, `skipWaiting`
- `activate` → čisti stare cache verzije, `clients.claim`
- HTTP 200

### 5. `src/app/api/pois/route.ts` ✅ (brez sprememb)
- GET preko Overpass API (POST na `https://overpass-api.de/api/interpreter`)
- BBOX: `45.4,13.4,46.9,16.6` (Slovenija)
- Kategorije: `attraction | museum | restaurant | hotel | viewpoint | natural | religious | shop | all` (shop je dodaten bonus, spec ga ne prepoveduje)
- Query param: `category`, `limit` (default 200, max 500)
- `cache: "no-store"`
- `User-Agent: I-Feel-Slovenia/1.0 (tourism platform)`
- Test: `?category=museum&limit=3` → 200 z 3 muzeji iz OSM

### 6. `src/app/api/pois/[id]/route.ts` ✅ (brez sprememb)
- GET: če podan `wikidata` ID → fetch `https://www.wikidata.org/wiki/Special:EntityData/{id}.json`
- Preko `sitelinks.slwiki` (prednost) ali `sitelinks.enwiki` pridobi naslov članka
- Nato `https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}` → `extract` + `thumbnail.source`
- Fallback: če podan `wikipedia` tag direktno (format `lang:Title`)
- `User-Agent` obvezen na vseh 3 fetchih
- `cache: "no-store"`
- Test: `?wikidata=Q18552411` → 200 s SL extractom o Planšarskem muzeju + thumbnail URL

### 7. `src/lib/email.ts` ✅ (brez sprememb)
- `nodemailer.createTransport` iz env (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`)
- `isEmailDemo()` → `true` ko `!SMTP_HOST || SMTP_HOST === "localhost"`
- `sendEmail({to, subject, html, text?})` → v demo mode `console.log`, sicer `transporter.sendMail`
- `emailTemplate(title, content)` — HTML wrapper z zeleno glavo, belo telo, footer
- `getAdminEmail()`, `getBaseUrl()` helperja

### 8. `src/lib/email-templates.ts` ✅ (brez sprememb)
- 5 dvojezičnih (SL primarni + EN italik pod vsakim odstavkom) template funkcij:
  1. `welcomeEmail(ownerName, businessName, plan)` — dashboard CTA, koraki
  2. `paymentConfirmationEmail(ownerName, plan, amount, renewalDate)` — EUR format, tabela
  3. `renewalReminderEmail(ownerName, plan, daysLeft, renewalDate)` — 3 možnosti (3/7/14 dni pred)
  4. `leadNotificationEmail(ownerName, businessName, leadName, leadEmail, leadPhone, plan, message?)` — povpraševanje
  5. `adminAlertEmail(alertType, details)` — 4 tipi: new_signup, new_lead, cancellation, payment_failed
- `escapeHtml` + `formatEur` (sl-SI locale) helperja
- `PLAN_LABELS_EN` za globalne stranke
- Vsaka funkcija vrne `{subject, html, text}`

### 9. `src/components/sections/booking-panel.tsx` ✅ (brez sprememb)
- `"use client"`
- 4 tabi: Nastanitev (`Hotel`), Aktivnosti (`Ticket`), Hrana (`UtensilsCrossed`), Transport (`Car`)
- TabsTrigger prikazuje count badge na podlagi `bookingData`
- Za vsako destinacijo v `dayPlan.locations`:
  - AffiliateCard (Booking.com / Viator / DiscoverCars / Skyscanner) preko `@/lib/affiliate`
  - ListingCard / ExperienceCard / ProductCard iz `bookingData[destId]`
- Sub-komponente: `DestinationHeading`, `FeaturedVerifiedBadges`, `AffiliateCard`, `ListingCard`, `ExperienceCard`, `ProductCard`, `EmptyState`, `DestinationBlock`
- Kategorijski filtri: `ACCOMMODATION_CATEGORIES`, `DINING_CATEGORIES`, `FOOD_PRODUCT_CATEGORIES`
- Tipi: `BookingListing`, `BookingExperience`, `BookingProduct`, `BookingOptions`, `BookingData`
- Props: `{ dayPlan: DayPlan; bookingData?: BookingData | null }`

### 10. `src/app/api/itinerary/bookings/route.ts` ✅ (brez sprememb)
- POST, telo: `{ destinationIds: string[] }`
- Sanitizacija: unikatni ne-prazni stringi
- Vzporedno `Promise.all` pridobi listings/experiences/products iz `db` (Prisma) z `destinationId IN [...]`, `orderBy featured DESC, rating DESC`
- Limit **3 na destinacijo** na vsakem tipu
- Razčleni JSON polja (`images`, `specialties`, `languages`)
- Vrne `Record<destId, {listings, experiences, products}>`
- Test: `{"destinationIds":["bled","bohinj"]}` → 200 z bled.listings = Hotel Vila Bled + 2 več

## Testiranje (live, port 3000)

```
GET  /sitemap.xml              → 200, 31 <url>
GET  /robots.txt                → 200, Allow/Disallow pravilno
GET  /manifest.json             → 200, name="I Feel Slovenia", 4 shortcuts z hash URL
GET  /sw.js                     → 200
GET  /api/pois?category=museum  → 200, 3 OSM muzeji
GET  /api/pois/[id]?wikidata=…  → 200, Wikipedia SL extract + thumbnail
POST /api/itinerary/bookings    → 200, bled.listings/experiences/products pravilno
```

## Lint

```
$ bun run lint
$ eslint .
(0 errorjev, 0 opozoril)
```

## Povzetek sprememb

| Datoteka | Status | Spremembe |
|---|---|---|
| src/app/sitemap.ts | ✅ nespremenjeno | Verificirano: 9 + 22 URL-jev |
| src/app/robots.ts | ✅ nespremenjeno | Verificirano: pravila disallow |
| public/manifest.json | ⚠️ popravek | `name` skrajšan; 4. shortcut zamenjan: Destinacije → Pridruži se; URL-ji iz `?section=` v `#hash` |
| public/sw.js | ✅ nespremenjeno | Verificirano: cache-first/network-first |
| src/app/api/pois/route.ts | ✅ nespremenjeno | Verificirano: Overpass + User-Agent + no-store |
| src/app/api/pois/[id]/route.ts | ✅ nespremenjeno | Verificirano: Wikidata → Wikipedia REST |
| src/lib/email.ts | ✅ nespremenjeno | Verificirano: demo fallback |
| src/lib/email-templates.ts | ✅ nespremenjeno | Verificirano: 5 dvojezičnih templateov |
| src/components/sections/booking-panel.tsx | ✅ nespremenjeno | Verificirano: 4 tabi + affiliate + listings |
| src/app/api/itinerary/bookings/route.ts | ✅ nespremenjeno | Verificirano: POST, limit 3/destinacijo |

## Seznam vseh datotek (končna stanja)

1. `/home/z/my-project/src/app/sitemap.ts`
2. `/home/z/my-project/src/app/robots.ts`
3. `/home/z/my-project/public/manifest.json`
4. `/home/z/my-project/public/sw.js`
5. `/home/z/my-project/src/app/api/pois/route.ts`
6. `/home/z/my-project/src/app/api/pois/[id]/route.ts`
7. `/home/z/my-project/src/lib/email.ts`
8. `/home/z/my-project/src/lib/email-templates.ts`
9. `/home/z/my-project/src/components/sections/booking-panel.tsx`
10. `/home/z/my-project/src/app/api/itinerary/bookings/route.ts`

## Zaključek

Vseh 10 infrastrukturnih komponent je na mestu in ustreza specifikaciji. Eno popravljen odstopanje (manifest.json: name + 4. shortcut). Lint čist (0 errorjev, 0 opozoril). Vsi API endpointi in statične datoteke vračajo 200 z pravilno vsebino.
