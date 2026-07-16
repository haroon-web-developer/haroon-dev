import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import AgencyHero from './AgencyHero';

// Dynamic dynamic imports for below-the-fold components
const StatsSection = lazy(() => import('./StatsSection'));
const SolutionsSection = lazy(() => import('./SolutionsSection'));
const QuoteCalculator = lazy(() => import('./QuoteCalculator'));
const Testimonials = lazy(() => import('./Testimonials'));
const Contact = lazy(() => import('./Contact'));

// Reusable Intersection Observer wrapper for below-the-fold components
const LazySection = ({ children, height = '150px', forceLoad = false }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (forceLoad) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' } // Pre-load 300px before reaching the viewport
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [forceLoad]);

  const shouldRender = isIntersecting || forceLoad;

  return (
    <div ref={ref} style={{ minHeight: shouldRender ? 'auto' : height }} className="w-full">
      {shouldRender ? children : <div style={{ height }} className="bg-[#0a0f1d]" />}
    </div>
  );
};

const Home = () => {
  const [forceLoad, setForceLoad] = useState(false);

  // If page loads with a hash (e.g. dynamic navigation), force load sections to ensure anchors exist
  useEffect(() => {
    if (window.location.hash) {
      setForceLoad(true);
      setTimeout(() => {
        const hash = window.location.hash.replace('#', '');
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  const scrollToQuote = () => {
    setForceLoad(true);
    // Tiny timeout to allow component to render if it wasn't already loaded
    setTimeout(() => {
      const element = document.getElementById('quote-configurator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0f1d] overflow-x-hidden"
    >
      {/* 1. Agency Hero Section (Above the fold - eager) */}
      <AgencyHero onGetQuoteClick={scrollToQuote} />

      {/* 2. Stats Section (Lazy) */}
      <LazySection height="120px" forceLoad={forceLoad}>
        <Suspense fallback={<div className="h-[120px] bg-[#0a0f1d]" />}>
          <StatsSection />
        </Suspense>
      </LazySection>

      {/* 3. Our Solutions Section (Lazy) */}
      <LazySection height="400px" forceLoad={forceLoad}>
        <Suspense fallback={<div className="h-[400px] bg-[#0a0f1d]" />}>
          <SolutionsSection onGetQuoteClick={scrollToQuote} />
        </Suspense>
      </LazySection>

      {/* 4. Instant Quote Configurator Section (Lazy) */}
      <LazySection height="600px" forceLoad={forceLoad}>
        <Suspense fallback={<div className="h-[600px] bg-[#0a0f1d]" />}>
          <QuoteCalculator />
        </Suspense>
      </LazySection>

      {/* 5. Client Testimonials Section (Lazy) */}
      <LazySection height="300px" forceLoad={forceLoad}>
        <Suspense fallback={<div className="h-[300px] bg-[#0a0f1d]" />}>
          <Testimonials />
        </Suspense>
      </LazySection>

      {/* 6. Standard Agency Contact Form Section (Lazy) */}
      <LazySection height="500px" forceLoad={forceLoad}>
        <Suspense fallback={<div className="h-[500px] bg-[#0a0f1d]" />}>
          <Contact />
        </Suspense>
      </LazySection>
    </motion.div>
  );
};

export default Home;
