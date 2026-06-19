# Task 10-b — Owner portal (registracija, prijava, dashboard) z NextAuth

**Agent:** full-stack-developer
**Datum:** 2026-06-19
**Status:** ✅ Končano

## Povzetek

Ustvarjen je celovit B2B portal za lastnike lokalov z NextAuth avtentikacijo, registracijo, dashboardom za upravljanje listings in API-ji za CRUD operacije. Lastniki se registrirajo samostojno, prijavijo z email/geslo, in upravljajo svoje lokale znotraj omejitev svojega paketa (free=1, premium=5, enterprise=∞).

## Ustvarjene datoteke

### Komponente
- `src/components/session-provider.tsx` — NextAuth SessionProvider wrapper (client)
- `src/components/owner/listing-form.tsx` — ListingFormDialog (create/edit listing, brez plan/featured/verified polj)

### Strani
- `src/app/owner/prijava/page.tsx` — Prijava + Registracija (2 tabi)
- `src/app/owner/dashboard/page.tsx` — Dashboard (3 tabi: Moji lokalci, Naročnina, Statistika)

### API routes
- `src/app/api/owner/register/route.ts` — POST registracija (zod validacija, bcrypt hash)
- `src/app/api/owner/listings/route.ts` — GET (lastnikovi lokalci) + POST (nov, z plan limit check)
- `src/app/api/owner/listings/[id]/route.ts` — GET/PUT/DELETE z ownership preverbo
- `src/app/api/owner/session/route.ts` — GET session info za client

### Posodobljene datoteke
- `src/app/layout.tsx` — dodan SessionProviderWrapper (ohranjeni ThemeProvider + Toaster + metapodatki)

## Ključne odločitve

1. **NextAuth CredentialsProvider** — email + geslo, jwt session, custom fields (id, businessName, plan, subscriptionStatus) v token/session preko callbacks
2. **Plan limiti** — `PLAN_LIMITS: { free: 1, premium: 5, enterprise: Infinity }` — preverjeno v POST /api/owner/listings
3. **Ownership zaščita** — `getOwnedListing()` helper preveri `listing.ownerId === session.user.id` pred vsako operacijo (GET/PUT/DELETE)
4. **Auto-set na novem listingu** — plan deduje iz owner.plan, featured=false, verified=false, slug auto-generiran (slovenski slugify: č→c, š→s, ž→z)
5. **ListingFormDialog** — owner NE more nastaviti plan/featured/verified (samo admin lahko — info opomba v formi)
6. **Statistika tab** — KPI kartice (skupni ogledi/kliki/konverzija/število lokalov), top lokal po ogledih, top 5 po klikih (bar chart), opomba o podrobni časovni statistiki (Premium+)
7. **Naročnina tab** — trenutni paket card + 3 pricing cards (PRICING_PLANS iz pricing.ts), Stripe gumb = placeholder (toast "kmalu na voljo")
8. **Delete** — AlertDialog (ne native confirm) za boljšo UX
9. **Brez indigo/blue** — primary (zelena), accent (terakota), amber za premium badge
10. **Mobile-first** — responsive grid (1 col mobile, 2-3 col desktop), header badge skrči na mobile

## Testirano (end-to-end)

- ✅ Registracija: validacija (email, password≥8, gdpr, duplicate → 409)
- ✅ Prijava: signIn("credentials") → JWT token → session cookie
- ✅ Session API vrača vse custom fields (id, businessName, plan, subscriptionStatus)
- ✅ GET /api/owner/listings — vrne samo lastnikove lokale
- ✅ POST /api/owner/listings — plan deduje, slug auto-gen, destinationName auto-resolve iz DESTINATIONS
- ✅ Plan limit: free=1 → 2. listing zavrnjen (403) s slovenskim sporočilom
- ✅ PUT /api/owner/listings/[id] — update z ownership check, slug regenerira ob spremembi imena
- ✅ DELETE /api/owner/listings/[id] — z ownership check
- ✅ Ownership izolacija: owner1 NE more GET/PUT/DELETE owner2 listinga (403 Forbidden)
- ✅ Unauth access → 401
- ✅ Lint čist (0 errors, 0 warnings)

## Tehnologije

- NextAuth v4 (CredentialsProvider, jwt, custom callbacks)
- bcryptjs (hash gesla, 10 rund)
- zod v4 (input validacija v API-jih)
- Prisma (Owner + Listing modela)
- shadcn/ui (Card, Badge, Button, Tabs, Dialog, AlertDialog, Select, Input, Textarea, Label, Checkbox, Alert)
- lucide-react ikone (Building2, LogOut, Plus, Pencil, Trash2, Eye, MousePointerClick, Star, Crown, Check, TrendingUp, Loader2, AlertCircle, ShieldCheck, itd.)

## Naslednji koraki (za prihodnje taske)

- Stripe checkout API (`/api/stripe/checkout`) — trenutno placeholder gumb
- Podrobna časovna statistika (po dnevih) — zahteva novo tabelo ListingEvent
- Admin panel za nastavljanje featured/verified lastnikovih lokalov
- Email potrditev registracije
- Pozabljeno geslo (reset flow)
