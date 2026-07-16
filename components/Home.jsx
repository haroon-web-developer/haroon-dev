import React from 'react';
import { motion } from 'framer-motion';

import AgencyHero from './AgencyHero';
import StatsSection from './StatsSection';
import SolutionsSection from './SolutionsSection';
import QuoteCalculator from './QuoteCalculator';
import Testimonials from './Testimonials';
import Contact from './Contact';

const Home = () => {
  const scrollToQuote = () => {
    const element = document.getElementById('quote-configurator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0f1d] overflow-x-hidden"
    >
      {/* 1. Agency Hero Section */}
      <AgencyHero onGetQuoteClick={scrollToQuote} />

      {/* 2. Stats Section */}
      <StatsSection />

      {/* 3. Our Solutions Section */}
      <SolutionsSection onGetQuoteClick={scrollToQuote} />

      {/* 4. Instant Quote Configurator Section */}
      <QuoteCalculator />

      {/* 5. Client Testimonials Section */}
      <Testimonials />

      {/* 6. Standard Agency Contact Form Section */}
      <Contact />
    </motion.div>
  );
};

export default Home;
