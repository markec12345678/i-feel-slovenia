# Task 2-c — full-stack-developer

## Task
AI Itinerary Planner komponenta (`src/components/sections/itinerary-planner.tsx`) za platformo I Feel Slovenia.

## Context read
- `/home/z/my-project/worklog.md` — predhodno delo (backend + design system končan)
- `src/lib/types.ts` — PlannerInput, Itinerary, DayPlan, LocationVisit, Season, AffiliateLinks
- `src/lib/slovenia-data.ts` — INTERESTS array (8 interesov z ikonami)
- `src/lib/affiliate.ts` — getAffiliateLinks(name) → {hotels, cars, activities, flights, insurance}
- shadcn/ui komponente v `src/components/ui/` (button, card, input, label, select, badge, skeleton, alert vse na voljo)
- Toast infrastruktura: radix `useToast` iz `@/hooks/use-toast`, Toaster montiran v `layout.tsx`

## Deliverable
Datoteka: `/home/z/my-project/src/components/sections/itinerary-planner.tsx` (~470 vrstic)

### Glavne odločitve
- **Toast**: uporabljen radix `useToast` (ne sonner) ker je radix Toaster že montiran v layout.tsx — ni potrebna sprememba layouta
- **Multi-select interesov**: custom toggle badge gumbi z `aria-pressed`, izbrani `bg-primary text-primary-foreground`, neizbrani `bg-muted`
- **Affiliate CTA**: `<Button asChild>` z `<a target="_blank" rel="noopener noreferrer sponsored">` — pravilno odpre Booking povezavo v novem tabu
- **Source badge**: AI = emerald (zelena), Fallback = amber (rumena) — uporabljen `bg-emerald-500/10` in `bg-amber-500/10` ker shadcn nima vgrajenih success/warning variant
- **Validacija**: izločena v `validate(input)` funkcijo, klicana tako iz `handleSubmit` kot pred retry-jem
- **Retry**: `generateItinerary(formData)` direktno pokliče (ne preko DOM hack)

### Layout
- `section id="načrtuj"` z `scroll-mt-24` za sticky-nav anchor
- `grid gap-6 lg:grid-cols-2` — mobile 1 kolona, desktop 2
- LEVO: Card z obrazcem (sm:grid-cols-2 za dni/proračun/skupina/sezona, interesi full-width spodaj)
- DESNO: empty / skeleton / error / success state-ji

### Lint status
Komponenta brez ESLint napak. Preostale napake v `weather-widget.tsx`, `destination-modal.tsx`, `destinations.tsx` so iz drugih taskov (2-a, 2-b) in niso v mojem obsegu.

## Handoff
Komponenta je pripravljena za integracijo v `src/app/page.tsx`:
```tsx
import { ItineraryPlanner } from "@/components/sections/itinerary-planner";
// ...
<ItineraryPlanner />
```
API route `POST /api/itinerary` že obstaja (iz Task 1) z AI + fallback logiko.
