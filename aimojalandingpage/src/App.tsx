import { useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Experiences from './components/Experiences';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import PlanTrip from './components/PlanTrip';
import Footer from './components/Footer';
import ThreeTerrain from './components/ThreeTerrain';
import Chatbot from './components/Chatbot';
import Timeline from './components/Timeline';
import PhotoGallery from './components/PhotoGallery';
import Blog from './components/Blog';
import SocialShare from './components/SocialShare';
import Newsletter from './components/Newsletter';
import Reviews from './components/Reviews';
import AdvancedSearch from './components/AdvancedSearch';
import ItineraryPlanner from './components/ItineraryPlanner';
import EventsCalendar from './components/EventsCalendar';
import CuisineGuide from './components/CuisineGuide';
import CurrencyConverter from './components/CurrencyConverter';
import TransportationGuide from './components/TransportationGuide';
import VisaInfo from './components/VisaInfo';
import PriceComparison from './components/PriceComparison';
import WeatherWidget from './components/WeatherWidget';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load LiveChat to reduce initial bundle size
const LiveChat = lazy(() => import('./components/LiveChat'));

export default function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.ts').catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slovenia-green focus:text-white focus:rounded-lg"
      >
        Preskoči na vsebino
      </a>
      <Navigation />
      <main id="main-content">
        <Hero />
        <ThreeTerrain />
        <Destinations />
        <AdvancedSearch />
        <Experiences />
        <Stats />
        <ItineraryPlanner />
        <EventsCalendar />
        <CuisineGuide />
        <CurrencyConverter />
        <TransportationGuide />
        <VisaInfo />
        <PriceComparison />
        <WeatherWidget />
        <Timeline />
        <PhotoGallery />
        <Blog />
        <Reviews />
        <SocialShare />
        <Newsletter />
        <Testimonials />
        <PlanTrip />
      </main>
      <Footer />
      <Chatbot />
      <ErrorBoundary>
        <Suspense fallback={null}>
          <LiveChat />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
