import dynamicImport from 'next/dynamic';

const Hero = dynamicImport(() => import('@/components/landing/Hero'));
const OfferCards = dynamicImport(() => import('@/components/landing/OfferCards'));
const FeaturedDishes = dynamicImport(() => import('@/components/landing/FeaturedDishes'));

export default function Home() {
  return (
    <>
      <Hero />
      <OfferCards />
      <FeaturedDishes />
    </>
  );
}
