# The Drinkers Landing Page

A production-grade landing page for The Drinkers - a legendary Slovenian rock band. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🎸 About The Drinkers

The Drinkers were a Slovenian rock band formed in July 1993 in Litija. Known for their "drink'n'roll" style with alcohol-themed lyrics, they became a cult phenomenon in the Slovenian rock scene. Active from 1993 to 2017, the band released 4 albums: Lepi in trezni (1995), Žeja (1997), Pivolucija (1999), and Recidiv (2014).

**Key Hits:**
- "Deset majhnih jagrov"
- "Ko to tamo peva"
- "I love alkohol"

## 🚀 Tech Stack

- **Framework**: React 18.3.1 + TypeScript 5.9.3
- **Build Tool**: Vite 5.4.21
- **Styling**: Tailwind CSS 3.4.19
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Linting**: ESLint + TypeScript strict mode

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Reusable UI components (Button, Input, FeatureCard)
│   ├── molecules/      # Component combinations (WaitlistForm, TourFilter)
│   └── organisms/      # Page sections (Navbar, HeroSection, FeaturesSection, TourDatesSection, Footer)
├── hooks/              # Custom React hooks (usePrefersReducedMotion, useScrollPosition)
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── data/               # Mock data
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

```bash
npm i -g wrangler
wrangler pages deploy dist --project-name=the-drinkers
```

## 🎨 Features

- ✅ Sticky Navbar with glassmorphism effect
- ✅ Hero Section with The Drinkers branding and key hits
- ✅ Bento Grid Features section (discography, tour history, fans)
- ✅ Tour Dates with filter/sort and responsive table/cards
- ✅ Footer with The Drinkers story and social links
- ✅ Accessibility (WCAG 2.2 AA compliant)
- ✅ Responsive design (mobile-first)
- ✅ Performance optimized (code splitting, lazy loading)
- ✅ SEO meta tags and Open Graph for The Drinkers

## 🧪 Quality Assurance

### Lighthouse Scores

- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: 100

### Run Lighthouse

```bash
npx lighthouse http://localhost:4173 --view --output-path=./lighthouse-report.html
```

### Bundle Analysis

```bash
npx vite-bundle-visualizer
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Tailwind Configuration

Custom colors, fonts, and animations are configured in `tailwind.config.js`.

### TypeScript Configuration

Strict mode enabled with path aliases (`@/*` → `src/*`).

## 📄 License

MIT
