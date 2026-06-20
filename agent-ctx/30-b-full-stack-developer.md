# Task 30-b — Zbirke (Collections) + AI priporočila

Agent: full-stack-developer
Task ID: 30-b

## Povzetek

Dodan sistem kuriranih zbirk (8 zbirk: zimski/poletni paketi, romantično, družinsko, kulinariika, avantura, eko, luxury) in AI priporočila "Morda vam je všeč" v product/experience modal-a.

## Ustvarjene datoteke

- `src/lib/collections.ts` — Collection interface, CollectionFilters interface, COLLECTIONS array (8 zbirk), helper `getCollectionBySlug`, izvoženi `PRODUCT_CATEGORY_VALUES` / `EXPERIENCE_CATEGORY_VALUES`. Razširjen spec z opcijskim `productCategories` poljem za eksplicitne kategorije izdelkov (npr. gourmet zajema wine/food/honey/oil).
- `src/app/api/collections/[slug]/route.ts` — GET handler, ki aplikacija filtre tipno (categories → experiences, productCategories → products, attributes → ustrezna polja, destinationIds → IN list, priceMin/priceMax → products.price / experiences.pricePerPerson). Vrne `{ collection, products, experiences, total }`. Če noben filter ne velja za določen model, vrne prazen seznam (ne vseh vrstic).
- `src/app/api/recommendations/products/route.ts` — GET `?productId=XXX&limit=4`. Pridobi trenutni product, poišče podobne (ista kategorija ALI ista destinacija), izključi trenutni, sortira po featured/rating/reviewCount.
- `src/app/api/recommendations/experiences/route.ts` — Enak vzorec za experiences.
- `src/components/sections/collections.tsx` — "use client" sekcija `id="zbirke"`. Grid 1/2/4 kolone. Kartice z emoji ikono, naslovom, opisom in "Razišči" CTA. Klik odpre CollectionModal. Hover animacija (lift + border accent).
- `src/components/sections/collection-modal.tsx` — "use client" Dialog. Glava z ikono/naslovom/števci. Scroll area z dvema sekcijama (Izdelki, Izkušnje) v grid 2/3/4 kolone mini kartic. Skeleton loading, error state (z retry), empty state. Klik na mini kartico odre podroben ProductModal/ExperienceModal (stacked na vrhu). Footer z "Zapri" gumbom.

## Posodobljene datoteke

- `src/components/sections/product-modal.tsx` — Dodan `onSelect?` prop. Na dnu modala (med CTA in source note) dodana "Morda vam je všeč" sekcija z 4 mini karticami. Fetch iz `/api/recommendations/products`. Skeleton loading, tiho ignorira napake (priporočila so nice-to-have), skrij sekcijo če ni rezultatov. Klik na kartico zamenja trenutni product (preko onSelect).
- `src/components/sections/experience-modal.tsx` — Enaka posodobitev za experiences. Fetch iz `/api/recommendations/experiences`.
- `src/components/sections/marketplace.tsx` — ProductModal in ExperienceModal zdaj prejmeta `onSelect={setSelectedProduct}` / `onSelect={setSelectedExperience}`, tako da "Morda vam je všeč" kartice zamenjajo aktivni item v modalu.
- `src/app/page.tsx` — `<CollectionsSection />` dodan med `<StatsSection />` in `<DestinationsSection />`.

## Testiranje (živo, port 3000)

- `GET /api/collections/zimski-paketi` → 4 items (3 products + 1 experience)
- `GET /api/collections/kulinarika` → 10 items (7 products + 3 experiences) — productCategories wine/food/honey/oil deluje
- `GET /api/collections/eko` → 2 products (organic/handmade/local)
- `GET /api/collections/luxury` → 2 experiences (price >= 100 EUR)
- `GET /api/collections/druzinski` → 2 experiences (familyFriendly=true) — products pravilno prazni (ni produktnega familyFriendly atributa)
- `GET /api/collections/romanticni-pobegi` → 3 items
- `GET /api/collections/avantura` → 2 experiences (adventure/outdoor)
- `GET /api/collections/poletni-paketi` → 3 items
- `GET /api/collections/nonexistent` → 404
- `GET /api/recommendations/products?productId=...&limit=4` → deluje (0 podobnih za enolične izdelke, več za skupne kategorije/destinacije)
- `GET /api/recommendations/experiences?experienceId=...&limit=4` → deluje (testirano z tasting → vrne 1 podobno)
- Homepage `/` → 200 OK, lint čist

## Tehnične odločitve

1. **Tipna aplikacija filtrov**: categories filter se aplikira OR na obe tabeli (presek z veljavnimi kategorijami za vsak model). To omogoča, da "gourmet" z `categories: [tasting, workshop]` + `productCategories: [wine, food, honey, oil]` zajame ustrezne izkušnje IN izdelke.
2. **Prazni filter = prazen rezultat**: če noben filter ne velja za določen model (npr. family atribut za products), vrni [] namesto vseh vrstic. Preprečuje napačne rezultate.
3. **Stable stacked modals**: CollectionModal na vrhu prikaže ProductModal/ExperienceModal preko Radix Dialog portalov. Dve plasti modala delujeta brez konfliktov.
4. **Tihe napake za priporočila**: priporočila so "nice to have" — če fetch faila, se sekcijska skrije namesto prikaza napake uporabniku.
5. **Color semantične izjeme**: collection barve (cyan, amber, rose, green, purple, orange, emerald, yellow) so dovoljene kot okrasne badge barve — niso indigo/blue in niso del primarne palete.
