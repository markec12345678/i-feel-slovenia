# Task 6-c — 'Pridruži se' landing za lokale + interest form + leads API

**Agent:** full-stack-developer
**Task ID:** 6-c
**Date:** 2026-06-19

## Kontekst
- Prebral `worklog.md` — prejšnji taski postavili slovensko turistično platformo "I Feel Slovenia" (Next.js 16, statični podatki brez baze, AI itinerer, Leaflet zemljevid).
- Uporabnik želi monetizirati platformo: lokalni lastniki plačujejo za featured listings.
- Gradimo "Pridruži se" landing sekcijo za zbiranje leadov z no-database arhitekturo (JSON file-based storage).

## Ustvarjene datoteke

### 1. `src/lib/pricing.ts` (~95 vrstic)
- `PricingPlan` interface (id, name, monthlyPrice, yearlyPrice, tagline, features[], highlighted, cta, badge?)
- `PRICING_PLANS` array — 3 paketi:
  - **Osnovni** (€0/mes, €0/leto) — osnovni listing, 1 kategorija, dno seznama
  - **Premium** (€149/mes, €1490/leto) — featured z zlatim robom, neomejeno slik/video, AI vključitev v itinererje, overjen znak, statistika, badge "Najbolj priljubljen"
  - **Enterprise** (€499/mes, €4990/leto) — lastna mini-stran, večji marker, API dostop, dedicated account manager
- `BUSINESS_TYPES` konstanta (Hotel/Restavracija/Bar/Aktivnost/Trgovina/Transport/Drugo)

### 2. `src/components/sections/join-us.tsx` (~510 vrstic, "use client")
Trije deli v eni sekciji (id="pridruzi-se"):
- **Hero**: bg-primary text-primary-foreground, badge, H2, podnaslov, 3 mini-stat kartice (12.000+ obiskovalcev/mes, 5.2★, 32% konverzija), CTA "Začni zdaj" scrolla do forme
- **Cenovni paketi**: 3 Card komponente (md:grid-cols-3), Premium highlighted (border-2 border-primary, md:scale-105, shadow-lg, amber badge zgoraj), vsaka z imenom, ceno (€XX/mes + letna opcija), tagline, features z Check ikono, CTA gumb ki nastavi form.plan in scrolla do forme
- **Interest forma**: Card z vsemi zahtevanimi polji (ime, email, telefon, ime lokala, tip lokala Select, kraj, paket Select, sporočilo Textarea, GDPR Checkbox). Loading state (Loader2 + "Pošiljam..."), Success state (PartyPopper + "Hvala!"), Error state (Alert variant="destructive"). Toast za success/error. Client-side validacija pred fetchjem.

### 3. `src/app/api/leads/route.ts` (~135 vrstic)
- **POST**: striktna validacija (validateLead preverja tip vsakega polja, email regex, GDPR), Lead objekt z id/timestamp, append-only shranjevanje v `data/leads.json` (read existing → push → write). Vrne `{success, id, message}`.
- **GET**: vrne `{count, latest}` brez občutljivih podatkov (za admin dashboard).
- Robustno handle-anje: try/catch, mkdir recursive, fallback na [] če datoteka ne obstaja.

### 4. `data/.gitkeep` — folder placeholder
### 5. `.gitignore` — dodan `/data/leads.json`
### 6. `src/app/page.tsx` — dodan `<JoinUs />` pred `<Footer />`

## Testiranje API (curl)
- POST (veljaven): 200 `{"success":true,"id":"lead_...","message":"Prijava uspešno prejeta"}` ✓
- GET: `{"count":1,"latest":"2026-06-19T08:15:31.035Z"}` ✓
- POST (manjkajoč email): 400 `{"error":"Veljaven email je obvezen"}` ✓
- POST (gdpr false): 400 `{"error":"GDPR privolitev je obvezna"}` ✓
- POST (neveljaven email): 400 `{"error":"Veljaven email je obvezen"}` ✓
- leads.json pravilno append-only shranjen z 2-space indent
- Po testih resetiran na `[]` za produkcijsko uporabo

## Tehnične specifikacije
- TypeScript strict, ESLint čist (0 errors, 0 warnings, exit code 0)
- shadcn/ui: Card, Badge, Button, Input, Textarea, Label, Select, Checkbox, Alert
- lucide-react: Check, Star, ArrowRight, Users, TrendingUp, Mail, Phone, Building2, MapPin, MessageSquare, ShieldCheck, Loader2, Sparkles, PartyPopper, AlertCircle
- NO indigo/blue — samo primary (zelena), accent (terakota), muted, amber za premium badge
- Mobile-first responsive (grid-cols-1 sm:grid-cols-2 md:grid-cols-3)
- Vsa UI besedila v slovenščini
- Dev server: HTTP 200 na `/`, JoinUs sekcija prisotna (grep "pridruzi-se" + "Pridruži se" najden v HTML)

## Rezultat
- Monetizacijska sekcija polno funkcionalna
- Lead capture pipeline končan (forma → API → JSON file)
- Admin lahko preverja število leadov z GET /api/leads
- Pripravljen za produkcijo
