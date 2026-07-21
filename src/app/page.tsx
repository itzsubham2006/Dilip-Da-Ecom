import dynamicImport from 'next/dynamic';

const Hero = dynamicImport(() => import('@/components/landing/Hero'));
const FeaturedDishes = dynamicImport(() => import('@/components/landing/FeaturedDishes'));
const AboutSection = dynamicImport(() => import('@/components/landing/AboutSection'));
const LandingFooter = dynamicImport(() => import('@/components/landing/Footer'));
const LandingNavbar = dynamicImport(() => import('@/components/landing/Navbar'));

export const dynamic = 'force-static';

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
