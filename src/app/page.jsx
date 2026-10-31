import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortalCards from '@/components/PortalCards';
import Sambutan from '@/components/Sambutan';
import StatsCounter from '@/components/StatsCounter';
import ProgramUnggulan from '@/components/ProgramUnggulan';
import Ekskul from '@/components/Ekskul';
import NewsSection from '@/components/NewsSection';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';
import CampusMap from '@/components/CampusMap';
import Footer from '@/components/Footer';
import Modals from '@/components/Modals';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PortalCards />
      <Sambutan />
      <StatsCounter />
      <ProgramUnggulan />
      <Ekskul />
      <NewsSection />
      <Testimonials />
      <Partners />
      <CampusMap />
      <Footer />
      <Modals />
    </main>
  );
}
