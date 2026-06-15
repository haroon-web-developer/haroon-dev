import React from "react";
import { motion } from "framer-motion";

const coreExpertise = [
  {
    name: "Ultra-Fast Performance Architecture (Next.js / React)",
    category: "core",
    level: 95,
  },
  { name: "Conversion Rate Optimization (CRO)", category: "core", level: 90 },
  {
    name: "Advanced Tailwind CSS & Premium UI Polish",
    category: "core",
    level: 95,
  },
  {
    name: "Local SEO Strategy & Google Maps Ranking",
    category: "growth",
    level: 85,
  },
  {
    name: "Direct WhatsApp API & Lead Capture Logic",
    category: "growth",
    level: 90,
  },
  {
    name: "Secure Cloud Deployments (Vercel Edge Network)",
    category: "growth",
    level: 95,
  },
  {
    name: "Full-Stack Data Forms & Backend Systems",
    category: "infrastructure",
    level: 80,
  },
  {
    name: "Figma UI/UX Mockups & Digital Wireframing",
    category: "infrastructure",
    level: 85,
  },
];

const categories = {
  core: "Frontend Engineering & Polish",
  growth: "Business Growth & Local SEO",
  infrastructure: "Digital Systems & Infrastructure",
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="py-10 bg-slate-950 relative z-10 border-t border-slate-900/60"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
            Capabilities
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">
            Our Technical Engine
          </h3>
          <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto font-light">
            We use top-tier modern technology to ensure your platform is
            incredibly fast, responsive, and ready to get you clients.
          </p>
        </div>

        {/* Animated Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(categories).map((cat, index) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-50px" }} // Once: true stops calculation loops after it renders
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl backdrop-blur-md shadow-xl hover:border-slate-800 transition-colors duration-300"
            >
              <h4 className="text-base font-bold mb-6 text-indigo-400 border-b border-slate-800/60 pb-3 tracking-wide">
                {categories[cat]}
              </h4>

              <div className="space-y-5">
                {coreExpertise
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.name} className="group">
                      <div className="flex justify-between mb-1.5 text-xs">
                        <span className="font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
                          {skill.name}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Optimized Hardware-Accelerated Progress Bar Animation */}
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ x: "-100%" }}
                          whileInView={{ x: `${skill.level - 100}%` }} // Uses layout-stable translation values
                          transition={{
                            duration: 0.8,
                            ease: [0.25, 1, 0.5, 1],
                          }} // Elegant easeOutQuart transition
                          viewport={{ once: true }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transform-gpu"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
