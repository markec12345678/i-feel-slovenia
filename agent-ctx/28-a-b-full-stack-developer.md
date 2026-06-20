# Task 28-a/b — Booking panel za AI itinerer

Agent: full-stack-developer
Datum: 2025

## Kontekst
Prejšnji taski (1-27) so vzpostavili platformo I Feel Slovenia (Next.js 16, App Router, TypeScript, Tailwind 4, shadcn/ui, Prisma+SQLite). 22 slovenskih destinacij z id/name/coords v `src/lib/slovenia-data.ts`. Prisma modeli `Listing`, `Experience`, `Product` imajo `destinationId` polje. `src/lib/affiliate.ts` generira Booking.com/DiscoverCars/Viator/Skyscanner/WorldNomads povezave. AI itinerer generator v `/api/itinerary` vrača `Itinerary` z `DayPlan[]` (vsak dan ima `LocationVisit[]` z `destination_id`, `destination_name`, `time_slot`, ...).

Problem: uporabnik generira AI itinerer ampak potem ne ve kako rezervirati.

## Rešitev

### 1. API — `src/app/api/itinerary/bookings/route.ts`
- POST handler, telo `{ destinationIds: string[] }`.
- Sanitizacija + dedup IDjev. Prazna množica → `{}`.
- `Promise.all` vzporedno pridobi listings, experiences, products z `destinationId IN [...]`, `orderBy: featured DESC, rating DESC`, `take: destinationIds.length * 3` (pool, nato razdelimo po 3 na destinacijo).
- Razčleni JSON polja: `images`, `specialties`, `languages`.
- Robustno: prazni arrayi za destinacije brez podatkov; try/catch → 500.
- Tipi `BookingOptions` in `BookingData` so exportani iz route (server side) — client ima lastne mirror tipe v `booking-panel.tsx` (da ne potegne Prisma na client).

### 2. Komponenta — `src/components/sections/booking-panel.tsx`
- `"use client"`. Props: `dayPlan: DayPlan`, `bookingData?: BookingData | null`.
- 4 Tabs (Nastanitev | Aktivnosti | Hrana | Transport). TabsList `grid-cols-2 sm:grid-cols-4`. Triggerji prikazujejo število najdenih opcij kot badge.
- Za vsako destinacijo iz `dayPlan.locations`:
  - **Nastanitev**: Booking.com affiliate kartica + naši listings kategorij hotel/spa/other (iz `bookingData[destId].listings`, filtrirano).
  - **Aktivnosti**: Viator affiliate kartica + naše experiences.
  - **Hrana**: naši listings restavracija/bar + naši products (food/wine/honey/oil).
  - **Transport**: DiscoverCars affiliate za prvo destinacijo + Skyscanner let v Ljubljano (letališče Jožeta Pučnika).
- Sub-komponente:
  - `ListingCard` / `ExperienceCard` / `ProductCard` — slika `size-12`, ime, cena/rating/duration, featured/verified badge-i, "Obišči" gumb (website > email > phone fallback).
  - `AffiliateCard` — partner ikona + opis + CTA gumb. `target="_blank" rel="noopener noreferrer sponsored"`.
  - `EmptyState` — prijazno sporočilo ko v bazi nič ni.
  - `DestinationHeading` — MapPin + ime destinacije.
- Mobile-first responsive. Ni indigo/modre (category barve so semantične: emerald za verified, amber za featured).

### 3. Integracija — `src/components/sections/itinerary-planner.tsx`
- Nov state `bookingData: BookingData | null`.
- Nov useEffect odvisen od `itinerary`: zbere `destination_id` iz vseh dni (deduplicirano), POSTa na `/api/itinerary/bookings`, shrani rezultat. Cleanup flag preprečuje race condition ob hitrih spremembah.
- Po `day.locations.map(...)` znotraj CardContent dodan `<BookingPanel dayPlan={day} bookingData={bookingData} />`.
- Odstranjen stari "Rezerviraj" gumb znotraj posamezne lokacije (bil je duplikat zdaj). S tem odstranjeni nepotrebni importi: `getAffiliateLinks`, `ExternalLink`.

## Testiranje
- `curl -X POST /api/itinerary/bookings -d '{"destinationIds":["bled","ljubljana"]}'` → vrne pravilno strukturirane podatke z Blejskimi hoteli.
- Prazna množica → `{}`.
- Neznan ID → prazni arrayi.
- `bun run lint` → 0 errors, 0 warnings.
- Dev server kompilira brez napak.

## Datoteke
- Ustvarjene:
  - `src/app/api/itinerary/bookings/route.ts`
  - `src/components/sections/booking-panel.tsx`
- Posodobljene:
  - `src/components/sections/itinerary-planner.tsx`
  - `worklog.md` (append)

## Naslednji agenti — nasveti
- `BookingData` tip je definiran lokalno v `booking-panel.tsx` (client-friendly). Če boš dodajal booking logiko na več mestih, premisli prenos v `src/lib/types.ts`.
- API vrača maks 3 listings + 3 experiences + 3 products na destinacijo. Za večje intent "prikaži več" razmisli o dodatnem query parametru `limit`.
- Affiliate link generatorji v `src/lib/affiliate.ts` trenutno gledajo `process.env.NEXT_PUBLIC_*` z demo fallback IDji. V produkcijo obvezno setej prave affiliate IDje.
- Transport tab je trenutno "globalen" za prvo destinacijo dneva. Če bo itinerer večdestinacijski z logističnimi skoki, razširi z DiscoverCars za vsako destinacijo in meddestinacijske povezave.
