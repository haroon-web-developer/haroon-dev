import React from "react";
import { motion } from "framer-motion";

// Path-scoped cherry-picked icons to keep your bundle size exceptionally small
import LayoutGrid from "lucide-react/dist/esm/icons/layout-grid";
import Database from "lucide-react/dist/esm/icons/database";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import Zap from "lucide-react/dist/esm/icons/zap";
import Search from "lucide-react/dist/esm/icons/search";
import MonitorSmartphone from "lucide-react/dist/esm/icons/monitor-smartphone";

const mernBusinessServices = [
  {
    id: "1",
    title: "Custom MERN Web Applications",
    description:
      "We engineer tailored React frontends backed by powerful Node.js and Express servers. This gives your business a completely custom digital presence that runs faster and stays more secure than basic templates.",
    icon: LayoutGrid,
  },
  {
    id: "2",
    title: "Secure Database Solutions",
    description:
      "Using high-performance MongoDB structures, we build custom customer intake forms, client dashboards, and secure lead storage systems to safeguard your local business data.",
    icon: Database,
  },
  {
    id: "3",
    title: "High-Conversion E-Commerce Stores",
    description:
      "Full-stack commercial storefronts designed to help local retail brands scale. Includes dynamic product filters, rapid checkout streams, and integrated WhatsApp order hooks.",
    icon: ShoppingBag,
  },
  {
    id: "4",
    title: "Speed & Performance Upgrades",
    description:
      "We migrate slow, old website templates over to lightning-fast React environments deployed on global edge clouds, immediately stopping your visitors from leaving due to lag.",
    icon: Zap,
  },
  {
    id: "5",
    title: "Local SEO & Search Visibility",
    description:
      "Every MERN platform we deploy is structurally optimized for Google search algorithms, making your business stand out on local maps and rank ahead of competitors in Islamabad.",
    icon: Search,
  },
  {
    id: "6",
    title: "Responsive Cross-Device Layouts",
    description:
      "Your premium digital presence will adapt beautifully across all screens—from mobile devices to desktop monitors—ensuring a flawless user experience for every client.",
    icon: MonitorSmartphone,
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="py-10 bg-slate-950 relative z-10 border-t border-slate-900/60"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
            What We Deliver
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">
            Premium Digital Solutions
          </h3>
          <p className="text-sm text-slate-400 mt-4 max-w-md mx-auto font-light leading-relaxed">
            We merge advanced MERN full-stack engineering with strategic
            business marketing to launch high-performance digital platforms for
            local brands.
          </p>
        </div>

        {/* High-Performance Optimized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mernBusinessServices.map((service, idx) => {
            const IconComponent = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-40px" }} // Prevents mobile re-render loops
                className="group p-6 bg-slate-900/40 border border-slate-900 rounded-2xl hover:border-slate-800 transition-all duration-300 text-left backdrop-blur-md shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 transform-gpu">
                    <IconComponent size={22} />
                  </div>

                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-200">
                    {service.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {service.description}
                  </p>
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
