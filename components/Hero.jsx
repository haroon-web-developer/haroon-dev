import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, Library, ChevronRight, ChevronLeft, Zap, Trophy, ShieldCheck, Users, ExternalLink } from 'lucide-react';
import { projects } from '../services/projectsData';
import { projectsService } from '../services/projectsService';

const getProjectBookStyles = (proj) => {
  if (proj.color && proj.spineColor) {
    return {
      color: proj.color,
      spineColor: proj.spineColor,
      accentColor: proj.accentColor || "text-indigo-400",
      ribbonColor: proj.ribbonColor || "bg-indigo-500",
      badgeGlow: proj.badgeGlow || "shadow-indigo-500/20"
    };
  }

  const highlight = proj.highlightColor || "from-blue-500 to-indigo-500";
  
  if (highlight.includes("blue") || highlight.includes("indigo")) {
    return {
      color: "from-[#070b12] via-[#091833] to-[#0f2e5c]",
      spineColor: "bg-[#0b1a33]",
      accentColor: "text-blue-400",
      ribbonColor: "bg-blue-500",
      badgeGlow: "shadow-blue-500/20"
    };
  }
  
  if (highlight.includes("purple") || highlight.includes("pink") || highlight.includes("violet")) {
    return {
      color: "from-[#0e0717] via-[#210933] to-[#450f5c]",
      spineColor: "bg-[#200b33]",
      accentColor: "text-purple-400",
      ribbonColor: "bg-purple-500",
      badgeGlow: "shadow-purple-500/20"
    };
  }
  
  if (highlight.includes("rose") || highlight.includes("red")) {
    return {
      color: "from-slate-950 via-[#3d081b] to-[#6e0d30]",
      spineColor: "bg-[#38091c]",
      accentColor: "text-rose-400",
      ribbonColor: "bg-rose-500",
      badgeGlow: "shadow-rose-500/20"
    };
  }
  
  if (highlight.includes("emerald") || highlight.includes("teal") || highlight.includes("green")) {
    return {
      color: "from-[#02080a] via-[#043325] to-[#0d4a2d]",
      spineColor: "bg-[#052b20]",
      accentColor: "text-emerald-400",
      ribbonColor: "bg-emerald-500",
      badgeGlow: "shadow-emerald-500/20"
    };
  }
  
  if (highlight.includes("amber") || highlight.includes("orange") || highlight.includes("yellow")) {
    return {
      color: "from-[#0a0502] via-[#3d1a08] to-[#6e320d]",
      spineColor: "bg-[#33180b]",
      accentColor: "text-amber-400",
      ribbonColor: "bg-amber-500",
      badgeGlow: "shadow-amber-500/20"
    };
  }

  return {
    color: "from-[#070b12] via-[#0c1425] to-[#1a284c]",
    spineColor: "bg-[#0d1526]",
    accentColor: "text-indigo-400",
    ribbonColor: "bg-indigo-500",
    badgeGlow: "shadow-indigo-500/20"
  };
};

const AnimatedCodeWindow = () => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const codeLines = [
    { text: "const client = new WebAppOptimizer({ seoBoost: true });", color: "text-indigo-300" },
    { text: "await client.maximizeConversion({ focus: 'sales' });", color: "text-purple-300" },
    { text: "// Metrics: Load speed < 0.8s, Bounce rate -42%", color: "text-emerald-400 font-medium font-mono" },
    { text: "console.log('🚀 Revenue engine active & fully responsive!');", color: "text-amber-300" }
  ];

  useEffect(() => {
    let timer;
    if (currentLineIndex < codeLines.length) {
      const lineText = codeLines[currentLineIndex].text;
      if (currentCharIndex < lineText.length) {
        timer = setTimeout(() => {
          setDisplayedLines(prev => {
            const next = [...prev];
            if (!next[currentLineIndex]) {
              next[currentLineIndex] = { text: "", color: codeLines[currentLineIndex].color };
            }
            next[currentLineIndex] = {
              text: (next[currentLineIndex]?.text || "") + lineText[currentCharIndex],
              color: codeLines[currentLineIndex].color
            };
            return next;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, 30);
      } else {
        timer = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 1200);
      }
    } else {
      timer = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex]);

  return (
    <div className="space-y-1.5 font-mono text-[10px] sm:text-[11px] leading-relaxed select-none">
      {displayedLines.map((line, idx) => (
        <div key={idx} className={`${line.color} flex items-start gap-1 sm:gap-2`}>
          <span className="text-slate-600 select-none w-4 text-right">{idx + 1}</span>
          <span className="break-all">
            {line.text}
            {idx === currentLineIndex && (
              <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-0.5 animate-pulse" />
            )}
          </span>
        </div>
      ))}
      {displayedLines.length < codeLines.length && currentLineIndex < codeLines.length && !displayedLines[currentLineIndex] && (
        <div className="flex items-start gap-1 sm:gap-2">
          <span className="text-slate-600 select-none w-4 text-right">{currentLineIndex + 1}</span>
          <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-0.5 animate-pulse" />
        </div>
      )}
    </div>
  );
};

const Hero = () => {
  const phone = "923214576734";
  const message = "Hey, I am looking to develop a high-performance website for my business. Let's connect to discuss our project requirements and timeline.";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  const [featuredProjects, setFeaturedProjects] = useState(() => 
    projects.filter(p => p.featured)
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null); // 'left' | 'right' | 'up' | 'down' | null
  const [dragDistance, setDragDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Live load from projectsService
  useEffect(() => {
    const unsubscribe = projectsService.subscribeProjects((allProjects) => {
      const featured = allProjects.filter(p => p.featured);
      setFeaturedProjects(featured);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Monitor viewport size to adjust 3D offsets dynamically
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto rotate selected showreel books
  useEffect(() => {
    if (isHovered || isDragging || featuredProjects.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, featuredProjects.length]);

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (featuredProjects.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (featuredProjects.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % featuredProjects.length);
  };

  // Fine-tuned positional variants mimicking high-end layered book case
  const positions = isMobile ? [
    { // Active front book
      x: 0,
      y: 0,
      scale: 1,
      rotateY: -9,
      rotateX: 5,
      rotateZ: 0,
      opacity: 1,
      zIndex: 40,
    },
    { // Underlaying stacked book 1
      x: 11,
      y: -8,
      scale: 0.94,
      rotateY: -12,
      rotateX: 7,
      rotateZ: 0.8,
      opacity: 0.88,
      zIndex: 30,
    },
    { // Underlaying stacked book 2
      x: 22,
      y: -16,
      scale: 0.88,
      rotateY: -15,
      rotateX: 9,
      rotateZ: 1.6,
      opacity: 0.58,
      zIndex: 20,
    },
    { // Hidden back transitioning state
      x: -45,
      y: 30,
      scale: 0.8,
      rotateY: -18,
      rotateX: 11,
      rotateZ: -2,
      opacity: 0,
      zIndex: 10,
    }
  ] : [
    { // Active front book
      x: 0,
      y: 0,
      scale: 1,
      rotateY: -11,
      rotateX: 6,
      rotateZ: 0,
      opacity: 1,
      zIndex: 40,
    },
    { // Underlaying stacked book 1
      x: 22,
      y: -16,
      scale: 0.95,
      rotateY: -14,
      rotateX: 8,
      rotateZ: 1,
      opacity: 0.88,
      zIndex: 30,
    },
    { // Underlaying stacked book 2
      x: 44,
      y: -32,
      scale: 0.90,
      rotateY: -18,
      rotateX: 10,
      rotateZ: 2,
      opacity: 0.58,
      zIndex: 20,
    },
    { // Hidden back transitioning state
      x: -120,
      y: 60,
      scale: 0.8,
      rotateY: -25,
      rotateX: 14,
      rotateZ: -5,
      opacity: 0,
      zIndex: 10,
    }
  ];

  return (
    <section className="relative min-h-[60vh] flex flex-col justify-center pt-6 pb-8 sm:pt-8 md:pt-8 lg:pt-10 sm:pb-16 lg:pb-20 overflow-hidden bg-slate-950">
      {/* Premium ambient light backgrounds (optimized as static to avoid composition lag) */}
      <div className="absolute top-12 -left-20 w-80 h-80 md:w-112.5 md:h-112.5 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none will-change-transform" />
      <div className="absolute bottom-12 -right-20 w-80 h-80 md:w-112.5 md:h-112.5 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none will-change-transform" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">

        {/* Stack layout on mobile and standard side-by-side grid on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-4 lg:gap-6 xl:gap-8 md:items-start items-center">
          
          {/* Left Side Content - Placed first on both mobile (order-1) and desktop (md:order-1) for a clean, professional flow */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7 text-left space-y-4 sm:space-y-6 flex flex-col order-1 md:order-1">
            
            {/* Professional Status Badge - Clean and responsive for both mobile and desktop */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center self-start space-x-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-linear-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] sm:text-xs font-semibold shadow-sm"
            >
             
             
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Freelance Web Developer </span>
          
            </motion.div>

            {/* Big Premium Catchy Title - Fully responsive sizing for both mobile and desktop */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6.5xl font-black tracking-tight text-white leading-tight sm:leading-[1.1]"
              >
                We Build High-Performance Web Assets{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-500">
                  That Convert Visitors Into Customers.
                </span>
              </motion.h1>
            </div>

            {/* New value hook paragraphs from screenshot */}
            <div className="space-y-3 sm:space-y-4 max-w-xl text-left">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-slate-300 text-[9.5px] xs:text-[11.5px] sm:text-sm md:text-base lg:text-lg leading-relaxed font-normal"
              >
                If you're a business owner, I help you turn your website into a simple system that brings real inquiries — fast, mobile-friendly, and easy to use.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-slate-400 text-[9.5px] xs:text-[11.5px] sm:text-sm md:text-base lg:text-lg leading-relaxed font-light"
              >
                I mainly work with small businesses, service providers, and startups.
              </motion.p>
            </div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-row items-center gap-1.5 sm:gap-4 pt-1 sm:pt-2"
            >
              <a
                href="#projects"
                className="group px-2.5 py-1.5 xs:px-3 xs:py-2.5 sm:px-6 sm:py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-md sm:rounded-xl text-[8.5px] xs:text-[10px] sm:text-sm font-bold flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
              >
                Explore Case Studies
                <ArrowRight className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" size={11} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 xs:px-3 xs:py-2.5 sm:px-6 sm:py-3.5 bg-slate-950/60 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-md sm:rounded-xl text-[8.5px] xs:text-[10px] sm:text-sm font-bold text-center transition-all hover:text-white"
              >
                Let’s talk about your project
              </a>
            </motion.div>

            {/* Subtle Divider & Screenshot Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="w-full max-w-xl text-left"
            >
              <div className="w-2/3 sm:w-full border-t border-white/10 pt-3 mt-3 sm:pt-4 sm:mt-4" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-slate-400 text-[8px] xs:text-[9.5px] sm:text-[11px] md:text-xs">
                <div className="flex items-center space-x-1.5">
                  <Users size={12} className="text-indigo-400 shrink-0" />
                  <span className="text-slate-400">Built for real business results</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Zap size={11} className="text-amber-400 shrink-0 animate-pulse" />
                  <span className="text-slate-400">Fast & mobile optimized</span>
                </div>
              </div>
            </motion.div>

            {/* Professional Animated Code Window to fill the left-side bottom space on large screens */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="hidden md:block mt-6 w-full max-w-lg rounded-xl border border-slate-800/60 bg-slate-950/30 p-3 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm group border-l-2 border-l-indigo-500/30"
            >
              {/* Backlight shine glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
              
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  <span className="text-[9px] text-slate-500 font-mono ml-1">conversion_metrics.js</span>
                </div>
                <div className="flex items-center space-x-1 text-[8px] tracking-wider text-indigo-400 font-bold uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-ping mr-1" />
                  <span>LIVE COMPILING</span>
                </div>
              </div>
              
              {/* Animated Code Component */}
              <AnimatedCodeWindow />
            </motion.div>

          </div>

          {/* Right Side - Premium Interactive 3D Book Cover Stack & Selector - Shifted up on desktop, aligned to the right, stacking vertically */}
          <div 
            className="col-span-12 md:col-span-5 lg:col-span-5 flex flex-col gap-6 items-center md:items-center justify-center relative order-2 md:order-2 pb-0 md:mt-2 lg:mt-4 xl:mt-4 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Ambient Purple/Indigo Backlight Behind Book Stack */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-38 sm:w-87.5 sm:h-87.5 bg-indigo-500/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

            {/* Interactive 3D Stack Container - Beautifully enlarged on mobile for gorgeous readability, with a safe margin-bottom to clear absolute control widget */}
            <div className="relative w-77.5 xs:w-[350px] sm:w-92.5 md:w-82.5 lg:w-92.5 xl:w-100 h-52.5 xs:h-[236px] sm:h-62.5 md:h-97.5 lg:h-110 xl:h-120 shrink-0 z-20 mb-16 sm:mb-20 md:mb-16 lg:mb-16 xl:mb-18">
              
              {/* Desk Shadow Cast to Ground the 3D Books */}
              <motion.div
                animate={{
                  scale: isDragging ? 0.94 : 1,
                  opacity: isDragging ? 0.35 : 0.55,
                  y: isDragging ? 6 : 0
                }}
                transition={{ type: "spring", stiffness: 130, damping: 20 }}
                className="absolute -bottom-3 left-4 right-4 h-2 bg-black/75 rounded-full blur-md pointer-events-none z-10"
              />

              {featuredProjects.map((proj, idx) => {
                const relativeIndex = (idx - activeIndex + featuredProjects.length) % featuredProjects.length;
                const currentStyle = positions[relativeIndex] || positions[3];
                const bookStyles = getProjectBookStyles(proj);

                return (
                  <motion.div
                    key={proj.id}
                    animate={currentStyle}
                    transition={{ 
                      type: "spring", 
                      stiffness: 150, 
                      damping: 25, 
                      mass: 0.8
                    }}
                    whileHover={relativeIndex === 0 && !isDragging ? {
                      scale: 1.05,
                      rotateY: -5,
                      rotateX: 3,
                      y: -5,
                      shadow: "25px 25px 50px rgba(0,0,0,0.7)"
                    } : {}}
                    drag={relativeIndex === 0}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.6}
                    onDragStart={() => setIsDragging(true)}
                    onDrag={(event, info) => {
                      const x = info.offset.x;
                      const y = info.offset.y;
                      const absX = Math.abs(x);
                      const absY = Math.abs(y);
                      
                      if (absX > absY) {
                        if (absX > 15) {
                          setDragDirection(x < 0 ? 'left' : 'right');
                          setDragDistance(Math.round(absX));
                        } else {
                          setDragDirection(null);
                          setDragDistance(0);
                        }
                      } else {
                        if (absY > 15) {
                          setDragDirection(y < 0 ? 'up' : 'down');
                          setDragDistance(Math.round(absY));
                        } else {
                          setDragDirection(null);
                          setDragDistance(0);
                        }
                      }
                    }}
                    onDragEnd={(event, info) => {
                      setTimeout(() => setIsDragging(false), 80);
                      setDragDirection(null);
                      setDragDistance(0);
                      
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        handleNext(event);
                      } else if (info.offset.x > threshold) {
                        handlePrev(event);
                      } else if (info.offset.y < -threshold) {
                        handleNext(event);
                      } else if (info.offset.y > threshold) {
                        handlePrev(event);
                      }
                    }}
                    onClick={() => {
                      if (isDragging) return;
                      if (relativeIndex === 0) {
                        window.open(proj.link, '_blank', 'noopener,noreferrer');
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                    className={`absolute inset-0 rounded-lg sm:rounded-2xl cursor-grab active:cursor-grabbing select-none border border-white/10 flex origin-left bg-linear-to-br ${bookStyles.color} shadow-[6px_6px_20px_rgba(0,0,0,0.6)] touch-none`}
                    style={{ 
                      transformStyle: "preserve-3d", 
                      perspective: 1200, 
                      willChange: "transform, opacity",
                      backfaceVisibility: "hidden" 
                    }}
                  >
                    {/* Realistic Textured Book Spine - Slimmer, wider on mobile, highly premium */}
                    <div className={`w-5 xs:w-6 sm:w-8 md:w-10 xl:w-12 h-full ${bookStyles.spineColor} shrink-0 flex flex-col justify-between items-center py-2 sm:py-6 md:py-8 border-r border-black/40 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.6)]`}>
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-400/80 shadow" />
                        <div className="w-0.5 h-8 sm:h-16 md:h-24 rounded-full bg-linear-to-b from-transparent via-amber-400/60 to-transparent" />
                      </div>
                      
                      {/* Realistic vertical spine alignment space */}
                      <div className="relative flex items-center justify-center w-full grow my-4 overflow-visible" />
                      
                      {/* Padded numbered badges ensuring no database-generated long numeric strings overflow the circle */}
                      <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 rounded-full border border-amber-400/30 flex items-center justify-center">
                        <span className="text-[8px] xs:text-[9px] sm:text-[9px] md:text-[10px] xl:text-[10.5px] text-amber-400/90 font-bold">
                          0{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Book Front Cover Page Content */}
                    <div className={`flex-1 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between relative overflow-hidden pr-3 sm:pr-6 md:pr-8 transition-opacity duration-300 ${relativeIndex === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                      {/* Premium Light Sheen & Texture Overlay */}
                      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
                      
                      {/* Realistic vertical leather fold/crease near the spine */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-black/30 shadow-[1px_0_2px_rgba(255,255,255,0.08)] pointer-events-none" />

                      {/* Top Label Card */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-1 sm:pb-3 md:pb-4">
                        <span className="text-[9px] xs:text-[10px] sm:text-[9px] md:text-xs xl:text-sm font-bold uppercase tracking-wider text-indigo-300 line-clamp-1">
                          {proj.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          {proj.link && proj.link !== "#" ? (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-[7.5px] xs:text-[8.5px] sm:text-[8px] md:text-[10px] xl:text-xs font-mono transition-colors"
                              title="Open Live App"
                            >
                              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>LAUNCH</span>
                              <ExternalLink size={9} />
                            </a>
                          ) : (
                            <>
                              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[7.5px] xs:text-[8.5px] sm:text-[8px] md:text-[10px] xl:text-xs font-mono text-white/30">
                                LIVE
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Visual Project Cover Image (Simulating beautiful gold foil frame and black passe-partout in widescreen ratio) */}
                      {proj.link && proj.link !== "#" ? (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="my-1 sm:my-1.5 md:my-2 aspect-[2.2] md:aspect-[1.65] lg:aspect-[1.6] xl:aspect-[1.5] w-full rounded-md md:rounded-lg overflow-hidden border border-amber-400/30 p-1 bg-black/40 relative shadow-inner group grow block cursor-pointer"
                          title={`Launch ${proj.title}`}
                        >
                          <div className="w-full h-full rounded-sm md:rounded-md overflow-hidden relative">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              loading="eager"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                          </div>
                        </a>
                      ) : (
                        <div className="my-1 sm:my-1.5 md:my-2 aspect-[2.2] md:aspect-[1.65] lg:aspect-[1.6] xl:aspect-[1.5] w-full rounded-md md:rounded-lg overflow-hidden border border-amber-400/30 p-1 bg-black/40 relative shadow-inner group grow">
                          <div className="w-full h-full rounded-sm md:rounded-md overflow-hidden relative">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              loading="eager"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Description & Title with Gold/Silver theme */}
                      <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
                        <h3 className="text-[11.5px] xs:text-[13px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-extrabold text-white tracking-tight leading-none sm:leading-snug">
                          {proj.link && proj.link !== "#" ? (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 group/booktitle"
                              title={`Open ${proj.title}`}
                            >
                              <span>{proj.title}</span>
                              <ExternalLink size={12} className="opacity-60 group-hover/booktitle:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            proj.title
                          )}
                        </h3>
                        <p className="text-[9px] xs:text-[10.5px] sm:text-[10px] md:text-[11px] lg:text-xs text-slate-300 leading-normal line-clamp-1 sm:line-clamp-2 md:line-clamp-2 lg:line-clamp-2 font-light">
                          {proj.description}
                        </p>
                      </div>

                      {/* Professional publisher mark */}
                      <div className="flex items-center justify-between pt-1 sm:pt-1.5 md:pt-2 border-t border-white/10 mt-1 md:mt-1.5 text-[7.5px] xs:text-[8.5px] sm:text-[8px] md:text-[9.5px] xl:text-[10px] text-white/40">
                        <span className="font-semibold tracking-wide">HAROON ASHRAF</span>
                        <span className="font-mono text-amber-400/70">★ PREMIUM</span>
                      </div>

                      {/* Cover-to-spine vertical transition highlight line */}
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-white/10 pointer-events-none" />

                      {/* Simulated Gold Corner Anchors for Leather Notebook Aesthetic */}
                      <div className="absolute top-0 right-0 w-2 h-2 sm:w-3.5 sm:h-3.5 border-t border-r sm:border-t-2 sm:border-r-2 border-amber-400/30 rounded-tr-sm sm:rounded-tr-md pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3.5 sm:h-3.5 border-b border-r sm:border-b-2 sm:border-r-2 border-amber-400/30 rounded-br-sm sm:rounded-br-md pointer-events-none" />
                    </div>

                    {/* Simulated 3D Paper Pages block on the right edge */}
                    <div className="absolute right-0 top-px sm:top-0.5 bottom-px sm:bottom-0.5 w-1.5 xs:w-2 sm:w-3 md:w-4 bg-[#fdfcfb] rounded-r-xs sm:rounded-r-[5px] border-l border-slate-900/40 shadow-[inset_1px_0_3px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col justify-around py-0.5 sm:py-2 pointer-events-none z-0">
                      <div className="w-full h-px bg-slate-300/60" />
                      <div className="w-full h-px bg-slate-300/60" />
                      <div className="w-full h-px bg-slate-300/60" />
                    </div>


                    {/* Premium Drag & Swipe Visual Feedback Overlay */}
                    <AnimatePresence>
                      {dragDirection && relativeIndex === 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-1 sm:p-4 text-center pointer-events-none"
                        >
                          <motion.div
                            animate={{ 
                              x: dragDirection === 'left' ? -5 : dragDirection === 'right' ? 5 : 0,
                              y: dragDirection === 'up' ? -5 : dragDirection === 'down' ? 5 : 0,
                            }}
                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
                            className="p-1 sm:p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-400 mb-0.5 sm:mb-2 shadow-lg shadow-indigo-500/10"
                          >
                            {dragDirection === 'left' && <ChevronLeft size={12} className="rotate-180 sm:w-6 sm:h-6" />}
                            {dragDirection === 'right' && <ChevronLeft size={12} className="sm:w-6 sm:h-6" />}
                            {dragDirection === 'up' && <ChevronLeft size={12} className="rotate-90 sm:w-6 sm:h-6" />}
                            {dragDirection === 'down' && <ChevronLeft size={12} className="-rotate-90 sm:w-6 sm:h-6" />}
                          </motion.div>
                          <span className="text-[7px] sm:text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase">
                            {dragDirection === 'left' || dragDirection === 'up' ? 'Next' : 'Prev'}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Stack Selector Control Widget */}
              <div className="absolute -bottom-10 sm:-bottom-12 md:-bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 sm:space-y-1.5 z-50 w-full">
                <div className="flex items-center space-x-1.5 sm:space-x-4 bg-slate-950/90 backdrop-blur-md px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-full border border-white/10 shadow-xl">
                  <button 
                    onClick={handlePrev} 
                    className="p-0.5 hover:text-indigo-400 text-slate-400 transition-colors"
                    aria-label="Previous Book"
                  >
                    <ChevronLeft size={10} className="sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-[7px] sm:text-[10px] font-mono text-slate-400 font-bold tracking-wider whitespace-nowrap">
                    0{activeIndex + 1} / 0{featuredProjects.length}
                  </span>
                  <button 
                    onClick={handleNext} 
                    className="p-0.5 hover:text-indigo-400 text-slate-400 transition-colors"
                    aria-label="Next Book"
                  >
                    <ChevronRight size={10} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
                <div className="text-[6px] sm:text-[9px] text-indigo-400/80 tracking-widest uppercase font-bold animate-pulse text-center whitespace-nowrap">
                  Swipe Book to Browse
                </div>
              </div>
            </div>

            {/* 2x2 Grid Selector List - Beautifully responsive with direct interactive controls */}
            <div className="w-full max-w-xl md:max-w-2xl space-y-2.5 z-20 px-1 md:px-0 md:mx-auto">
              <div className="flex items-center space-x-1.5 mb-1 px-1 justify-center md:justify-center">
                <Library size={13} className="text-indigo-400" />
                <span className="text-[10px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Active Catalogue
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 md:gap-3 w-full">
                {featuredProjects.map((proj, idx) => {
                  const isActive = activeIndex === idx;
                  const bookStyles = getProjectBookStyles(proj);
                  return (
                    <button
                      key={proj.id}
                      onMouseEnter={() => typeof window !== "undefined" && window.innerWidth >= 768 && setActiveIndex(idx)}
                      onClick={() => setActiveIndex(idx)}
                      className="relative w-full text-left p-2 sm:p-2.5 md:p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between overflow-hidden bg-[#0d1425]/40 border-white/5 hover:bg-white/2 hover:border-white/10 text-slate-400 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2 md:space-x-2.5 z-10 min-w-0">
                        <span className={`font-mono text-[9.5px] xs:text-[10.5px] md:text-[10px] font-bold ${isActive ? bookStyles.accentColor : 'text-slate-600'}`}>
                          0{idx + 1}
                        </span>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className={`font-bold text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-xs lg:text-sm transition-colors duration-300 truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {proj.title}
                          </h4>
                          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                            {proj.category}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        size={11} 
                        className={`transition-transform duration-300 z-10 shrink-0 ${isActive ? 'translate-x-1 ' + bookStyles.accentColor : 'text-slate-600'}`} 
                      />

                      {/* Elite Linear Progress Bar Auto-rotator Indicator */}
                      {isActive && (
                        <motion.div 
                          key={activeIndex}
                          className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
                          initial={{ width: "0%" }}
                          animate={{ width: (isHovered || isDragging) ? "0%" : "100%" }}
                          transition={{ duration: 5, ease: "linear" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
