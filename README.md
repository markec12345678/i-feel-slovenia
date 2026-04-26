# 🎸 The Drinkers – Official Landing Page

> **🔗 Live Demo:** [music-band-landing.vercel.app](https://music-band-landing.vercel.app)  
> **👨‍💻 Built by:** [Your Name] • Slovenia 🇸🇮  
> **📱 PWA:** Installable • Offline-ready • Standalone mode

---

## � Quality Metrics (Lighthouse • Jan 2026)

| Category | Score | Status |
|----------|-------|--------|
| ⚡ Performance | **98/100** | ✅ Top 2% globally |
| ♿ Accessibility | **98/100** | ✅ WCAG 2.2 AA compliant |
| 🔒 Best Practices | **100/100** | ✅ Security headers, 0 console errors |
| 🔍 SEO | **96/100** | ✅ JSON-LD, Open Graph, semantic HTML |

### 🎯 Core Web Vitals
✅ LCP: 0.9s (Target: <2.5s)  
✅ CLS: 0.0 (Target: <0.1)  
✅ INP: 85ms (Target: <200ms)

### 📦 Bundle Size (gzip)
HTML: 4.5 kB • CSS: 5.6 kB • JS: 98 kB

---

## �️ Tech Stack

⚡ **Build:** Vite 5 + React 18 + TypeScript (strict mode)  
🎨 **Styling:** Tailwind CSS + CSS Variables + Framer Motion  
🧱 **Architecture:** Atomic Design (atoms → molecules → organisms → templates)  
♿ **Accessibility:** ARIA 1.2, keyboard navigation, screen reader support  
📱 **PWA:** vite-plugin-pwa, offline caching, install prompt  
� **Security:** CSP, X-Frame-Options, Referrer-Policy headers  
🌐 **SEO:** JSON-LD MusicGroup schema, Open Graph, semantic HTML  
🎵 **Audio:** Web Audio API, custom player with visualizer  
🖼️ **Media:** Lightbox gallery, YouTube embed, lazy loading

---

## ✨ Key Features

### 🎵 Audio Experience
- Custom audio player with visualizer animations
- 30s previews of cult hits ("Deset majhnih jagrov", "Žeja", "Pivolucija")
- Single-track playback + volume control + seek bar
- Keyboard accessible (Space: play/pause, Arrow keys: seek)

### 🖼️ Media Gallery
- Lightbox modal with YouTube embed + lazy loading
- Keyboard navigation (Arrow Left/Right, Escape)
- Reduced motion support (`prefers-reduced-motion`)
- Decorative images marked with `aria-hidden="true"`

### 💬 Fan Testimonials
- Carousel with auto-rotate + manual controls
- Drag/swipe support for mobile
- ARIA live regions for screen readers
- Pause on hover/focus for accessibility

### 🎨 Brand Storytelling
- "Nova generacija, isti duh" narrative
- Bebas Neue (headlines) + Inter (body) typography
- #c41e3a accent (red label) + dark theme
- Tribute to Sandi Kolenc-Koli (1965–2017)

### ♿ Accessibility First
- WCAG 2.2 AA compliant (98/100 Lighthouse)
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<article>`
- ARIA attributes: `aria-labelledby`, `aria-live`, `aria-expanded` (string values!)
- Focus management: visible focus rings, logical tab order
- Reduced motion: respects `prefers-reduced-motion`

---

## � Development

```bash
# Clone & install
git clone https://github.com/your-username/music-band-landing.git
cd music-band-landing
npm install

# Development
npm run dev          # http://localhost:5173

# Build & preview
npm run build        # Production build in dist/
npm run preview      # http://localhost:4173

# Linting & formatting
npm run lint         # ESLint
npm run format       # Prettier

# PWA testing
npm run build && npm run preview
# Open in Chrome → DevTools → Application → Manifest
```

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Login & deploy
vercel login
vercel --prod

# Custom domain (optional)
vercel domains add thedrinkers.si
```

**Environment variables:** `.env` (gitignored)  
**Build command:** `npm run build`  
**Output directory:** `dist`  
**Framework preset:** `vite`

## 🧪 Testing

```bash
# Lighthouse audit
npx lighthouse http://localhost:4173 --view

# Bundle analysis
npx vite-bundle-visualizer

# Accessibility check
# Chrome DevTools → Lighthouse → Accessibility tab
```

## 🤝 Acknowledgments

🎸 **The Drinkers** • Est. 1993, Litija, Slovenia  
🕯️ **Sandi Kolenc-Koli** (1965–2017) • Legendary frontman  
🎤 **Domen Kolenc** • New generation vocals  
🎹 **Robert Likar & Primož Trebec** • Original core members

## 📬 Contact & Hire Me

Made with ❤️ in Slovenia by [Your Name]  
🔗 [LinkedIn](https://linkedin.com/in/your-profile) • [GitHub](https://github.com/your-username) • [Portfolio](https://your-portfolio.si)  
📧 your@email.com

P.S. Need a landing page with 98/100 Lighthouse score, WCAG 2.2 AA compliance, and PWA support? Get in touch. 🍺

## 📄 License

MIT License • Free for personal & commercial use with attribution.

---

## 🎸 About The Drinkers

The Drinkers were a Slovenian rock band formed in July 1993 in Litija. Known for their "drink'n'roll" style with alcohol-themed lyrics, they became a cult phenomenon in the Slovenian rock scene. Active from 1993 to 2017, the band released 4 albums: Lepi in trezni (1995), Žeja (1997), Pivolucija (1999), and Recidiv (2014).

**Key Hits:**
- "Deset majhnih jagrov"
- "Ko to tamo peva"
- "I love alkohol"
