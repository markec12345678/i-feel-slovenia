# Task 30-a — Razširitev baze podatkov (+15 listings, +20 products, +20 experiences, +12 events, +10 blog)

Agent: full-stack-developer
Datum: 2025

## Kontekst
Prejšnji taski (1-29) so vzpostavili platformo I Feel Slovenia (Next.js 16, App Router, TypeScript, Tailwind 4, shadcn/ui, Prisma+SQLite). 22 slovenskih destinacij v `src/lib/slovenia-data.ts`. Prisma modeli `Listing`, `Experience`, `Product` z `destinationId` string povezavo na destinacije. Statni podatki:
- Listings: 10 (seed-listings.ts)
- Products: 8 (seed-marketplace.ts)
- Experiences: 8 (seed-marketplace.ts)
- Events: 18 (events-data.ts)
- Blog posts: 6 (blog-data.ts)

Task 30-a: razširiti bazo na 25 listings + 28 products + 28 experiences + 30 events + 16 blog posts.

## Rešitev

### 1. Nova seed skripta — `prisma/seed-expand.ts`
- 15 novih listings — pokrivajo vse 9 regij (Gorenjska, Primorska, Osrednja, Kras, Štajerska, Koroška, Prekmurje, Dolenjska, Bela krajina), mix kategorij (hotel/restaurant/bar/shop), realna slovenska imena (Hotel Triglav Bled, Hiša Franko, Hotel Otočec, Vinska klet Cviček, Belokranjska hiša, Prekmurska kmetija, itd.), mix plan/featured/verified, Unsplash slike.
- 20 novih products — kategorije: food(5)/wine(4)/honey(3)/oil(3)/craft(3)/souvenir(2). Realna imena: Idrijski žlikrofi, Ajdovi žganci, Tolminski sir, Orehova potica, Krškopoljski prašič, Modra frankinja, Renski rizling, Rumeni muškat, Cviček, Ajdov med, Gozdni med, Akacijev med, Laneno olje, Bučno olje ekstra, Oljčno olje Koper, Keramika Slovenj Gradec, Vezena miza, Leseni izdelki, Magnet Slovenija, Lipov list. Cene €5-49, nekateri compareAtPrice.
- 20 novih experiences — kategorije: tour(4)/workshop(3)/tasting(4)/outdoor(4)/cultural(2)/adventure(2)/wellness(1). Cene €18-120, trajanja 1.5-8h, mix familyFriendly/accessibility.
- **Idempotentna**: preveri po `slug` pre vsakega inserta (findUnique). Če slug obstaja, ga preskoči. Na koncu `updateMany` sponsored=true za premium/enterprise listings.

### 2. Posodobljen `src/lib/events-data.ts`
- Dodanih 12 novih dogodkov (skupaj 30):
  - **jan**: Blejski zimski plavalni memorial, Zlati lisjak Maribor
  - **mar**: Vinska vigred Maribor
  - **apr**: Jurjevanje v Beli krajini
  - **maj**: Ljubljanski maraton
  - **jun**: Pivo in cvetje Laško, Festival solinarstva Sečovlje
  - **avg**: Trnfest Ljubljana, Okarina festival Bled
  - **okt**: Celjski sejem
  - **dec**: Bled Winter Magic, Jamski sejem Postojna
- Vsak mesec ima zdaj vsaj 2 dogodka. Vseh 9 regij zastopanih.

### 3. Posodobljen `src/lib/blog-data.ts`
- Dodanih 10 novih člankov (skupaj 16):
  - Vintgarska soteska vodnik (narava, related: vintgar)
  - Cviček in dolenjska kuhinja (kulinarika, related: novo-mesto)
  - Bohinj pozimi (narava, related: bohinj)
  - Kolesarjenje ob Dravi (avantura, related: maribor)
  - Kam na Pohorju (nasveti, related: maribor)
  - Slapovi Slovenije — 10 najlepših (narava)
  - Ljubljana v 48 urah (kultura, related: ljubljana)
  - Prekmurska gibanica — zgodovina in recept (kulinarika, related: murska-sobota)
  - Vinogradi Štajerske — turizem (kulinarika, related: ptuj)
  - Triglavski narodni park vodnik (narava, related: triglav)
- Vsak članek: 4-9 odstavkov markdown vsebine, datumi razporejeni apr-nov 2025.

### 4. Seed poganjanje
- `bunx tsx prisma/seed-expand.ts`:
  - Vseh 55 novih recordov (15 listings + 20 products + 20 experiences) uspešno insertanih
  - Drugi zagon potrdi: vsi preskočeni kot "Skip (exists)" — duplikatov ni
  - Sponsored update: 18 premium/enterprise listings označenih kot sponsored (sponsoredUntil: 2026-12-31)

### 5. Verifikacija
- `bun run lint` → 0 errors, 0 warnings ✅
- `grep` count:
  - events-data.ts: 30 dogodkov ✅
  - blog-data.ts: 16 člankov ✅
- Database finalne številke: 26 listings, 28 products, 28 experiences, 18 sponsored listings

## Datoteke
- Ustvarjene:
  - `prisma/seed-expand.ts` (nova idempotentna seed skripta)
- Posodobljene:
  - `src/lib/events-data.ts` (+12 dogodkov = 30 skupaj)
  - `src/lib/blog-data.ts` (+10 člankov = 16 skupaj)
  - `worklog.md` (append Task 30-a)

## Testiranje
- `bunx tsx prisma/seed-expand.ts` — seed uspešen
- Drugi zagon iste skripte — vsi recordi preskočeni kot "exists" (idempotentnost potrjena)
- `bun run lint` — 0 errors
- Verifikacija števila recordov v source datotekah: 30 events ✓, 16 blog posts ✓

## Naslednji agenti — nasveti
- `prisma/seed-expand.ts` je idempotentna — lahko se večkrat požene varno.
- Vsi 15 novih listings imajo `destinationId` povezavo na obstoječe 22 destinacij. destinationId je string (ne FK), tako da ni DB-level constraint — preveri pravilnost ID-jev v kodi.
- Nekateri products imajo `compareAtPrice` — preveri da frontend rendera popust (npr. "€12.9 ~~€17.9~~ -27%") pravilno.
- Nove experiences imajo realistične `bookingCount` (89-4523) za prikaz popularnosti.
- Nove blog posts imajo vsi `relatedDestination` razen "Slapovi Slovenije" (splošni vodnik). Vsi related IDs obstajajo v `DESTINATIONS`.
- Events: vsi meseci imajo zdaj vsaj 2 dogodka — mesečni prikaz na events strani bo popoln.
- Vsa slovenska vsebina jezikovno pravilna (z diakritičnimi znamenji č, š, ž). Slugi so ASCII-only (č → c, š → s, ž → z) za URL-friendly.
- Za dodatno širitev: trenutno so vsi product sellerji edinstveni — za boljšo demonstracijo "trgovine enega prodajalca" lahko dodaš multiple products z istim sellerName.
