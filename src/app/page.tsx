'use client';

import LandingNavbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import FeaturedDishes from '@/components/landing/FeaturedDishes';
import AboutSection from '@/components/landing/AboutSection';
import LandingFooter from '@/components/landing/Footer';

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
