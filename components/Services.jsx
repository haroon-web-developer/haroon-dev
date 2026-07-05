import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Globe, Smartphone, Zap, Server, Monitor } from 'lucide-react';

const services = [
  {
    id: '1',
    title: 'React & Next.js Development',
    description: 'High-performance web assets built with Next.js & React. Ready for Server-Side Rendering (SSR), Static Site Generation (SSG), and blazing fast client-side performance.',
    icon: 'code'
  },
  {
    id: '2',
    title: 'Modern UI/UX Implementation',
    description: 'Transforming designs into living, breathing interfaces with Tailwind CSS and interactive Framer Motion animations.',
    icon: 'monitor'
  },
  {
    id: '3',
    title: 'Full Stack Solutions',
    description: 'Robust, end-to-end web architectures powered by modern databases, secured by Firebase, and built on reliable, scalable backends.',
    icon: 'server'
  },
  {
    id: '4',
    title: 'Responsive & Accessible Design',
    description: 'Pixel-perfect responsiveness across mobile, tablet, and widescreen. Fully optimized for speed, accessibility, and high conversion.',
    icon: 'smartphone'
  },
  {
    id: '5',
    title: 'Figma to Code Conversions',
    description: 'Taking your Figma, Sketch, or Adobe XD designs and translating them into pristine, responsive, and reusable Tailwind CSS components.',
    icon: 'palette'
  },
  {
    id: '6',
    title: 'Performance & SEO Optimization',
    description: 'Deep SEO optimization, high Lighthouse scores, schema markup, structured metadata, and custom speed audits to maximize organic reach.',
    icon: 'globe'
  }
];

const IconMap = {
  code: Code2,
  palette: Palette,
  server: Server,
  smartphone: Smartphone,
  zap: Zap,
  globe: Globe,
  monitor: Monitor
};

const Services = () => {
  return (
    <section id="services" className="py-18 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        
        <h2 className="text-sm font-bold tracking-widest text-indigo-500 uppercase mb-4">
          What I Offer
        </h2>

        <h3 className="text-3xl md:text-5xl font-bold mb-16">
          My Specialized Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = IconMap[service.icon];

            return (
              <motion.div
                key={service.id}
                id={`service-card-${service.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover="hover"
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                variants={{
                  hover: {
                    y: -8,
                    borderColor: "rgba(99, 102, 241, 0.45)",
                    boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.25)",
                    backgroundColor: "rgba(30, 41, 59, 0.7)"
                  }
                }}
                className="group relative p-8 bg-slate-900/50 border border-white/5 rounded-3xl transition-all duration-300 text-left overflow-hidden cursor-pointer"
              >
                {/* Ambient glow light in background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Inner Card Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Icon Container with glowing micro-interaction */}
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
                      {Icon && <Icon size={26} />}
                    </div>

                    <h4 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-200 transition-colors duration-300">
                      {service.title}
                    </h4>

                    <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>

                  {/* Micro-interactive bottom link */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold tracking-wider text-indigo-400 uppercase opacity-60 group-hover:opacity-100 group-hover:text-indigo-300 transition-all duration-300">
                    <span>Inquire About Service</span>
                    <motion.span
                      variants={{
                        hover: { x: 6 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-sm font-bold"
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;