# Task 24-a — Owner dashboard razširitev: Izdelki in Izkušnje tabovi

**Agent:** full-stack-developer
**Datum:** 2026-06-19
**Predhodno:** Task 22-23 (redirect monetizacijski model, odstranitev cart/checkout)

## Povzetek

Razširil sem Owner dashboard (/owner/dashboard) z 2 novima tab-oma: "Izdelki" in "Izkušnje".
Lastniki (owners) lahko zdaj samostojno dodajajo, urejajo in brišejo svoje oglase v tržnico
izdelkov (products) in izkušenj (experiences) — pavšalni oglasni model, kjer plan deduce
iz owner.plan in featured/verified nastavlja samo admin.

## Delovni log

1. Prebral worklog.md (kontekst celotnega projekta "I Feel Slovenia" Next.js 16)
2. Prebral obstoječe datoteke:
   - `src/app/owner/dashboard/page.tsx` (1206 vrstic, 3 tabi: listings/narocnina/statistika)
   - `src/components/admin/listing-form.tsx` (vzorec forme)
   - `src/components/owner/listing-form.tsx` (vzorec owner forme z dialogom)
   - `src/lib/marketplace-types.ts` (Product, Experience, MarketplacePlan, formatPrice, formatDuration, LANGUAGE_LABELS)
   - `prisma/schema.prisma` (Product in Experience modela že obstajata z ownerId)
   - `src/app/api/owner/listings/route.ts` in `[id]/route.ts` (vzorec API-jev z zod + ownership)
3. Ustvaril 4 nove API routes (po vzoru listings, slovenski slugify č/š/ž → c/s/z, plan limiti z beta radodarnejšimi)
4. Ustvaril 2 novi form komponenti (Dialog z vsemi polji iz task specifikacije)
5. Posodobil Owner dashboard: TabsList iz 3 → 5 cols (responsive grid-cols-3 sm:grid-cols-5), dodal 2 nova TabsContent, ustvaril 6 novih komponent
6. Lint: 0 errorjev, 0 opozoril (exit 0)
7. Worklog appendan + ta agent-ctx zapisan

## Ustvarjene datoteke (7)

### 1. `src/app/api/owner/products/route.ts` (238 vrstic)
- **GET**: vrne vse products za trenutno prijavljenega ownerja (getServerSession + ownerId filter)
- **POST**: create new product
  - Zod validacija: name (min 2), category (enum 7 vrednosti), description (10–120 znakov), price (≥0), sellerName (min 2)
  - Auto-set: ownerId, plan=owner.plan, featured=false, verified=false, currency="EUR"
  - Auto-generira unique slug iz imena (č/š/ž → c/s/z, če obstaja → dodja -1, -2, ...)
  - Parsaj images array v JSON string pred shranjevanjem (SQLite ne podpira arrayjev)
  - Plan limiti:
    - Beta: free=3, premium=10, enterprise=∞
    - Non-beta: free=1, premium=5, enterprise=∞
  - 403 če dosežen limit (s slovenskim sporočilom o napaki)
- Razčleni JSON images polje nazaj v array v odgovoru

### 2. `src/app/api/owner/products/[id]/route.ts` (252 vrstic)
- `getOwnedProduct(id, ownerId)` helper — preveri lastništvo (404 not-found / 403 forbidden)
- **GET**: posamezni product (samo lastnik)
- **PUT**: update product (ownership preverba)
  - Vsa polja optional (zod .optional())
  - Auto-slug pri rename (z unikatnostjo — first findFirst NOT id)
  - Plan, featured, verified se NE posodabljajo
- **DELETE**: delete product (ownership preverba)

### 3. `src/app/api/owner/experiences/route.ts` (247 vrstic)
- **GET**: vrne vse experiences za ownerja
- **POST**: create new experience
  - Validacija: name, category (enum 7 vrednosti), description (10–120), pricePerPerson (≥0), durationHours (≥0.5), minGroupSize (≥1), maxGroupSize (≥1), address (min 3), providerName (min 2), languages (array)
  - Dodatna validacija: maxGroupSize >= minGroupSize
  - Auto-set: ownerId, plan, featured, verified, currency="EUR"
  - Auto-slug
  - Parsaj languages in images v JSON
  - Plan limiti: enaki kot products (free=3/1, premium=10/5, enterprise=∞ za beta/non-beta)

### 4. `src/app/api/owner/experiences/[id]/route.ts` (281 vrstic)
- `getOwnedExperience(id, ownerId)` helper
- GET/PUT/DELETE z ownership preverbo
- Pri PUT se preverja tudi maxGroupSize >= minGroupSize (tudi če se posodablja samo eno)
- Plan/featured/verified NE posodabljajo

### 5. `src/components/owner/product-form.tsx` (658 vrstic)
- "use client"
- `ProductFormDialog` (Dialog, ne Sheet)
- Props: `open: boolean`, `onOpenChange: (open) => void`, `product: Product | null`, `onSaved: () => void`
- Polja:
  - Ime (Input, required, min 2)
  - Kategorija (Select: food/wine/honey/oil/craft/souvenir/other)
  - Destinacija (Select iz DESTINATIONS)
  - Kratki opis (Input, required, min 10, max 120, števec znakov)
  - Dolgi opis (Textarea)
  - Cena (Input type=number, step 0.01, required)
  - Primerjalna cena (Input type=number, optional)
  - Zaloga (Input type=number, default "0")
  - Teža v gramih (Input type=number, optional)
  - Slike (Textarea — en URL na vrstico ali comma separated)
  - Atributi (Switch): Organic, Handmade, Local, Vegan
  - Dostava (Switch): Brezplačna dostava, Dostava EU, Dostava svet
  - Prodajalec: Ime (required), Email, Telefon, Spletna stran
- Save gumb → POST/PUT na /api/owner/products (ustvari) ali /api/owner/products/[id] (posodobi)
- Loading state (Loader2 spinner, disabled polja)
- Error prikaz (Alert variant="destructive")
- Toast feedback po uspehu
- Info banner: "Paket, izpostavljenost in overjenost nastavlja administracija"
- NE more nastaviti plan/featured/verified

### 6. `src/components/owner/experience-form.tsx` (692 vrstic)
- "use client"
- `ExperienceFormDialog`
- Props: `open`, `onOpenChange`, `experience: Experience | null`, `onSaved`
- Polja:
  - Ime (Input, required)
  - Kategorija (Select: tour/workshop/tasting/outdoor/cultural/adventure/wellness)
  - Destinacija (Select)
  - Kratki opis (required, max 120, števec)
  - Dolgi opis (Textarea)
  - Cena na osebo (Input type=number, step 0.01, required)
  - Trajanje v urah (Input type=number, step 0.5, min 0.5, required)
  - Min skupina (Input type=number, default "1")
  - Max skupina (Input type=number, default "10")
  - Jeziki (Textarea — "sl, en, de" format, comma separated, prikaz vseh podprtih kod v helper text)
  - Meeting point (Input)
  - Naslov (Input, required)
  - Slike (Textarea — URLs)
  - Atributi (Switch): Družinsko prijazno, Dostopno za invalide
  - Ponudnik: Ime (required), Email, Telefon, Spletna stran
- Validacija max>=min group
- Save → POST/PUT na /api/owner/experiences (ali /api/owner/experiences/[id])

### 7. `src/app/owner/dashboard/page.tsx` (1206 → 2349 vrstic, +1143)
- Novi lucide imports: Package, Ticket, Euro, Clock, Users, Languages
- Novi komponentni imports: ProductFormDialog, ExperienceFormDialog
- Novi type imports: Product, Experience, MarketplacePlan, PRODUCT/EXPERIENCE_CATEGORY_LABELS/ICONS, LANGUAGE_LABELS, formatPrice, formatDuration
- Nove konstante: PRODUCT_PLAN_LIMITS_{NORMAL,BETA}, EXPERIENCE_PLAN_LIMITS_{NORMAL,BETA}
- TabsList: `grid-cols-3` → `grid-cols-3 sm:grid-cols-5` (responsive: mobilno 3, desktop 5)
- Novi tab triggers:
  - `products` (Package ikona, "Izdelki")
  - `experiences` (Ticket ikona, "Izkušnje")
- Novi TabsContent: products → `<ProductsTab plan={plan} isBetaActive={isBetaActive} />`, experiences → `<ExperiencesTab ... />`
- Nove komponente:
  - `ProductsTab` (self-contained): fetch, grid kartic, add/edit/delete gumbi, beta badge, plan limit info, empty state, ProductFormDialog, AlertDialog za brisanje
  - `ExperiencesTab` (self-contained, ista struktura)
  - `ProductCard`: slika (aspect-square), category badge, featured/verified badges, ime, destinacija, opis, atributi badges (Ekološko/Ročno/Lokalno/Vegansko), cena+zaloga stats, Uredi/Izbriši gumbi
  - `ExperienceCard`: slika (aspect-video), category badge, ime, destinacija, opis, trajanje+skupina stats, jeziki (3 + N), cena na osebo (poudarjena v primary barvi), Uredi/Izbriši
  - `ProductsEmptyState`, `ExperiencesEmptyState` (border-dashed, primary ikona, "Dodaj svoj prvi ..." CTA)

## Tehnične odločitve

1. **Dialog namesto Sheet** — sledil sem obstoječemu vzorcu ListingFormDialog (Dialog), da je UI konsistenten
2. **Self-contained tab komponente** — ProductsTab in ExperiencesTab vsebujejo svoj fetch, state, dialog in AlertDialog. To minimizira spremembe v glavnem OwnerDashboardPage componentu
3. **Type casts za plan** — MarketplacePlan in ListingPlan sta strukturno identična ("free"|"premium"|"enterprise"), zato `plan as MarketplacePlan` in `plan as ListingPlan` casts delujejo čisto (TypeScript structural typing)
4. **Auto-slug** — slovenski slugify (č→c, š→s, ž→z, đ→d) z unique check (če obstaja, doda -1, -2, ...). Pri PUT se slug posodobi samodejno če se ime spremeni
5. **JSON polja za SQLite** — images in languages se serializirajo z JSON.stringify pred shranjevanjem in JSON.parse pri branju
6. **Owner NE more nastaviti plan/featured/verified** — POST auto-seta plan=owner.plan, featured=false, verified=false; PUT izpusti ta polja v update. Info banner v formah tega opozori
7. **Plan limiti** — beta radodarnejši (free=3, premium=10) kot non-beta (free=1, premium=5); enterprise=∞ vedno. Limit preverjen prek `_count: { select: { products: true } }` v Prisma
8. **Slovenščina + barve** — vsi teksti v slovenščini; barve: primary (zelena), amber (beta/premium), destructive (napake/brisanje); NO indigo/blue

## Lint status
- `bun run lint` → exit 0, 0 errorjev, 0 opozoril
- Dev log: uspešna kompilacija (Compiled in 199ms po spremembah), 0 runtime errorjev

## Stage Summary
- ✅ 4 novi API routes (products in experiences, GET/POST + GET/PUT/DELETE z ownership preverbo)
- ✅ 2 novi form komponenti (ProductFormDialog, ExperienceFormDialog z vsemi polji iz spec)
- ✅ Owner dashboard razširjen z 2 novima tab-oma (Izdelki, Izkušnje)
- ✅ CRUD popolnoma funkcionalen (dodaj/uredi/izbriši)
- ✅ Plan limiti pravilno implementirani (beta + non-beta)
- ✅ Owner NE more nastaviti plan/featured/verified
- ✅ Auto-slug z unikatnostjo
- ✅ JSON polja pravilno serializirana za SQLite
- ✅ Mobile-first responsive (grid-cols-3 → sm:grid-cols-5 za tabe)
- ✅ Lint čist (0 errorjev)
- ✅ Slovenščina v UI, NO indigo/blue
- ✅ Worklog.md appendan + ta agent-ctx zapisan
