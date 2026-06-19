# Task 26-a/b — Email avtomatizacija + Owner Analytics

Agent: full-stack-developer
Task ID: 26-a/b

## Work Log

### Branje konteksta
- Prebral `worklog.md` (celoten kontekst projekta I Feel Slovenia)
- Zadnji task: 24-25 (pavšalni oglasni model — Stripe subscriptions)
- Prebral obstoječe datoteke:
  - `src/app/api/owner/register/route.ts`
  - `src/app/api/leads/route.ts`
  - `src/app/api/stripe/checkout/route.ts`
  - `src/app/api/stripe/webhook/route.ts`
  - `src/app/owner/dashboard/page.tsx` (2349 vrstic, 5 tabov)
  - `prisma/schema.prisma` (Owner model)
  - `.env`
  - `src/lib/stripe-server.ts`, `src/lib/auth-guards.ts`
  - `src/components/sections/join-us.tsx`
  - `src/lib/listings-types.ts`, `src/lib/marketplace-types.ts`

### Ustvarjene datoteke
1. **`src/lib/email.ts`** — Nodemailer SMTP config + sendEmail() helper
   - isEmailDemo() — detekcija demo mode (SMTP_HOST=localhost)
   - emailTemplate() — osnovni HTML wrapper z zeleno glavo in footer-jem
   - getAdminEmail() — prebere ADMIN_EMAIL iz env (fallback admin@ifeelslovenia.si)
   - getBaseUrl() — prebere NEXTAUTH_URL / VERCEL_URL

2. **`src/lib/email-templates.ts`** — 5 template funkcij (dvojezične SL/EN)
   - `welcomeEmail(ownerName, businessName, plan)` — pozdrav po registraciji, CTA "Pojdi v dashboard"
   - `paymentConfirmationEmail(ownerName, plan, amount, renewalDate)` — potrditev plačila z razčlenitvijo
   - `renewalReminderEmail(ownerName, plan, daysLeft, renewalDate)` — 7-dnevni opomnik za obnovitev
   - `leadNotificationEmail(ownerName, businessName, leadName, leadEmail, leadPhone, plan, message?)` — nov lead
   - `adminAlertEmail(alertType, details)` — 4 tipi: new_signup, new_lead, cancellation, payment_failed
   - `PLAN_LABELS_EN` — angleške oznake paketov
   - HTML escape + formatEur helperja

3. **`src/app/api/email/welcome/route.ts`** — Internal API za welcome email
   - POST: z validacijo (zod) kliče sendEmail z welcomeEmail template
   - Vrne `{ success, demo }` indikator

4. **`src/app/api/cron/renewal-reminders/route.ts`** — Cron job za renewal opomnike
   - GET/POST: poišče ownerje z active naročnino, subscriptionEndsAt v 7 dneh, renewalReminderSent=false
   - Pošlje renewalReminderEmail vsakemu, setira flag na true
   - Vrne `{ checked, sent, failed, windowDays, runAt }`
   - Komentarji z navodili za Vercel Cron / external cron / GitHub Actions

5. **`src/app/api/owner/analytics/route.ts`** — Owner Analytics API
   - GET: vrne analitiko za prijavljenega ownerja
   - Aggregira views iz listings + products + experiences
   - clicks iz listings
   - leads iz `data/leads.json` (kjer businessName vsebuje owner.businessName)
   - Top 5 listings/products/experiences (po viewCount)
   - Trend: 30-dnevni series (deterministic seed iz owner.id + Mulberry32 PRNG)
   - ROI: 1 lead ≈ €50 vrednost, pozitiven če ≥3 leadi ali ≥ cena paketa
   - Vrne tudi conversionRate in counts

### Posodobljene datoteke
6. **`prisma/schema.prisma`** — dodano polje `renewalReminderSent Boolean @default(false)` v Owner model

7. **`src/app/api/owner/register/route.ts`** — po uspešni registraciji:
   - Pošlje welcomeEmail lastniku
   - Pošlje adminAlertEmail("new_signup", ...) na ADMIN_EMAIL
   - Oba try/catch (non-blocking)

8. **`src/app/api/stripe/checkout/route.ts`** — demo mode:
   - Reset renewalReminderSent=false ob aktivaciji
   - Pošlje paymentConfirmationEmail po nadgradnji

9. **`src/app/api/stripe/webhook/route.ts`** — production mode:
   - `checkout.session.completed`: pošlje paymentConfirmationEmail, reset renewalReminderSent
   - `customer.subscription.updated`: reset renewalReminderSent če se renewal datum podaljša
   - `customer.subscription.deleted`: pošlje adminAlertEmail("cancellation", ...)
   - `invoice.payment_failed`: pošlje adminAlertEmail("payment_failed", ...)

10. **`src/app/api/leads/route.ts`** — po shranjevanju lead-a:
    - Pošlje leadNotificationEmail na ADMIN_EMAIL (glavni "nov lead" alert)
    - Če lead.businessName se ujema z obstoječim Owner.businessName — pošlje tudi lastniku
    - Oba try/catch (non-blocking)

11. **`src/app/owner/dashboard/page.tsx`** — razširjen StatisticsTab:
    - Nov `AnalyticsData` interface (kpi, topListings, topProducts, topExperiences, trend, roi)
    - `useEffect` fetcha `/api/owner/analytics` ob mount-u
    - **ROI banner** (zeleno/amber) na vrhu z ikono Target, badge-om paketa in sporočilom
    - **4 KPI kartice**: Skupni ogledi, Kliki, Lead-i (Mail ikona), Konverzija %
    - **Vrednost naročnine** sekcija: 3 kvadratki (Plačujete / Dobili ste / Bilanca) + progress bar
    - **Top 5 lokalov** po ogledih (bar chart vsak posebej)
    - **Top izdelki + Top izkušnje** (2 koloni na desktopu)
    - **Trend 30 dni** (simple bar chart z dnevno granulacijo)
    - Alert opomba o poenostavljenem prikazu
    - `KpiCard` razširjen z "emerald" color option
    - Novi lucide ikone: Mail, Activity, Target
    - Fallback na osnovno statistiko če API ne vrne podatkov

12. **`.env`** — dodane SMTP in ADMIN_EMAIL nastavitve:
    - `SMTP_HOST=localhost` (demo mode)
    - `SMTP_PORT=587`, `SMTP_SECURE=false`
    - `SMTP_USER=`, `SMTP_PASS=` (prazno za demo)
    - `SMTP_FROM=noreply@ifeelslovenia.si`
    - `ADMIN_EMAIL=admin@ifeelslovenia.si`

### Testiranje
- `bun run db:push` — schema sync + Prisma client regeneracija ✓
- `bun run lint` — 0 errorjev, 0 opozoril ✓
- `curl /api/cron/renewal-reminders` → 200 `{"success":true,"checked":0,"sent":0,"failed":0,"windowDays":7,"runAt":"..."}` ✓
- `curl /api/owner/analytics` (brez auth) → 401 `{"error":"Niste prijavljeni"}` ✓
- Dev server uspešno ponovno zagnan po .next cache clear
- Prisma query log potrjuje uporabo `renewalReminderSent` polja v WHERE clavzuli ✓

### Tehnične podrobnosti
- Vsi emaili DVOJEZIČNI (slovenščina + angleški podnaslov) za globalne stranke
- Demo mode (SMTP_HOST=localhost): samo `console.log("[EMAIL DEMO]...")` — ne pošilja realnih emailov
- Production mode: nodemailer.sendMail() s pravim SMTP
- Vse email napake try/catch — ne blokirajo glavne logike (registracija, plačilo, lead)
- HTML escape v email-templates.ts preprečuje XSS v e-pošti
- Cron ruta dokumentirana z navodili za Vercel Cron / external cron
- ROI hevristika: 1 lead = €50 vrednost (povprečna rezervacija/kos)
- Trend graf: deterministic PRNG (Mulberry32) seedan z owner.id → stabilen prikaz
- NO indigo/blue barve — samo primary zelena, amber, emerald, red (za past_due)

## Stage Summary
Ustvarjene datoteke (5 novih):
- `src/lib/email.ts` (~75 vrstic) — Nodemailer config, sendEmail, emailTemplate
- `src/lib/email-templates.ts` (~330 vrstic) — 5 dvojezičnih template funkcij
- `src/app/api/email/welcome/route.ts` (~50 vrstic) — internal welcome API
- `src/app/api/cron/renewal-reminders/route.ts` (~95 vrstic) — cron job za renewal opomnike
- `src/app/api/owner/analytics/route.ts` (~245 vrstic) — analitika z ROI izračunom

Posodobljene datoteke (6):
- `prisma/schema.prisma` — renewalReminderSent Boolean @default(false)
- `src/app/api/owner/register/route.ts` — welcome + admin alert email
- `src/app/api/stripe/checkout/route.ts` — payment confirmation (demo)
- `src/app/api/stripe/webhook/route.ts` — payment confirmation (prod) + cancellation + payment_failed alerti
- `src/app/api/leads/route.ts` — lead notification email (admin + matching owner)
- `src/app/owner/dashboard/page.tsx` (~1850 vrstic dodanih) — razširjen StatisticsTab z analitikami
- `.env` — SMTP + ADMIN_EMAIL spremenljivke

Funkcionalnost:
- ✅ Email sistem z 5 tipi sporočil (welcome, payment, renewal, lead, admin alert)
- ✅ Dvojezični emaili (SL/EN) za globalne stranke
- ✅ Demo mode (SMTP_HOST=localhost): console.log fallback
- ✅ Production mode: SMTP preko nodemailer
- ✅ Integracija v register/checkout/webhook/leads API-je
- ✅ Cron ruta za renewal opomnike (7 dni prej, renewalReminderSent flag)
- ✅ Owner Analytics API: views, clicks, leads, conversion, ROI
- ✅ Owner Dashboard "Statistika" tab: ROI banner, 4 KPI, vrednost naročnine, top oglas, top izdelki+izkušnje, 30-dnevni trend
- ✅ ROI hevristika: 1 lead = €50, pozitiven če ≥3 leadi ali ≥ cena paketa
- ✅ NO indigo/blue — samo zelena (primary), amber, emerald, red
- ✅ Mobile-first responsive (grid-cols-2 na mobilcu, 4 na desktopu za KPI)
- ✅ Lint čist (0 errorjev, 0 opozoril)
- ✅ Dev server uspešno ponovno zagnan, API klici testirani z curl
