import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import FeatureCards from '@/components/feature-cards';
import ToolsSection from '@/components/tools-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <Hero />
      <FeatureCards />
      <ToolsSection />
    </main>
  );
}
