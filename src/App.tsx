import { Navbar } from '@/components/organisms/Navbar';
import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';
import { BandMembersSection } from '@/components/organisms/BandMembersSection';
import { MediaSection } from '@/components/organisms/MediaSection';
import { AudioPreviewSection } from '@/components/organisms/AudioPreviewSection';
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection';
import { TourDatesSection } from '@/components/organisms/TourDatesSection';
import { Footer } from '@/components/organisms/Footer';

function App() {
  return (
    <main className="min-h-screen bg-background text-primary selection:bg-accent/30">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BandMembersSection />
      <MediaSection />
      <AudioPreviewSection />
      <TestimonialsSection />
      <TourDatesSection />
      <Footer />
    </main>
  );
}

export default App;
