import React, { useState } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Testimonials } from '@/components/sections/Testimonials';
import { StatsOverview } from '@/components/sections/StatsOverview';
import { Footer } from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';
import PricingSecOnly from './PricingSecOnly';

const Index: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');

  return (
    <>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <Hero />
      <Features />
      <StatsOverview />
      <PricingSecOnly />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Index;
