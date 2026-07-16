import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { testimonialsService } from '../services/testimonialsService';

const Testimonials = () => {
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsService.getTestimonials();
        setTestimonialsList(data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handlePrev = () => {
    if (testimonialsList.length === 0) return;
    setActiveIndex(prev => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const handleNext = () => {
    if (testimonialsList.length === 0) return;
    setActiveIndex(prev => (prev + 1) % testimonialsList.length);
  };

  // Auto-slide
  useEffect(() => {
    if (testimonialsList.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonialsList]);

  if (isLoading) {
    return (
      <div className="py-24 bg-[#0c122c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (testimonialsList.length === 0) {
    return null; // Don't render if empty
  }

  const activeTestimonial = testimonialsList[activeIndex];

  return (
    <section className="py-24 bg-[#0c122c] border-t border-white/5 relative overflow-hidden">
      {/* Background visual glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        
        {/* Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <Icons.Sparkles size={14} className="text-amber-400" />
          <span className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
            CLIENT TESTIMONIALS
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-16">
          Loved By Real Business Owners
        </h2>

        {/* Slider Box */}
        <div className="relative bg-[#0d1425]/60 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-xl min-h-75 flex flex-col justify-between">
          
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 text-indigo-500/10 pointer-events-none">
            <Icons.Quote size={80} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 flex flex-col justify-between h-full"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 text-amber-400">
                {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                  <Icons.Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-300 text-sm md:text-lg font-light leading-relaxed italic max-w-2xl mx-auto text-center">
                "{activeTestimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4 pt-4">
                {activeTestimonial.avatar && (
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full border border-white/10 object-cover"
                  />
                )}
                <div className="text-left">
                  <h4 className="font-bold text-white text-sm md:text-base">
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-slate-500 text-xs md:text-sm">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handlePrev}
              className="p-2 border border-white/5 hover:border-white/10 rounded-xl bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer select-none"
              aria-label="Previous Testimonial"
            >
              <Icons.ChevronLeft size={16} />
            </button>

            <span className="text-xs font-mono text-slate-500">
              0{activeIndex + 1} / 0{testimonialsList.length}
            </span>

            <button
              onClick={handleNext}
              className="p-2 border border-white/5 hover:border-white/10 rounded-xl bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer select-none"
              aria-label="Next Testimonial"
            >
              <Icons.ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
