import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { solutionsService } from '../services/solutionsService';
import emailjs from '@emailjs/browser';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Field States for Sidebar Inquiry
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  useEffect(() => {
    const fetchSolutionDetails = async () => {
      try {
        setIsLoading(true);
        const data = await solutionsService.getSolution(id);
        setSolution(data);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Service not found or failed to load details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSolutionDetails();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(null);

    // Pre-format the email body to include service context
    const enrichedMessage = `
Service Inquiry: ${solution?.title || 'Unknown Service'}
---------------------------------------------------------
Sender Name: ${formData.name}
Sender Email: ${formData.email}

Message:
${formData.message}
    `;

    const emailPayload = {
      name: formData.name,
      email: formData.email,
      message: enrichedMessage
    };

    emailjs
      .send(
        'service_y5e7nnd',
        'template_73gc59l',
        emailPayload,
        '_sJcsQDbJTLj1WYH2'
      )
      .then(() => {
        setSendSuccess('success');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        setSendSuccess('error');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <Icons.AlertTriangle className="text-rose-500" size={48} />
        <h2 className="text-2xl font-bold text-white">Service Not Found</h2>
        <p className="text-slate-400 max-w-md">{error || "The service you are looking for does not exist or has been removed."}</p>
        <Link to="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition duration-300">
          Return to Home
        </Link>
      </div>
    );
  }

  const IconComponent = Icons[solution.icon] || Icons.Cpu;

  // Generate gorgeous dynamic default values if fields aren't completely populated
  const fallback = {
    overview: solution.description || "A custom engineered digital system built specifically to meet your unique needs.",
    process: [
      { title: "1. Discovery & Blueprint", desc: "We map out your business objectives, data requirements, and user workflows into a clear conceptual architecture." },
      { title: "2. High-Fidelity Engineering", desc: "Clean, performant codebase development utilizing modern modular practices and frameworks." },
      { title: "3. Rigorous Integration & Launch", desc: "Thorough quality checks, performance optimization, and seamless cloud deployment." }
    ],
    whyChooseUs: [
      "Uncompromising security standards with production-grade data storage.",
      "Engineered for raw speed and SEO performance.",
      "Fully responsive and optimized across all viewports (desktop, tablet, mobile).",
      "Direct collaboration with developer Haroon to ensure no communication gaps."
    ],
    techStack: solution.title?.toLowerCase().includes("mern") 
      ? "MongoDB, Express.js, React, Node.js, Tailwind CSS, Firebase, Google Cloud"
      : solution.title?.toLowerCase().includes("ecommerce") || solution.title?.toLowerCase().includes("shopify")
      ? "Next.js, React, Shopify Storefront API, Stripe, Tailwind CSS, PostgreSQL, Vercel"
      : solution.title?.toLowerCase().includes("automation") || solution.title?.toLowerCase().includes("saas")
      ? "React, Firebase Firestore, Node.js, Python, Google Cloud Functions, REST APIs"
      : "React, Tailwind CSS, Framer Motion, Firebase, Lucide Icons, Git"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0f1d] text-white pt-28 pb-20 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
          >
            <Icons.ArrowLeft size={14} />
            <span>Back to main hub</span>
          </Link>
        </div>

        {/* Hero Banner Section */}
        <div className="mb-16 p-8 md:p-12 rounded-3xl bg-slate-900/30 border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-indigo-950/5 to-slate-900/40 pointer-events-none" />
          
          <div className="space-y-4 max-w-3xl relative z-10 text-left">
            <span className="text-xs font-mono font-extrabold tracking-widest text-rose-500 uppercase">
              {solution.tagline || "CORE SPECIALTY"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {solution.title}
            </h1>
            <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
              {solution.description}
            </p>
          </div>

          <div className="flex-shrink-0 relative z-10">
            <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/5 group`}>
              <IconComponent size={44} className="text-rose-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Two Column Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details (2 Columns) */}
          <div className="lg:col-span-2 space-y-12 text-left">
            
            {/* Detailed Description */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
                Detailed Service Overview
              </h2>
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/20 border border-white/5 text-slate-300 text-sm md:text-base leading-relaxed space-y-4 font-light">
                {solution.fullDescription ? (
                  solution.fullDescription.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Our <strong>{solution.title}</strong> service is engineered from the ground up to solve complex modern business requirements. We specialize in building reliable, state-of-the-art architectures that are highly performant, visually cohesive, and optimized to drive real-world conversion rates.
                    </p>
                    <p>
                      By matching elegant visual designs with modular, hardened server states, we deliver solutions that small businesses can scale confidently. We bypass standard monolithic templates in favor of speed, precise customizations, and robust security integrations.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Core Features / Benefits */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
                Key Deliverables & Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(solution.benefits || []).map((b, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-5 rounded-2xl bg-slate-900/20 border border-white/5 flex items-start gap-3.5"
                  >
                    <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 flex-shrink-0">
                      <Icons.Check size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide mb-1">
                        Feature 0{bIdx + 1}
                      </p>
                      <p className="text-sm text-slate-400 font-light">{b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Development Process */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
                Our Step-By-Step Process
              </h2>
              <div className="space-y-4">
                {fallback.process.map((p, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-900/20 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">{p.title}</h4>
                      <p className="text-xs md:text-sm text-slate-400 font-light max-w-xl">{p.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400 px-3 py-1 rounded-full uppercase self-start sm:self-auto font-extrabold tracking-widest">
                      Phase {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-3xl bg-slate-900/20 border border-white/5 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Icons.ShieldAlert size={16} className="text-rose-500" />
                  Performance Guarantee
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-400 font-light">
                  {fallback.whyChooseUs.map((w, wIdx) => (
                    <li key={wIdx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/20 border border-white/5 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Icons.Code size={16} className="text-indigo-400" />
                  Technology Stack
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  We match each requirement with clean-cut, lightning-fast tools selected to offer maximum lifetime and minimal overhead:
                </p>
                <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl">
                  <p className="text-xs font-mono text-indigo-300 leading-relaxed">
                    {fallback.techStack}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Sidebar Inquiry Column (1 Column) */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 space-y-6 sticky top-24 shadow-xl text-left">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-emerald-400 uppercase">
                  DIRECT PROJECT INQUIRY
                </span>
                <h3 className="text-lg font-bold text-white">
                  Request a Custom Quote
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Have a specific vision for a <strong>{solution.title}</strong>? Submit this form, and we will prepare a complete system architecture draft & cost projection for you.
                </p>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label htmlFor="inquiryName" className="text-[10px] font-mono text-slate-400 uppercase font-extrabold">
                    Your Name
                  </label>
                  <input
                    id="inquiryName"
                    type="text"
                    required
                    placeholder="Abc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiryEmail" className="text-[10px] font-mono text-slate-400 uppercase font-extrabold">
                    Your Email
                  </label>
                  <input
                    id="inquiryEmail"
                    type="email"
                    required
                    placeholder="abc@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiryMessage" className="text-[10px] font-mono text-slate-400 uppercase font-extrabold">
                    Project Vision / Details
                  </label>
                  <textarea
                    id="inquiryMessage"
                    required
                    rows={4}
                    placeholder={`Tell us what you'd like to build under this ${solution.title} specialty...`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:border-indigo-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all uppercase tracking-wider font-mono shadow-lg shadow-rose-500/10 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-white mr-1.5" />
                      <span>Sending vision...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Icons.Send size={12} />
                    </>
                  )}
                </button>

                {sendSuccess === "success" && (
                  <p className="text-emerald-400 text-center text-xs font-semibold pt-1">
                    🚀 Vision sent successfully! We'll reply within 24 hours.
                  </p>
                )}
                {sendSuccess === "error" && (
                  <p className="text-rose-400 text-center text-xs font-semibold pt-1">
                    ❌ Submission error. Please email haroonashraf.dev@gmail.com directly.
                  </p>
                )}
              </form>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-2 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  OR TALK VIA EMAIL DIRECTLY
                </span>
                <a
                  href={`mailto:haroonashraf.dev@gmail.com?subject=Inquiry: ${encodeURIComponent(solution.title)}`}
                  className="text-xs text-slate-300 hover:text-rose-400 font-mono transition-colors"
                >
                  haroonashraf.dev@gmail.com
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default ServiceDetailPage;
