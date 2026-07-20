import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/landing/Hero'));
const FeaturedDishes = dynamic(() => import('@/components/landing/FeaturedDishes'));
const AboutSection = dynamic(() => import('@/components/landing/AboutSection'));
const LandingFooter = dynamic(() => import('@/components/landing/Footer'));
import LandingNavbar from '@/components/landing/Navbar';

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <Hero />
      <div id="content">
        <FeaturedDishes />
        <AboutSection />
        <LandingFooter />
      </div>
    </>
  );
}
