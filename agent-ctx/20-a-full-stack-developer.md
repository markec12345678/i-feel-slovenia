# Task 20-a — Cart sistem + Stripe checkout za izdelke

**Agent:** full-stack-developer
**Datum:** 2026-06-19
**Predhodno:** Task 18-19 (Tržnica izdelkov + izkušenj + sponzorirane poti)

## Povzetek

Implementiral sem popoln checkout sistem za izdelke na platformi "I Feel Slovenia":
- Cart store (Zustand + persist localStorage)
- Cart drawer (Sheet UI z quantity controls, free shipping progress)
- Cart ikona z badge-om v navigaciji
- 2-korakni Checkout modal (podatki za dostavo → pregled in plačilo)
- Stripe checkout API (demo mode, server-side price verification)
- Order lookup API

## Ustvarjene datoteke

1. **`src/lib/cart-store.ts`** (~115 vrstic)
   - Zustand store z persist middleware (localStorage key `ifeelslovenia-cart`)
   - `CartItem` interface: productId, name, slug, price, image, quantity, sellerName, shippingFree, currency?
   - Akcije: addItem (auto-open drawer), removeItem, updateQuantity, clearCart, openCart, closeCart, setCartOpen
   - Selektrorji: subtotal(), shippingTotal() (brezplačno >= 50 EUR ali vsi shippingFree, drugače 4.9), total(), itemCount()
   - partialize: persistira samo `items` (ne `isOpen`)
   - formatEUR() helper (Intl slo-SI EUR)

2. **`src/components/cart-drawer.tsx`** (~290 vrstic)
   - Sheet (side="right") z open state iz useCart
   - Header: ShoppingCart ikona + naslov + števec + X close
   - Body: scrollable CartLine lista (slika size-16, ime + sellerName, quantity -/+ kontrola, total/kos cena, Trash2 remove)
   - Empty state: ShoppingBag ikona + "Nazaj v tržnico"
   - Footer (sticky): free shipping Progress bar, Subtotal/Dostava/Skupaj, "Zaključi nakup" gumb → odpre CheckoutModal

3. **`src/components/checkout-modal.tsx`** (~510 vrstic)
   - Dialog (controlled) z 2 korakoma + 4 statusi (form/submitting/success/error)
   - Korak 1: 7 field-ov za dostavo z iconami, email regex validation
   - Korak 2: naslov preview, lista artiklov, povzetek cen, AMBER demo notice
   - Success: CheckCircle2 + order number + status badge "Plačano"
   - Error: AlertCircle z napako
   - Submitting: Loader2 spinner

4. **`src/app/api/checkout/route.ts`** (~260 vrstic)
   - POST handler z validacijo items + buyer
   - Server-side pridobi price/stock/shippingFree iz baze (NE zaupaj clientu)
   - Preveri zalogo, izračuna subtotal/shipping/total
   - Generira orderNumber: `IF-{year}-{Date.now().slice(-6)}`
   - DEMO mode: db.order.create s status="paid", paidAt=now
   - Ne-blokirajoče saleCount increment
   - Email log na konzolo
   - Vrne { success, orderNumber, total, status, demo }

5. **`src/app/api/orders/[orderNumber]/route.ts`** (~75 vrstic)
   - GET handler, findUnique by orderNumber
   - 404 fallback, items JSON parse

## Posodobljene datoteke

1. **`src/app/layout.tsx`** — dodan import in render `<CartDrawer />` znotraj SessionProviderWrapper
2. **`src/components/sections/navigation.tsx`** — ShoppingBag ikona + cart gumb z badge-om (bg-destructive) levo od theme toggle, mounted guard za hydration safety
3. **`src/components/sections/marketplace.tsx`** — useCart import, ProductCard "V košaro" kliče addItem()
4. **`src/components/sections/product-modal.tsx`** — useCart import, "Dodaj v košaro" kliče addItem() + onClose()

## Testiranje (API)

- ✅ POST /api/checkout s fake ID → 200, orderNumber IF-2026-699247, total 14.9 (10 + 4.9 shipping), demo=true
- ✅ POST /api/checkout z manipulirano ceno (price:999) in real productId → 200, server override na 29 EUR, total 58 (free shipping)
- ✅ POST /api/checkout prazna košarica → 400 "Košarica je prazna."
- ✅ POST /api/checkout neveljaven email → 400 "Veljavna e-pošta je obvezna."
- ✅ GET /api/orders/IF-2026-699247 → 200, vrača polne podatke z items parsed
- ✅ GET /api/orders/NONEXISTENT-123 → 404 "Naročilo ni najdeno."
- ✅ Dev log: `[checkout] POSLAN EMAIL → test@example.com: Naročilo IF-2026-699247 potrjeno (skupaj: 14.90 EUR). Demo=true.`

## Lint

- `bun run lint` → 0 errorjev, 0 opozoril (TypeScript strict)

## Tehnične odločitve

1. **Zustand persist** z `partialize: (state) => ({ items: state.items })` — persistira samo items, ne isOpen (drawer naj se odpre eksplicitno)
2. **Mounted guard** za cart badge — prepreči hydration mismatch (Zustand persist prebere localStorage šele na klientu)
3. **Server-side price override** — API pridobi ceno iz baze (ne zaupaj client price), preveri stock
4. **Demo mode detection** — STRIPE_SECRET_KEY vsebuje "demo_placeholder" → isDemo boolean
5. **Order number format** — `IF-{year}-{6-digit timestamp}` (kolizijsko-varno za demo)
6. **Ne-blokirajoče saleCount increment** — catch(() => {}) da ne moti checkout flow-a
7. **Auto-open cart drawer on addItem** — UX konvencija (Amazon, Etsy)
8. **Close modal on add** — ker addItem odpre drawer, modal naj se zapre da ne blokira

## Production TODO

Ko bodo dodani realni Stripe ključi:
1. Implementirati Stripe Checkout Session v /api/checkout
2. Webhook /api/stripe/webhook za status posodobitve (paid/failed/refunded)
3. Pravi email service (SendGrid/Resend)
4. Tracking number integracija (Pošta Slovenije, DHL, GLS)
