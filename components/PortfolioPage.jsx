import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Hero from './Hero';
import About from './About';
import Services from './Services';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';

const PortfolioPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to section based on hash anchor (e.g., #about, #services)
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      const element = document.getElementById(hash);
      if (element) {
        // Dynamic wait to ensure components are mounted and fully rendered
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-16 text-white relative">
      {/* Premium ambient light backgrounds */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none print:hidden z-0" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none print:hidden z-0" />

      {/* Sections stacked in sequence according to user's requested layout */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Skills />
        <div className="print:hidden">
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
