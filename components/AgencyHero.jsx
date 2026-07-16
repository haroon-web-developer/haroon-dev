import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, MessageSquare, ShieldCheck, Zap, Layers, Star, Globe, CheckCircle, Lock, TrendingUp
} from 'lucide-react';

// Extracted Interactive Mockup Showcase Component for elegant code reuse
const MockupShowcase = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative w-full max-w-[480px] aspect-[1.1] flex items-center justify-center mx-auto"
    >
      {/* Spinning Grid Globe backdrop */}
      <div className="absolute inset-0 rounded-full border border-white/5 bg-[#060a17]/50 backdrop-blur-3xl p-6 shadow-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none select-none">
          {/* Outer Orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-[95%] h-[95%] rounded-full border border-indigo-500/10 border-dashed"
          />
          
          {/* Outer wireframe */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute w-[85%] h-[85%] flex items-center justify-center opacity-30"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-500/40">
              <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="2" y1="100" x2="198" y2="100" stroke="currentColor" strokeWidth="0.5" />
              <path d="M13 60 Q100 80 187 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <path d="M13 140 Q100 120 187 140" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <path d="M30 40 Q100 60 170 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M30 160 Q100 140 170 160" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <ellipse cx="100" cy="100" rx="30" ry="98" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <ellipse cx="100" cy="100" rx="60" ry="98" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
              <ellipse cx="100" cy="100" rx="80" ry="98" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Main Laptop Screen Mockup */}
      <motion.div
        whileHover={{ y: -8, rotate: -0.5 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute w-[88%] aspect-[1.5] rounded-2xl bg-[#090e1f] border border-white/10 shadow-2xl overflow-hidden z-20 left-[2%] top-[6%] transform -rotate-1"
      >
        {/* Top browser bar */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5 bg-slate-950/90">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
            <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
            <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-0.5 bg-white/5 border border-white/5 rounded-md text-[8px] text-indigo-300 font-mono w-[58%] justify-center">
            <Lock size={8} className="text-emerald-400 flex-shrink-0" />
            <span className="truncate">haroon-dev.com/growth</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[6px] text-emerald-400 font-bold font-mono">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span>SECURE</span>
          </div>
        </div>

        {/* Dashboard Panel */}
        <div className="flex h-[calc(100%-37px)] text-left">
          {/* Sidebar Mockup */}
          <div className="w-[20%] border-r border-white/5 bg-slate-950/40 p-2 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-[7px] font-black tracking-widest text-indigo-400 font-mono">SYSTEM</div>
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-indigo-500/10 rounded flex items-center px-1 text-[5px] text-indigo-300 font-bold">Performance</div>
                <div className="h-2.5 w-5/6 bg-white/[0.02] rounded" />
                <div className="h-2.5 w-4/5 bg-white/[0.02] rounded" />
              </div>
            </div>
            <div className="h-4 bg-slate-900 border border-white/5 rounded flex items-center px-1 gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="w-4 h-1 bg-white/20 rounded" />
            </div>
          </div>

          {/* Main graph panel */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-white flex items-center gap-1">
                <span>Speed Metrics</span>
                <Globe size={8} className="text-slate-400" />
              </span>
              <span className="text-[6px] text-indigo-400 font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 px-1 py-0.5 rounded">STABLE</span>
            </div>

            {/* SVG Sparkline Graph */}
            <div className="relative h-[48px] w-full bg-slate-950/80 border border-white/5 rounded-lg overflow-hidden p-1.5 mt-1.5">
              <div className="absolute top-1 left-2 text-[5px] font-mono text-slate-500">BOUNCE RATE OPTIMIZATION</div>
              <div className="absolute top-1 right-2 text-[5px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                <span>-42.5% Improvement</span>
              </div>
              <svg className="w-full h-full pt-1.5" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 28 C10 18, 25 24, 40 8 C55 12, 70 3, 85 5 L100 1 L100 30 L0 30 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0 28 C10 18, 25 24, 40 8 C55 12, 70 3, 85 5 L100 1"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* KPI statistics */}
            <div className="grid grid-cols-3 gap-1.5 pt-1.5">
              <div className="bg-slate-950/50 border border-white/5 rounded-md p-1.5 flex flex-col justify-between">
                <span className="text-[4.5px] text-indigo-400 font-bold font-mono">CONVERSION</span>
                <span className="text-[9px] font-black text-white">+38.5%</span>
              </div>
              <div className="bg-slate-950/50 border border-white/5 rounded-md p-1.5 flex flex-col justify-between">
                <span className="text-[4.5px] text-rose-400 font-bold font-mono">BOUNCE</span>
                <span className="text-[9px] font-black text-white">-24.1%</span>
              </div>
              <div className="bg-slate-950/50 border border-white/5 rounded-md p-1.5 flex flex-col justify-between">
                <span className="text-[4.5px] text-amber-400 font-bold font-mono">LOAD TIME</span>
                <span className="text-[9px] font-black text-white">0.68s</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlapping Mobile Showcase Screen */}
      <motion.div
        whileHover={{ y: -10, rotate: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute w-[36%] aspect-[0.5] rounded-3xl bg-slate-950 border-[5px] border-slate-800 shadow-2xl overflow-hidden z-30 right-[2%] bottom-[2%] transform rotate-1"
      >
        {/* Screen Notch */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 h-3 w-12 bg-slate-950 rounded-full z-40 border border-white/5" />

        {/* Mobile Header status */}
        <div className="flex justify-between items-center px-3 pt-4 pb-1 text-[5.5px] font-bold text-slate-400">
          <span>09:41</span>
          <span>5G</span>
        </div>

        {/* Mini Web Studio Service / Sprint Portal Layout */}
        <div className="p-2.5 space-y-2 mt-0.5 text-left relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black tracking-wider text-indigo-400 font-mono uppercase">ACTIVE SPRINT</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          </div>
          
          {/* Project progress Card */}
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-[5.5px] text-slate-300 font-bold">
              <span>SaaS CRM Dashboard</span>
              <span className="text-emerald-400 font-mono">94%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[94%] bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
            </div>
          </div>

          {/* Feature Checklist */}
          <div className="space-y-1">
            <div className="text-[5.5px] font-bold text-slate-400 tracking-wider uppercase font-mono">DELIVERABLES</div>
            <div className="space-y-0.5 text-[5px] text-slate-300">
              <div className="flex items-center gap-1">
                <CheckCircle size={6} className="text-emerald-400 flex-shrink-0" />
                <span>Responsive Next.js UI</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={6} className="text-emerald-400 flex-shrink-0" />
                <span>Admin Analytics API</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={6} className="text-emerald-400 flex-shrink-0" />
                <span>Stripe Custom Gateway</span>
              </div>
            </div>
          </div>

          {/* Core Metrics Row */}
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <div className="bg-slate-900/60 border border-white/5 rounded p-1 flex flex-col justify-center">
              <span className="text-[4px] text-indigo-400 font-mono">SPEED TEST</span>
              <span className="text-[6.5px] font-bold text-emerald-400">0.42s Load</span>
            </div>
            <div className="bg-slate-900/60 border border-white/5 rounded p-1 flex flex-col justify-center">
              <span className="text-[4px] text-rose-400 font-mono">SEO SCORE</span>
              <span className="text-[6.5px] font-bold text-white">100/100</span>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="h-5.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-md flex items-center justify-center shadow shadow-indigo-600/20 cursor-pointer">
            <span className="text-[6px] font-black text-white tracking-wider">LAUNCH SPRINT</span>
          </div>
        </div>
      </motion.div>

      {/* Technical Float Badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute right-[-2%] top-[24%] z-40 bg-[#0d1425]/90 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
        <span className="text-[10px] font-bold font-mono tracking-wide text-indigo-300">REACT & NEXT.JS</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute left-[-2%] bottom-[12%] z-40 bg-[#0d1425]/90 border border-rose-500/20 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        <span className="text-[10px] font-bold font-mono tracking-wide text-rose-300">MERN STACK</span>
      </motion.div>
    </motion.div>
  );
};

const AgencyHero = ({ onGetQuoteClick }) => {
  const phone = "923214576734";
  const message = "Hey, I saw your agency services and I am looking to develop a custom website for my business. Let's connect!";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-14 pb-8 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-[#0a0f1d] text-white">
      {/* Premium ambient light orbs matching portfolio depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-12 right-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Cybernetic Dot & Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full flex flex-col justify-center">
        
        {/* Mobile display: Futuristic Quick Access Pill */}
        <div className="block lg:hidden mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-between py-1 px-1.5 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl shadow-xl shadow-indigo-950/40 max-w-sm mx-auto"
          >
            <div className="flex items-center gap-1.5 pl-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 font-extrabold uppercase">AGENCY PANEL</span>
            </div>
            
            <div className="flex items-center gap-1">
              <a
                href="#solutions"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('solutions');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer font-sans"
              >
                <Layers size={10} className="text-indigo-400" />
                <span>Solutions</span>
              </a>
              <Link
                to="/portfolio"
                className="px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20 active:scale-95 font-sans"
              >
                <Star size={10} className="text-amber-300 fill-amber-300/30 animate-pulse" />
                <span>Portfolio</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Copywriting & High Conversion CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-8 text-left flex flex-col justify-center">
            
            {/* Tagline/Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center self-start gap-2.5 px-4 py-2 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 text-xs font-semibold shadow-inner"
            >
              <Star size={13} className="text-indigo-400 fill-indigo-400/20 animate-spin-slow" />
              <span className="tracking-wide">Islamabad's Premier Web Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>
 
            {/* Massive Headline with Premium Contrast */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[26px] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] sm:leading-[1.05]"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                  We Build Premium,
                </span>{" "}
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 drop-shadow-[0_2px_20px_rgba(129,140,248,0.25)]">
                  High-Performance Web.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed"
              >
                We specialize in creating lightning-fast, secure, SEO-optimized React & MERN stack web solutions that capture leads, increase user engagement, and accelerate business growth.
              </motion.p>
            </div>

            {/* Core Value Pillars - Displayed on tablet and desktop */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-slate-300"
            >
              {[
                { text: "Custom MERN Stack Web Apps", desc: "Tailored to scale effortlessly" },
                { text: "Figma to Responsive Code", desc: "Pixel-perfect conversion" },
                { text: "0.8s Ultra-Fast Load Times", desc: "Core Web Vitals optimized" },
                { text: "SEO Schema & Conversion Ready", desc: "Built to rank on Google search" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle size={12} className="text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Showcase Mockup - Displayed ONLY on mobile screen instead of value pillars */}
            <div className="block sm:hidden w-full my-4">
              <MockupShowcase />
            </div>

            {/* Responsive Action CTAs with Glow and Shadows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <button
                onClick={onGetQuoteClick}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:via-purple-500 hover:to-rose-500 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
              >
                <span>Get Free Project Quote</span>
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={16} />
              </button>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-4 bg-[#128C7E] hover:bg-[#075e54] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#128C7E]/20 transition-all transform hover:-translate-y-0.5 active:scale-98"
              >
                <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                <span>WhatsApp Expert</span>
              </a>
            </motion.div>

            {/* Validation Badges / Technical trust markers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4 border-t border-white/5 mt-4 sm:pt-6 sm:mt-6 flex flex-row flex-nowrap items-center justify-between sm:justify-start gap-1 sm:gap-x-6 text-slate-400 text-[7.5px] xs:text-[9px] sm:text-xs font-mono w-full"
            >
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/30 px-1 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/5 flex-1 sm:flex-initial justify-center sm:justify-start whitespace-nowrap min-w-0">
                <ShieldCheck className="text-indigo-400 flex-shrink-0 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="truncate">100% Handover & Security</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/30 px-1 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/5 flex-1 sm:flex-initial justify-center sm:justify-start whitespace-nowrap min-w-0">
                <Zap className="text-amber-400 animate-pulse flex-shrink-0 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="truncate">Free 30-Day Support Period</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/30 px-1 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/5 flex-1 sm:flex-initial justify-center sm:justify-start whitespace-nowrap min-w-0">
                <TrendingUp className="text-emerald-400 flex-shrink-0 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="truncate">SEO Schema Ready</span>
              </div>
            </motion.div>

          </div>

          {/* Right Side: Showcase Mockup Showcase Stack - Hidden on Mobile */}
          <div className="hidden sm:flex lg:col-span-5 relative items-center justify-center mt-4 lg:mt-0">
            {/* Ambient Backlight for Visual Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
            <MockupShowcase />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AgencyHero;
