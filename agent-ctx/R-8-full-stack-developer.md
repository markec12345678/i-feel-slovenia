# Task R-8 — B2B portali (admin + owner prijava + owner dashboard)

Agent: full-stack-developer
Task ID: R-8

## Povzetek

Rekonstruirani B2B portali za projekt "I Feel Slovenia" (Next.js 16). Ustvarjene/posodobljene 3 glavne page.tsx datoteke skupaj z environsko konfiguracijo za admin geslo. Vse datoteke so "use client" in self-contained.

## Ustvarjene / posodobljene datoteke

### 1. `src/app/admin/page.tsx` (admin portal — celovita rebuild)

Samodejena "use client" komponenta z:

- **Login forma**: password input → POST /api/admin/verify → ob uspehu shrani geslo kot token v `localStorage` (key `admin_token`). SSR-safe z `mounted` guard (prepreči hydration mismatch).
- **AdminDashboard** po prijavi z **3 tabi**:
  - **Lokali** — tabela iz `/api/listings?limit=100` z iskanjem (ime, kraj, kategorija, naslov), "Nov lokal" gumb, edit/delete preko `/api/admin/listings` (POST/PUT/DELETE z `x-admin-password` headerjem). Inline `ListingFormDialog` z vsemi polji (ime, kategorija, destinacija, paket, opis, naslov, kontakt, website, odpiralni čas, cena, lastnik email, featured/verified stikali). Sortable po featured/rating. AlertDialog za potrditev brisanja.
  - **Leadi** — summary kartice (skupno / novi / kontaktirani / zaključeni) iz `/api/leads` (count + latest) + `/api/admin/leads` (full list). Tabela vseh leadov z iskanjem in filtrom po statusu. Klik na status badge cikla nov → kontaktiran → zaključen → nov (optimistic update + PUT `/api/admin/leads` z `x-admin-password` headerjem).
  - **Statistika** — KPI kartice (skupno listings, premium, enterprise, leads) + sekundarne metrike (ogledi, kliki, recenzije) + Top 5 lokalov po ogledih + horizontalni bar chart po kategorijah (prilagojen širini, custom Tailwind, brez chart knjižnice).

Pomembno: V `ListingFormDialog` sem inline implementiral (admin različica, ki omogoča nastavitev plan/featured/verified — za razliko od owner različice). Uporabljen Switch iz shadcn/ui za featured/verified stikali.

### 2. `src/app/owner/prijava/page.tsx` (lastniški portal — prijava)

Obstoječa datoteka JE ŽE USKLADENA s spec in ni bila potrebna rebuild:
- "use client" ✓
- 2 tabi (Prijava / Registracija) ✓
- NextAuth `signIn("credentials", { ... })` z `redirect: false` ✓
- Validacija: email regex, min 8 znakov gesla, GDPR privolitev obvezna ✓
- Auto-login po uspešni registraciji: po `/api/owner/register` 200 → `signIn("credentials", ...)` → redirect `/owner/dashboard` ✓
- bcrypt se uporablja server-side v `/api/owner/register` (hash z 10 rundami) ✓
- Eye/EyeOff toggle za prikaz gesla ✓
- GDPR checkbox obvezno ✓
- Toast notifications za uspeh/napako ✓

### 3. `src/app/owner/dashboard/page.tsx` (lastniški dashboard — celovita rebuild)

Samodejna "use client" komponenta z:

- **Session check**: `useSession()` — če `unauthenticated` → `router.push("/owner/prijava")`. Loading state med `status === "loading"`.
- **Header**: logotip + businessName/name + PlanBadge + Odjava button (signOut z callbackUrl).
- **BetaBanner** na vrhu (komponenta iz `@/components/beta-banner`).
- **5 tabov**:
  1. **Moji lokalci** — grid kartic iz `/api/owner/listings` (CRUD). "Dodaj lokal" gumb (disabled pri doseženem limitu). Plan limit info: Progress bar + alert opozorilo. Beta info badge z razširjenimi limiti. Prazna EmptyState ko ni lokalov. ListingCard s sliko/kategorijo/badges/ogledi/kliki/uredi/izbriši. ListingFormDialog iz `@/components/owner/listing-form` (POST/PUT na `/api/owner/listings`). AlertDialog za brisanje (DELETE `/api/owner/listings/[id]`).
  2. **Izdelki** — `EmptyPlaceholder` komponenta z naslovom "Nimate izdelkov" in opisom "Modul za izdelke je v pripravi..." + badge "V pripravi". Brez API klicev (po spec).
  3. **Izkušnje** — `EmptyPlaceholder` z naslovom "Nimate izkušenj" in opisom o pripravi modula. Brez API klicev (po spec).
  4. **Naročnina** — prikaz trenutnega paketa (badge + ime + cena + število lokalov + beta countdown). Grid 3 paketov (free / premium / enterprise) z lastnostmi, ceno, in "Nadgradi" gumbi (demo — prikaz samo toast obvestila). Beta alert z obrazložitvijo.
  5. **Statistika** — KPI kartice (views, clicks, leads, konverzija %). Top 3 lokalci po ogledih. Aktivnost leadov kartica z zadnjim leadom. Konverzijski Alert. Kontakt kartica za pomoč.
- Plan limit info: `PLAN_LIMITS_NORMAL` (free:1, premium:5, enterprise:∞) in `PLAN_LIMITS_BETA` (free:3, premium:8, enterprise:∞). Preklopi glede na `betaStatus.isActive` iz `/api/beta-status`.

### 4. `.env` (posodobljen)

Dodana vrstica `ADMIN_PASSWORD=ifeelslovenia2025` (po spec). Prej je bila samo `DATABASE_URL`. Next.js je samodejno zaznal spremembo in reloadal env (`Reload env: .env` v dev.log).

## Kontekst (uporabljen iz predhodnih del)

- `src/lib/auth.ts` — NextAuth credentials provider z bcrypt compare, JWT session, plan sync iz baze
- `src/lib/db.ts` — Prisma client
- `src/lib/beta.ts` — `BETA_THRESHOLD=30`, `getBetaStatus()`, `BETA_INFO`
- `src/lib/auth-guards.ts` — `checkAdmin(password)` primerja z `process.env.ADMIN_PASSWORD`
- `src/lib/listings-types.ts` — tipi `Listing`, `ListingCategory`, `ListingPlan`, `CATEGORY_LABELS`, `CATEGORY_ICONS`, `PLAN_LABELS`
- `src/lib/slovenia-data.ts` — `DESTINATIONS` za Select dropdown
- `src/components/owner/listing-form.tsx` — `ListingFormDialog` za owner (uporabljen v dashboard)
- `src/components/beta-banner.tsx` — BetaBanner komponenta
- API routes (uporabljeni):
  - `POST /api/admin/verify` — preveri admin geslo
  - `GET /api/listings?limit=100` — javni endpoint za vse lokale
  - `GET/POST /api/admin/listings` — admin CRUD z `x-admin-password` headerjem
  - `GET/PUT/DELETE /api/admin/listings/[id]` — admin CRUD za posamezni lokal
  - `GET /api/leads` — count + latest (javni)
  - `GET/PUT /api/admin/leads` — full leads + status update z `x-admin-password` headerjem
  - `GET /api/owner/listings` — lastnikovi lokalci (session-based)
  - `POST/PUT/DELETE /api/owner/listings/[id]` — owner CRUD
  - `POST /api/owner/register` — bcrypt registracija z welcome email
  - `GET /api/beta-status` — beta status za client

## Tehnične odločitve

1. **Self-contained admin/page.tsx**: AdminDashboard in ListingFormDialog sta lokalni funkciji v isti datoteki (ne ločena komponenta). Razlog: spec zahteva "admin dashboard z 3 tabi" znotraj `admin/page.tsx`, admin ListingForm pa je drugačen od owner ListingForm (admin lahko nastavi plan/featured/verified, owner ne more).

2. **Admin ListingFormDialog razlika**: Admin forma ima polja za plan (Select free/premium/enterprise), featured (Switch), verified (Switch), ownerEmail (Input). Owner forma iz `@/components/owner/listing-form` tega nima — plan se deduje iz owner.plan, featured/verified nastavlja admin.

3. **Leadi tab**: Dvojni fetch — `/api/leads` za summary count+latest (javno dostopen, uporabljen tudi na homepage), `/api/admin/leads` za full tabelo + management. Status cikla z optimistic update in revert ob napaki.

4. **Statistika brez chart knjižnice**: Bar chart po kategorijah je implementiran z navadnim Tailwind (div z width % glede na max). Razlog: enostavneje, brez dodatne odvisnosti, in vizualno konsistentno z ostalim UI.

5. **Dashboard prazni tabi (Izdelki/Izkušnje)**: Po spec implementirana `EmptyPlaceholder` komponenta z "V pripravi" badge. Kljub temu da `/api/owner/products` in `/api/owner/experiences` obstajajo, sem po spec pustil placeholder (avtor specifično zahteva "API še ne obstaja, pusti placeholder").

6. **Plan limiti**: Dve tabeli — `PLAN_LIMITS_NORMAL` (izven beta) in `PLAN_LIMITS_BETA` (med beta, radodarneje). Switch glede na `betaStatus.isActive`. Prikaz z Progress komponento.

7. **Naročnina demo**: "Nadgradi" gumb sproži samo toast notification ("Nadgradnja (demo) ... bo na voljo po koncu beta obdobja"). Brez Stripe integracije v tej fazi.

8. **Session check pattern**: `useSession()` + `useEffect` za redirect (ne `getServerSession` v server komponento) — ker je dashboard "use client" po spec.

9. **SSR hydration safety**: Admin page uporablja `mounted` state guard — `localStorage` se bere šele v `useEffect`, prvotni render prikazuje spinner (prepreči hydration mismatch).

10. **Admin password v env**: `.env` datoteka posodobljena z `ADMIN_PASSWORD=ifeelslovenia2025`. Next.js samodejno reloada env ob spremembi. `checkAdmin()` v `auth-guards.ts` primerja `password === process.env.ADMIN_PASSWORD`.

## Testiranje (živo, port 3000)

- `GET /admin` → 200 (admin login forma)
- `GET /owner/prijava` → 200 (prijava/registracija tabs)
- `GET /owner/dashboard` → 200 (redirect na /owner/prijava če ni session)
- `POST /api/admin/verify` z `{"password":"ifeelslovenia2025"}` → 200 `{"success":true}`
- `POST /api/admin/verify` z napačnim geslom → 401 `{"error":"Napačno geslo"}`
- `GET /api/listings?limit=5` → 200 z listings array
- `GET /api/leads` → 200 `{"count":0,"latest":null}`
- `GET /api/admin/leads` z `x-admin-password: ifeelslovenia2025` → 200 `{"leads":[],"total":0}`
- `GET /api/admin/leads` brez headerja → 401 `{"error":"Neavtoriziran dostop"}`
- `GET /api/admin/listings` z `x-admin-password: ifeelslovenia2025` → 200 z listings array
- `bun run lint` → 0 errors, 0 warnings ✓

## Lint status

`bun run lint` čist — 0 errors, 0 warnings.

## Poti vseh datotek

- `/home/z/my-project/src/app/admin/page.tsx` (rebuild)
- `/home/z/my-project/src/app/owner/prijava/page.tsx` (existing, matches spec — verified)
- `/home/z/my-project/src/app/owner/dashboard/page.tsx` (rebuild)
- `/home/z/my-project/.env` (posodobljen z ADMIN_PASSWORD)
- `/home/z/my-project/agent-ctx/R-8-full-stack-developer.md` (ta zapis)
