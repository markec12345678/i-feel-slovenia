# Task 20-b — Rezervacijski sistem za izkušnje

**Agent:** full-stack-developer
**Task:** Booking modal + Stripe checkout API (demo) + booking potrditev

## Work Log

1. Prebral `worklog.md` za kontekst projekta "I Feel Slovenia" (Next.js 16, slovenska turistična platforma). Zadnji task: 18-19 (Tržnica izdelkov + izkušenj + sponzorirane poti).
2. Prebral `src/components/sections/marketplace.tsx`, `src/components/sections/experience-modal.tsx`, `src/lib/marketplace-types.ts`, `prisma/schema.prisma`, `src/lib/db.ts`, `src/app/api/stripe/checkout/route.ts` za razumevanje obstoječe arhitekture.
3. Ustvaril `src/components/booking-modal.tsx` — 2-koračni rezervacijski modal:
   - Korak 1: velika slika, ime, cena, kratek opis, react-day-picker koledar (slovenska lokalizacija `date-fns/locale sl`, disabled pretekli + >90 dni), Select za število oseb (min/max iz izkušnje), pregled cene (cena × osebe = skupaj), "Nadaljuj" gumb.
   - Korak 2: pregled rezervacije, kontaktni podatki (ime, email, telefon, posebne želje textarea), GDPR checkbox, "Potrdi in plačaj" gumb → POST `/api/bookings`, loading spinner, error alert.
   - Success: zelen CheckCircle2, številka rezervacije (IF-EXP-XXX), podrobnosti (datum, ura, meeting point, skupaj), kontakt ponudnika, "Zapri" gumb.
   - Reset state-a ko se modal odpre (effect na `experience` null→non-null).
4. Ustvaril `src/app/api/bookings/route.ts` — POST endpoint:
   - Validacija vseh required polj (experienceId, experienceName, pricePerPerson, groupSize 1-100, bookingDate v prihodnosti, guest name/email/phone).
   - Server-side izračun `total = pricePerPerson * groupSize`.
   - Generiranje `bookingNumber = IF-EXP-${Date.now().slice(-6)}`.
   - DEMO mode (STRIPE_SECRET_KEY manjka ali vsebuje "demo_placeholder"): direktno `db.booking.create` z `status="confirmed"`, `confirmedAt=now`, `paymentMethod="demo"`, inkrement `bookingCount` na izkušnji.
   - PRODUCTION mode: TODO komentar za Stripe Checkout Session (vrne 501).
5. Ustvaril `src/app/api/bookings/[bookingNumber]/route.ts` — GET endpoint za lookup rezervacije po bookingNumber (Next.js 16 async params).
6. Posodobil `src/components/sections/marketplace.tsx`:
   - Uvoz `BookingModal`.
   - Dodan state `bookingExperience` + `handleBookExperience` callback (zapre detail modal, odpre booking modal).
   - `ExperienceCard` dobi `onBook` prop → "Rezerviraj" gumb kliče `onBook`.
   - `ExperienceModal` dobi `onBook={handleBookExperience}` prop.
   - `BookingModal` renderiran na dnu section-a z `experience={bookingExperience}`.
7. Posodobil `src/components/sections/experience-modal.tsx`:
   - Dodan optional `onBook?: (experience: Experience) => void` prop.
   - "Rezerviraj" gumb kliče `onBook?.(experience)` (odpre booking modal prek starša).
8. Testiral API end-to-end (dev server):
   - POST valid booking → `{"success":true,"bookingNumber":"IF-EXP-154263","total":106.5,"status":"confirmed",...}` (35.5 € × 3 osebe).
   - POST missing fields → 400 "Manjka experienceId".
   - POST past date → 400 "Datum rezervacije mora biti v prihodnosti".
   - POST bad email → 400 "Neveljaven email naslov".
   - GET lookup valid → vrne celoten Booking record.
   - GET lookup nonexistent → 404 "Rezervacija ni najdena".
   - Home page `/` vrača 200 (booking modal komponenta compila brez napak).
9. `bun run lint` — čist (brez napak, brez warningov).

## Tehnične odločitve

- **react-day-picker v9** z `mode="single"`, `locale={sl}` (date-fns/locale), `disabled={{ before: today, after: today+90dnevi }}`.
- **Slovensko formatiranje**: `date.toLocaleDateString("sl-SI", { weekday: "long", day: "numeric", month: "long", year: "numeric" })` + `formatPrice()` iz marketplace-types (Intl.NumberFormat sl-SI EUR).
- **Server-side total** (ne zaupaj client-u) — `Math.round(price * size * 100) / 100`.
- **Booking number** generiran server-side iz `Date.now().slice(-6)` — unikaten za ~16 minutno okno, dovolj za demo.
- **Demo mode detection**: `!STRIPE_SECRET_KEY || key.includes("demo_placeholder")` (konzistentno z obstoječim `stripe/checkout` route).
- **BookingCount increment** v try/catch — če izkušnja ne obstaja v DB (demo ID), snapshot je že shranjen v Booking.
- **NO indigo/blue** — primarna barva je `bg-primary` (alpsko zelena iz globals.css).
- **Mobile-first** — dialog `max-w-2xl`, scrollable content, grid `sm:grid-cols-2` za kontaktna polja, touch-friendly gumbi (size lg).

## Stage Summary

### Ustvarjene datoteke
- `src/components/booking-modal.tsx` — 2-koračni rezervacijski modal + success view (~480 vrstic)
- `src/app/api/bookings/route.ts` — POST ustvari rezervacijo (demo Stripe) (~210 vrstic)
- `src/app/api/bookings/[bookingNumber]/route.ts` — GET lookup rezervacije (~40 vrstic)

### Posodobljene datoteke
- `src/components/sections/marketplace.tsx` — dodan bookingExperience state, onBook prop na ExperienceCard, BookingModal render
- `src/components/sections/experience-modal.tsx` — dodan onBook prop, "Rezerviraj" gumb odpre booking modal

### Rezultati
- Rezervacijski sistem deluje end-to-end: uporabnik klikne "Rezerviraj" na kartici ali v detail modalu → odpre se booking modal z 2 korakoma → po potrditvi se ustvari Booking v DB (demo mode, status=confirmed) → prikaže se success screen s številko rezervacije.
- Stripe demo mode: Brez realnih ključev se booking direktno potrdi. Production TODO je dokumentiran v komentarjih.
- API validacija pokriva vse edge case-e (missing fields, past date, bad email, invalid group size).
- Lint čist, TypeScript strict, slovenski UI, mobile-first responsive.
