# Task 10-a — Admin dashboard + API-ji za CRUD listings in leads

**Agent:** full-stack-developer
**Task ID:** 10-a
**Date:** 2026-06-19

## Kontekst
- Prebral `worklog.md` — platforma "I Feel Slovenia" (Next.js 16 App Router, TypeScript, Tailwind 4, shadcn/ui, Prisma+SQLite) je v fazi B2B monetizacije. Prejšnji taski postavili: 12 destinacij, AI itinerer, Leaflet map, blog, koledar dogodkov, "Pridruži se" landing + leads capture (file-based `data/leads.json`), listings sistem (Prisma Listing model, 10 seedanih lokalov, javni API + UI, integracija v DestinationModal).
- Task 9 je dodal javni listings sistem. Zdaj gradim **admin ploščo** za upravljanje vseh lokalov (CRUD) + leads overview.
- Prebral ključne datoteke:
  - `src/lib/auth-guards.ts` — `checkAdmin(password)` primerja z `process.env.ADMIN_PASSWORD`
  - `src/lib/slovenia-data.ts` — 12 destinacij z id-ji (potrebno za select v formi)
  - `src/lib/listings-types.ts` — `ListingCategory`, `ListingPlan`, `CATEGORY_LABELS`, `PLAN_LABELS`
  - `prisma/schema.prisma` — Listing model (vsa polja)
  - `src/lib/db.ts` — Prisma client
  - `src/app/api/listings/route.ts` — obstoječi vzorec za parse JSON fields
  - `.env` — `ADMIN_PASSWORD=ifeelslovenia2025` že nastavljeno
  - `data/leads.json` — bil prazen `[]` na začetku
- shadcn/ui komponente na voljo: dialog, alert-dialog, table, tabs, card, button, input, textarea, label, select, switch, badge, skeleton
- Zahteve: SLOVENŠČINA v UI, NO indigo/blue (primary zelena, accent terakota, muted, amber za premium), mobile-first responsive, lint čist (0 errors)

## Ustvarjene datoteke

### 1. `src/app/api/admin/verify/route.ts` (~37 vrstic)
POST handler za preverjanje admin gesla.
- Prebere `{ password }` iz JSON telesa
- Pokliče `checkAdmin(password)` iz `@/lib/auth-guards`
- Vrne `{ success: true }` če pravilno, `{ error: "Napačno geslo" }` z 401 če napačno
- Try/catch okoli vsega, generično sporočilo ob napaki

### 2. `src/app/api/admin/listings/route.ts` (~210 vrstic)
Admin API za lokale — GET (all) + POST (create).
- **Auth**: preveri `x-admin-password` header vsak klic
- **`slugify(input)`**: `input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")` — odstrani tudi slovenske diakritične znake (č, š, ž → c, s, z)
- **`ensureUniqueSlug(base, excludeId?)`**: append -2, -3, ... dokler ni unikaten. Uporablja `for (;;)` (ne `while (true)` da se izogne eslint warningom)
- **`parseList(input)`**: split po novi vrstici ali vejici, trim, filter empty
- **GET**: `db.listing.findMany({ orderBy: { createdAt: "desc" } })`, parse JSON `images` in `specialties` v array, vrne `{ listings, total }`
- **POST**: striktna validacija (name, description, address obvezna), avto-generira slug iz imena če manjka (z unique check), parse images/specialties text v JSON string, clamp rating na 0-5, floor reviewCount, ustvari listing z `db.listing.create`, vrne 201 z `{ listing, success }`

### 3. `src/app/api/admin/listings/[id]/route.ts` (~270 vrstic)
Admin API za posamezni lokal — GET / PUT / DELETE.
- Vse 3 metode preverijo admin geslo
- **GET**: `findUnique({ where: { id } })`, 404 če ne obstaja, parse JSON polja
- **PUT**: validira (name/description/address obvezna), pridobi `existing` če lokal obstaja (404 če ne), posodobi slug (re-generira se iz imena z unique check izključujoč trenutni id), `db.listing.update`, vrne `{ listing, success }`
- **DELETE**: `findUnique` za 404 check + prikaz imena v success message, `db.listing.delete`, vrne `{ success, message: "Lokal \"X\" izbrisan" }`

### 4. `src/app/api/admin/leads/route.ts` (~140 vrstic)
Admin API za leade — GET (all) + PUT (status update).
- **Tip `LeadStatus`** exportan: `"nov" | "kontaktiran" | "zakljucen"`
- **Lead interface** razširjen z `status?: LeadStatus` (optional za stare leadove)
- **`VALID_STATUSES`** array za validacijo
- **`readLeads()` / `writeLeads()`**: file-based storage v `data/leads.json` (enak vzorec kot obstoječ `/api/leads/route.ts`)
- **GET**: prebere vse leade, **normalizira status** za stare leadove (default `"nov"` če manjka ali neveljaven), vrne `{ leads, total }`
- **PUT**: prebere `{ id, status }` iz telesa, validira da je status eden od 3 veljavnih, najde lead po id (404 če ne najde), posodobi status, `writeLeads` nazaj v datoteko, vrne `{ success, lead, message }`

### 5. `src/components/admin/listing-form.tsx` (~600 vrstic, "use client")
Dialog forma za create/edit lokal-a. Props: `open`, `onOpenChange`, `listing?: AdminListing | null`, `adminPassword`, `onSaved?`.
- **`AdminListing` interface** exportan — razširjen Listing z vsemi DB polji (id, createdAt, updatedAt, viewCount, clickCount, ownerEmail)
- **State**: 17 form polj + loading + errorMsg + slugEdited flag
- **`useEffect`**: ko se dialog odpre, resetira/polni polja iz `listing` (edit mode) ali prazna (create mode)
- **Auto-slug**: ko uporabnik tipka v ime, se slug avto-generira (če `slugEdited === false`). Ko uporabnik direktno uredi slug, se nastavi `slugEdited = true` in uporabi njegov vnos
- **Submit**: validira (name/description/address obvezna), najde destinacijo iz DESTINATIONS za destinationName, zgradi payload (images in specialties kot text, ki jih API parsá), POST/PUT na `/api/admin/listings` ali `/api/admin/listings/{id}`, pošlje `x-admin-password` header, handle-a napake iz API-ja
- **Form layout** (grid sm:grid-cols-2 + sm:grid-cols-3):
  - Osnovni: Ime, Slug, Kategorija (Select 7 vrednosti), Destinacija (Select 12 destinacij iz DESTINATIONS)
  - Opisi: Kratek opis (Input), Dolgi opis (Textarea)
  - Kontakt: Naslov, Telefon, E-pošta, Spletna stran
  - Vsebina: Slike (Textarea, en URL na vrstico), Specialitete (Input, comma-separated)
  - Paket: Paket (Select free/premium/enterprise), Cena (Select €/€€/€€€), Odpiralni čas
  - Switches: Izpostavljeno (Switch), Overjeno (Switch) — vsak v svojem border okvirčku
  - Statistika: Ocena (number 0-5), Število mnenj (number)
- **Footer**: Prekliči (outline, X ikona) + Shrani (primary, Save ikona, Loader2 pri loading)
- **Error prikaz**: rdeči alert box z AlertCircle ikono nad formo
- Dialog: `max-w-3xl w-[95vw] max-h-[92vh] overflow-y-auto scroll-area-custom`

### 6. `src/components/admin/admin-dashboard.tsx` (~990 vrstic, "use client")
Glavna admin komponenta. Props: `adminPassword`, `onLogout`.
- **Header** (sticky): zelen kvadratek s ShieldCheck ikono + "Admin plošča" naslov + "I Feel Slovenia — upravljanje lokalov" podnaslov + Odjava gumb (outline, desno)
- **Tabs** (grid grid-cols-3 max-w-md): Lokali (Building2) | Leadi (Users) | Statistika (TrendingUp)
- **ListingsTab**:
  - Toolbar: naslov "Lokali" + podnaslov, search input (levo, Search ikona, sm:w-64) + "Nov lokal" gumb (primary, Plus ikona, desno)
  - Tabela (shadcn Table) z responsive stolpci (hidden md:table-cell, hidden lg:table-cell):
    - Ime (vedno) + slug pod imenom
    - Kategorija (Badge secondary, hidden md)
    - Destinacija (hidden lg, text-muted-foreground)
    - Paket (PlanBadge — enterprise=zelena Crown, premium=amber Sparkles, free=secondary)
    - Status (hidden sm): Izpostavljeno (amber badge z Star) in/ali Overjeno (emerald badge z Check)
    - Ocena (hidden md): zvezdica + rating + (reviewCount)
    - Ogledi (hidden lg): Eye ikona + viewCount
    - Akcije: Uredi (ghost, Pencil) + Izbriši (ghost destructive, Trash2)
  - Loading state, empty state (Building2 ikona), error state (AlertCircle)
  - Footer counter: "Skupno: X od Y lokalov"
  - AlertDialog za potrditev brisanja (destrukiven button z bg-destructive)
  - ListingForm dialog za create/edit
  - Fetch z `useCallback` + `useEffect`, optimistic delete (filter iz state)
- **LeadsTab**:
  - Toolbar: naslov + "Izvozi CSV" gumb (outline, Download ikona, disabled ko 0 leadov)
  - Tabela z responsive stolpci:
    - Datum (hidden md, slo format dd.MM.yyyy)
    - Ime (vedno) + businessName pod (mobile)
    - Kontakt (hidden sm, email + phone stack)
    - Lokal (hidden lg) + businessType (mobile fallback)
    - Tip (hidden xl)
    - Kraj (hidden lg)
    - Paket (PlanBadge, hidden md)
    - Status (vedno, klikabilen gumb s color-coded ozadjem: nov=amber, kontaktiran=primary, zaključen=emerald)
  - **Status toggle**: klik cikla nov → kontaktiran → zakljucen → nov. Optimistic update z revert ob napaki. Pošlje PUT na `/api/admin/leads` z `{ id, status }`
  - **CSV export**: zgradi CSV z BOM (za Excel UTF-8), 10 stolpcev (Datum, Ime, Email, Telefon, Lokal, Tip, Kraj, Paket, Status, Sporočilo). Uporabi `Blob` + `URL.createObjectURL` + `<a download>` za prenos. File: `leads-YYYY-MM-DD.csv`
- **StatsTab**:
  - 4 KPI kartice (grid 2x2 / lg 4): Skupno lokalov (Building2, primary), Premium/Enterprise (Crown, amber), Skupno leadov (Users, accent), Skupno ogledov (Eye, emerald). Vsaka: label, velik bold tabular-nums, ikona v barvitem krogu
  - 2 kartici side-by-side (lg:grid-cols-2):
    - **Top 5 lokalov po ogledih**: ol z ranking (1=zlati krog, 2=siv, 3=terakota, 4+=muted), ime + destinacija/kategorija, Eye + viewCount desno
    - **Lokali po kategorijah**: simple bar chart z div-i. Vsaka kategorija: label + count (text), h-2 progress bar z `width: (count/maxCat)*100%` in bg-primary
  - `useMemo` za byCategory (POMEMBNO: postavljen pred `if (loading)` return da se izogne rules-of-hooks lint errorju)
  - Parallel `Promise.all` za fetch listings + leads
- **Pomožne komponente**:
  - `PlanBadge({ plan })`: enterprise = primary badge z Crown, premium = amber outline z Sparkles, free = secondary muted
  - `KpiCard({ icon, label, value, color })`: Card z label, velika številka, ikona v barvnem krogu (color: primary/amber/accent/emerald)
- **Tip Lead**: definiran lokalno v komponenti (id, timestamp, name, email, phone, businessName, businessType, location, plan, message, gdprConsent, status)
- **Status konstante**: `STATUS_LABELS` (Nov/Kontaktiran/Zaključen), `STATUS_NEXT` (cycle), `STATUS_STYLES` (color classes za toggle button)

### 7. `src/app/admin/page.tsx` (~155 vrstic, "use client")
Login gate + dashboard renderer.
- **Hydration-safe**: `mounted` state preprečuje hydration mismatch (localStorage ni na voljo v SSR). Pred mount-om prikaže Loader2 spinner na sredini
- **State**: `password: string | null` — null = neprijavljen, string = prijavljen (z geslom)
- **`useEffect`** ob mountu: prebere `admin_token` iz localStorage (try/catch za robustnost)
- **`handleLogout`**: removeItem iz localStorage + setPassword(null)
- **LoginForm** komponenta (notranja):
  - Card max-w-sm, centriran na min-h-screen z bg-muted/30
  - Header: velik zelen kvadratek s ShieldCheck ikono, "Admin prijava" naslov, podnaslov
  - Input: Label "Admin geslo" + Lock ikona v inputu, type=password, autoFocus, autoComplete="current-password"
  - Error prikaz: AlertCircle + rdeči border box
  - Submit: POST na `/api/admin/verify` z `{ password }`. Če 200: `onLogin(password)` (parent shrani v localStorage). Če 401: prikaže error iz API-ja
  - Footer: Prijava gumb (full-width, Loader2 pri loading) + link "kliknite tukaj" za povratek na `/`
- Ko je prijavljen: rendera `<AdminDashboard adminPassword={password} onLogout={handleLogout} />`

## Testiranje (curl)
- ✅ POST `/api/admin/verify` s pravilnim geslom → `{success: true}`
- ✅ POST `/api/admin/verify` z napačnim geslom → 401 `{error: "Napačno geslo"}`
- ✅ GET `/api/admin/listings` brez auth → 401 `{error: "Neavtoriziran dostop"}`
- ✅ GET `/api/admin/listings` z auth → 10 lokalov z parsed JSON polji
- ✅ POST `/api/admin/listings` (create) → 201 z avto-generiranim slugom `test-admin-lokal` in parsed images/specialties
- ✅ PUT `/api/admin/listings/{id}` (update) → 200 z re-generiranim slugom `test-admin-lokal-posodobljen` in novimi vrednostmi (plan=premium, featured=true, verified=true, rating=4.5)
- ✅ DELETE `/api/admin/listings/{id}` → 200 `{success: true, message: "Lokal \"Test Admin Lokal POSODOBLJEN\" izbrisan"}`
- ✅ GET `/api/admin/listings/{id}` po delete → 404 `{error: "Lokal ni najden"}`
- ✅ GET `/api/admin/leads` z auth → 2 testa lead-a z normaliziranim statusom "nov" za stare leadove
- ✅ PUT `/api/admin/leads` z invalid status → 400 `{error: "Neveljaven status"}`
- ✅ PUT `/api/admin/leads` z neobstoječim id → 404 `{error: "Lead ni najden"}`
- ✅ PUT `/api/admin/leads` brez auth → 401 `{error: "Neavtoriziran dostop"}`
- ✅ PUT `/api/admin/leads` z `{id: "lead_test_1", status: "kontaktiran"}` → 200 s posodobljenim lead-om, status persisten v data/leads.json
- Po testih resetiral `data/leads.json` nazaj na `[]`

## Lint
- `bun run lint` → **0 errorjev, 0 opozoril** v mojih datotekah (1 preostali warning je v `src/components/owner/listing-form.tsx:505` — ne moja koda, že obstajajoča)
- Popravki med razvojem:
  - Prenesel `React.useMemo` za byCategory PRED `if (loading)` early return v StatsTab (react-hooks/rules-of-hooks error)
  - Zamenjal `// eslint-disable-next-line no-constant-condition` + `while (true)` z `for (;;)` v obeh listings route-ih (unused eslint-disable warnings)

## Tehnične odločitve
- **Auth pattern**: klient pošlje admin geslo v `x-admin-password` header. V API-ju se kliče `checkAdmin()` iz obstoječega `auth-guards.ts`. Geslo je v `localStorage` pod ključem `admin_token` (simple, ker admin geslo je eno samo — kot je zahtevano v specifikaciji)
- **Slug**: `slugify()` najprej normalizira z NFD in odstrani diakritiko (č/š/ž → c/s/z), potem regex. `ensureUniqueSlug()` append-a `-2`, `-3`, ... dokler ni unikaten (uporablja `for (;;)` namesto `while (true)` zaradi lint)
- **JSON fields**: API sprejema `images` in `specialties` kot text (split po newline/vejici) iz forme, parsá v array, nato shraní kot JSON string v bazo. Na GET jih parsá nazaj v array
- **Leads storage**: file-based `data/leads.json` (skladno z "no-database" politiko za leads iz Task 6-c). `readLeads/writeLeads` funkciji v novi admin route sta neodvisni od obstoječe `/api/leads/route.ts` (ker ne moremo deliti kode med route-i brez dodatnega utility file-a — za simplifikacijo sem ju dupliciral znotraj admin route-a)
- **Status normalization**: stari leadovi (ki nimajo `status` polja) se normalizirajo na `"nov"` ob GET-u. Tako so backend spremembe neinvazivne na obstoječe podatke
- **Mobile responsive**: tabele imajo `hidden sm:table-cell`, `hidden md:table-cell`, `hidden lg:table-cell`, `hidden xl:table-cell` za progresivno razkritje stolpcev na večjih ekranih. Mobile fallback: npr. v LeadsTab se businessName prikaže pod imenom na mobilcu (`md:hidden`), ker stolpec "Lokal" je `hidden lg:table-cell`
- **Color palette**: NO indigo/blue — primary (zelena) za enterprise, amber za premium/nov status, emerald za overjeno/zaključen status, accent (terakota) za leads KPI. Vse skladno z obstoječo slovensko temo
- **TypeScript strict**: vse API odgovore striktno tipiziram z `unknown` + type guard pattern (npr. `typeof data === "object" && data !== null && "error" in data`). Import tipov iz `@/lib/listings-types`
- **Hydration safety**: admin page preveri `mounted` flag pred dostopom do localStorage (preprečuje hydration mismatch v Next.js 16)
