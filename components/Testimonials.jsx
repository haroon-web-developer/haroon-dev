import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Star, Quote, ChevronLeft, ChevronRight, MapPin, 
  ShieldCheck, CheckCircle, PlusCircle, ExternalLink, Copy, Check, MessageSquare, X 
} from 'lucide-react';
import { testimonialsService } from '../services/testimonialsService';

const Testimonials = () => {
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    location: 'Islamabad, Pakistan',
    projectType: 'Web Development / E-Commerce',
    text: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    if (testimonialsList.length <= 1 || showReviewModal) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [testimonialsList, showReviewModal]);

  const handleCopyTemplate = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const added = await testimonialsService.addTestimonial(newReview);
      setTestimonialsList(prev => [added, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReviewModal(false);
        setNewReview({
          name: '',
          role: '',
          location: 'Sector F-11, Islamabad',
          projectType: 'Web Development / E-Commerce',
          text: '',
          rating: 5
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const sampleTemplateText = "Haroon-Dev built an excellent custom e-commerce website for my business in Islamabad. Sub-0.8s speed, smooth payment integration, and top-tier local support!";

  const citations = [
    {
      source: "Google Business Profile",
      label: "Islamabad, PK Verified",
      score: "5.0 ★★★★★",
      sub: "Local Authority Anchor",
      link: "https://maps.google.com/maps?q=Sector+F-11,+Islamabad,+Pakistan"
    },
    {
      source: "Clutch Directory",
      label: "Top Web Developer",
      score: "Top 1% React Engineer",
      sub: "Twin Cities Verified",
      link: "#"
    },
    {
      source: "Upwork Global",
      label: "Top Rated Plus",
      score: "100% Job Success",
      sub: "Enterprise Standard",
      link: "#"
    },
    {
      source: "Core Web Vitals",
      label: "Google Certified",
      score: "99+ Mobile Speed",
      sub: "Sub-0.8s Performance",
      link: "#"
    }
  ];

  if (isLoading) {
    return (
      <div className="py-24 bg-[#0a0f1d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (testimonialsList.length === 0) {
    return null;
  }

  const activeTestimonial = testimonialsList[activeIndex];

  return (
    <section className="py-24 bg-[#0a0f1d] border-t border-white/5 relative overflow-hidden text-left">
      {/* Background visual glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>VERIFIED REVIEWS & CITATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Trusted by Islamabad Businesses <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400">
                & Global Leaders.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Leave a Client Review</span>
            </button>
          </div>
        </div>

        {/* 1. Main Keyword-Rich Review Slider */}
        <div className="relative bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-xl mb-12 shadow-2xl overflow-hidden">
          
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 text-indigo-500/10 pointer-events-none">
            <Quote size={80} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 flex flex-col justify-between min-h-[220px]"
            >
              {/* Stars & Location Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-2">5.0 / 5.0</span>
                </div>

                {activeTestimonial.location && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-300">
                    <MapPin size={12} className="text-rose-400" />
                    <span>{activeTestimonial.location}</span>
                  </div>
                )}
              </div>

              {/* Review Text */}
              <p className="text-slate-200 text-base sm:text-lg md:text-xl font-light leading-relaxed italic">
                "{activeTestimonial.text}"
              </p>

              {/* Author & Project Scope */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                  {activeTestimonial.avatar ? (
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                      {activeTestimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      {activeTestimonial.name}
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>

                {activeTestimonial.projectType && (
                  <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 self-start sm:self-center">
                    {activeTestimonial.projectType}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            <span className="text-xs font-mono text-slate-500">
              Verified Review 0{activeIndex + 1} of 0{testimonialsList.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 border border-white/10 hover:border-white/20 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={handleNext}
                className="p-2.5 border border-white/10 hover:border-white/20 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* 2. Local Citations & Industry Accreditations Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {citations.map((cite, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/20 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                  <span>{cite.source}</span>
                  <ShieldCheck size={14} className="text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {cite.label}
                </h4>
                <p className="text-xs font-semibold text-amber-400 font-mono">
                  {cite.score}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-white/5">
                {cite.sub}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* 3. Leave a Review Modal with Keyword Guide */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <span>Submit Client Review</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your feedback helps other businesses in Islamabad and worldwide find trusted web development services.
              </p>
            </div>

            {/* Keyword Suggestion Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 font-mono text-[11px]">
                  PRO-TIP: LOCAL KEYWORD TEMPLATE
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyTemplate(sampleTemplateText)}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-200 transition font-mono"
                >
                  {copiedTemplate ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedTemplate ? "Copied!" : "Copy Template"}</span>
                </button>
              </div>
              <p className="italic text-slate-400 text-[11px] leading-relaxed">
                "{sampleTemplateText}"
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Tariq"
                  value={newReview.name}
                  onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder, ABC Retail"
                    value={newReview.role}
                    onChange={e => setNewReview({ ...newReview, role: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / Sector</label>
                  <input
                    type="text"
                    placeholder="e.g. Sector F-11, Islamabad"
                    value={newReview.location}
                    onChange={e => setNewReview({ ...newReview, location: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Type</label>
                <input
                  type="text"
                  placeholder="e.g. MERN Stack App / E-Commerce"
                  value={newReview.projectType}
                  onChange={e => setNewReview({ ...newReview, projectType: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Review *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your project, speed improvements, and experience working with Haroon-Dev in Islamabad..."
                  value={newReview.text}
                  onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm"
              >
                <span>{submitting ? "Submitting Review..." : "Publish Review"}</span>
                <CheckCircle size={16} />
              </button>

              {submitSuccess && (
                <p className="text-emerald-400 text-center font-semibold pt-2 text-xs">
                  ✅ Thank you! Your review has been recorded.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      )}

    </section>
  );
};

export default Testimonials;
