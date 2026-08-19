import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, ArrowRight, MessageSquare, MapPin, ShieldCheck, 
  Zap, Star, Layers, Cpu, Award, Globe, 
  ChevronDown, Phone, Mail, ExternalLink, Compass, Laptop, Database
} from 'lucide-react';
import Contact from './Contact';
import Testimonials from './Testimonials';

const IslamabadLandingPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const phone = "923214576734";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent("Hi Haroon, I am looking for a Top-Rated Web Developer in Islamabad for my project.")}`;
  const googleMapsUrl = "https://www.google.com/maps/place/Islamabad,+Islamabad+Capital+Territory,+Pakistan/@33.6844202,73.0478848,12z";

  const sectors = [
    "Sector F-11", "Sector F-10", "Sector F-7 / F-6", "Sector F-8", 
    "Blue Area", "Sector G-11", "Sector I-8", "DHA Islamabad", 
    "Bahria Town", "Gulberg Greens", "Rawalpindi Saddar", "Chaklala Scheme III"
  ];

  const localServices = [
    {
      title: "MERN Stack Web Applications",
      desc: "Full-stack cloud applications engineered with React.js, Node.js, Express, and MongoDB or PostgreSQL for startups and tech companies.",
      icon: Database,
      tag: "HIGH PERFORMANCE"
    },
    {
      title: "Islamabad Corporate & SME Websites",
      desc: "High-converting corporate web portals for law firms, consultancies, real estate developers, and institutions across Blue Area & Islamabad.",
      icon: Laptop,
      tag: "BRAND AUTHORITY"
    },
    {
      title: "E-Commerce with Local PK Gateways",
      desc: "Custom storefronts with seamless JazzCash, EasyPaisa, Bank Alfalah, PayFast, Stripe, and Cash on Delivery (COD) logistics integration.",
      icon: Globe,
      tag: "REVENUE READY"
    },
    {
      title: "Figma to Pixel-Perfect React/Tailwind",
      desc: "Transform UI/UX design files into modular, ultra-responsive, mobile-first code with flawless animations and 100/100 Lighthouse score.",
      icon: Layers,
      tag: "PIXEL ACCURACY"
    },
    {
      title: "Local SEO & Core Web Vitals Optimization",
      desc: "LocalBusiness JSON-LD schema injection, sub-0.8s page speed, and on-page ranking structure so your business dominates Islamabad searches.",
      icon: Zap,
      tag: "GOOGLE #1 RANK"
    },
    {
      title: "Medical, Clinic & Real Estate Portals",
      desc: "Specialized booking engines, lead capture funnels, and property listing platforms built for Islamabad doctors and property agencies.",
      icon: Cpu,
      tag: "LEAD GENERATION"
    }
  ];

  const faqs = [
    {
      q: "Why should I hire a local Islamabad web developer over an anonymous overseas agency?",
      a: "Working with a local developer in Islamabad gives you transparent communication in your timezone, direct WhatsApp and in-person consultations in Islamabad/Rawalpindi (Blue Area, F-11, etc.), deep understanding of local customer behavior in Pakistan, and customized payment gateway setups (JazzCash, EasyPaisa, local banks) that international agencies cannot provide."
    },
    {
      q: "Do you offer in-person project kickoff meetings in Islamabad & Rawalpindi?",
      a: "Yes! For corporate teams, business founders, and agencies located in Islamabad (Blue Area, F-6 to F-11, G-11, DHA, Bahria Town) and Rawalpindi, in-person discovery and project review sessions are available."
    },
    {
      q: "Which Pakistani payment gateways do you support for e-commerce?",
      a: "We implement full integrations with Bank Alfalah IPG, JazzCash, EasyPaisa, PayFast, HBL Pay, Stripe (for international cards), Payoneer, and custom COD (Cash on Delivery) checkout workflows."
    },
    {
      q: "How fast can you build and launch our website?",
      a: "Standard business websites and high-converting landing pages are typically delivered in 5 to 10 business days. Complex full-stack MERN portals and custom SaaS web applications take 2 to 4 weeks, with live milestone reviews throughout the sprint."
    },
    {
      q: "Will my website rank on Google for local Islamabad searches?",
      a: "Every website is engineered with strict Core Web Vitals standards, sub-second load times, mobile-first responsive architecture, and rich LocalBusiness JSON-LD Schema markup specifically registered to Islamabad Capital Territory so Google ranks your brand above competitors."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 selection:bg-indigo-500 selection:text-white pt-24">
      
      {/* 1. Hero Section for Local Intent */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-white/5">
        {/* Background glow highlights */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-left">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-indigo-400">Web Developer Islamabad</span>
          </div>

          <div className="max-w-4xl space-y-6">
            {/* Top Local Trust Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm font-semibold shadow-xl">
              <Star size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
              <span>Top-Rated Web Developer in Islamabad, Pakistan</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Target H1 */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Top-Rated <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400">
                Web Developer in Islamabad
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-3xl">
              Partner with Islamabad's leading freelance full-stack engineer for custom React/MERN stack applications, high-converting business websites, and local SEO dominance across Islamabad & Rawalpindi.
            </p>

            {/* Local trust markers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-xs font-mono text-indigo-400 font-bold">LOCATION</p>
                <p className="text-sm font-bold text-white mt-0.5">Islamabad, PK</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-xs font-mono text-emerald-400 font-bold">LOAD SPEED</p>
                <p className="text-sm font-bold text-white mt-0.5">&lt; 0.8s Core Vitals</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-xs font-mono text-rose-400 font-bold">MEETINGS</p>
                <p className="text-sm font-bold text-white mt-0.5">In-Person & Video</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-xs font-mono text-amber-400 font-bold">SUCCESS RATE</p>
                <p className="text-sm font-bold text-white mt-0.5">100% 5-Star Delivery</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#128C7E] hover:bg-[#075e54] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#128C7E]/20 transition-all transform hover:-translate-y-0.5"
              >
                <MessageSquare size={18} />
                <span>WhatsApp Haroon Direct</span>
              </a>

              <a
                href="#contact"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Request Project Proposal</span>
                <ArrowRight size={18} />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Operational Zones in Islamabad & Rawalpindi */}
      <section className="py-16 bg-[#080d1a] border-b border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                COVERAGE & SERVICE RADIUS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Serving Clients Across Islamabad & Rawalpindi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Available for onsite strategy consultations, corporate briefings, and ongoing digital maintenance across the Twin Cities.
            </p>
          </div>

          {/* Sector Chips */}
          <div className="flex flex-wrap gap-2.5">
            {sectors.map((sector, i) => (
              <div 
                key={i}
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-2 hover:border-indigo-500/40 hover:text-white transition"
              >
                <MapPin size={13} className="text-rose-400 flex-shrink-0" />
                <span>{sector}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Local Services Suite */}
      <section className="py-20 bg-[#0a0f1d] relative text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase">
              COMPREHENSIVE WEB SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">
              Engineered for Islamabad's Growing Businesses
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              From corporate headquarters in Blue Area to vibrant e-commerce startups in F-11 and Bahria Town, we engineer high-performance web systems that convert visitors into revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-7 rounded-3xl bg-slate-900/40 border border-white/10 hover:border-indigo-500/30 hover:bg-slate-900/70 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-indigo-400 transition-colors">
                        {srv.tag}
                      </span>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                        <Icon size={20} className="text-white group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition">
                    <span>Learn more</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Why Local Businesses in Islamabad Choose Haroon Dev */}
      <section className="py-20 bg-[#080d1a] border-y border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                THE LOCAL ADVANTAGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Why Islamabad Companies Partner Directly with Haroon Dev
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Avoid the bureaucracy, marked-up agency overhead, and communication friction. You collaborate directly with a senior engineer dedicated to your project's business impact.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Direct Access to the Senior Engineer",
                    desc: "No middlemen, account managers, or outsourced junior devs. Every line of code is written with precision."
                  },
                  {
                    title: "Local Knowledge & Payment Gateway Mastery",
                    desc: "Deep integration with Pakistani banking systems, COD workflows, and Islamabad market psychology."
                  },
                  {
                    title: "Sub-Second Page Load Speed (Core Web Vitals)",
                    desc: "Faster websites mean higher Google search rankings and lower bounce rates on mobile 4G/5G connections."
                  },
                  {
                    title: "30-Day Post-Launch Warranty & Handover",
                    desc: "Complete documentation, code repository ownership, and complimentary 30-day technical support."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card / Local Authority Card */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Haroon Ashraf</h3>
                    <p className="text-xs text-slate-400 font-mono">Lead Full-Stack Developer • Islamabad, PK</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400 font-mono">
                      20+
                    </span>
                    <p className="text-xs text-slate-400 font-medium mt-1">Websites Delivered</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
                      100%
                    </span>
                    <p className="text-xs text-slate-400 font-medium mt-1">Client Satisfaction</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Base of Operations:</span>
                    <span className="font-bold text-white">Islamabad Capital Territory</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Direct Contact:</span>
                    <span className="font-bold text-white">+92 321 4576734</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-400 font-mono">Core Frameworks:</span>
                    <span className="font-bold text-indigo-300">React, Node.js, Tailwind, Next.js</span>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare size={15} />
                  <span>Start Instant WhatsApp Consultation</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Islamabad Frequently Asked Questions (FAQ) */}
      <section className="py-20 bg-[#0a0f1d] text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              TRANSPARENT & RELIABLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Islamabad Web Development FAQs
            </h2>
            <p className="text-slate-400 text-sm">
              Answers to common queries regarding pricing, in-person meetups, timelines, and payment options.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/40 border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                  >
                    <span className="text-sm sm:text-base font-bold text-white pr-2">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-indigo-400 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-light border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Keyword-Rich Verified Client Reviews & Citations */}
      <Testimonials />

      {/* 7. Embedded Google Map & Contact Section */}
      <Contact />

    </div>
  );
};

export default IslamabadLandingPage;
