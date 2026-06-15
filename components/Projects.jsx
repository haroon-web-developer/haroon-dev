import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "1",
    title: "E-Commerce System & Smart Tech Store",
    businessOutcome: "Boosted User Experience & Checkout Velocity",
    description:
      "A high-performance premium tech store featuring custom inventory filters, expert product verification markers, and an optimized, frictionless path-to-purchase funnel.",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Conversion Architecture", "Next.js UI", "Edge Cloud Deployment"],
    link: "https://smart-finds.vercel.app/",
  },
  {
    id: "2",
    title: "Luxury Booking Platform & Digital Brand Overhaul",
    businessOutcome: "Automated Appointment Scheduling & Lead Retention",
    description:
      "An elegant, lightning-fast digital home for an upscale salon combining seamless client intake forms, localized maps discovery, and structural brand storytelling.",
    image:
      "https://bloomandblossom.ae/wp-content/uploads/2026/03/Nano-Banana-2-A-professional-salon-scene-featuring-a-beautiful-woman-with-flawless_-glowing-skin-rec_2-1.png",
    tags: ["Automated Intake", "Premium UI Styling", "Local Search SEO"],
    link: "https://faiza-s-beauty-salon.vercel.app/",
  },
  {
    id: "3",
    title: "Revenue-Optimized Storefront for Retail Brands",
    businessOutcome: "Integrated Stock Urgency & One-Click Checkout",
    description:
      "A conversion-first retail e-commerce platform equipped with real-time stock indicators, intuitive quick-add behaviors, and instantaneous checkout pathways.",
    image:
      "https://plus.unsplash.com/premium_photo-1664475347754-f633cb166d13?q=80&w=870&auto=format&fit=crop",
    tags: ["Conversion Optimisation", "Mobile-First UX", "Rapid Checkout Flow"],
    link: "https://trendwave-store.vercel.app/",
  },
  {
    id: "4",
    title: "Enterprise Learning Platform & SaaS Engine",
    businessOutcome: "Monetized Content Systems & Global Performance",
    description:
      "A highly secure, cloud-deployed learning management system enabling trainers to seamlessly build, scale, and capture revenue from premium digital programs.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1400",
    tags: ["Data Architecture", "SaaS Infrastructure", "Identity Management"],
    link: "https://lms-wqmc.vercel.app/",
  },
  {
    id: "5",
    title: "Premium Livestock & Agro-Commerce Hub",
    businessOutcome: "Modern Supply-Chain Trust & Audience Reach",
    description:
      "A unique business platform combining traditional farming operations with modern digital systems to manage high-ticket inventory display and client communication.",
    image:
      "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=2000",
    tags: ["Inventory Systems", "Modern Agricultural Tech", "Cloud Operations"],
    link: "https://bukhari-farm.vercel.app/",
  },
  {
    id: "6",
    title: "Executive Business Analytics Dashboard",
    businessOutcome: "Real-Time Tracking & Dynamic Administration Insights",
    description:
      "A sleek administrative monitoring workspace tracking business-critical key performance indicators, user retention metrics, and real-time revenue velocity charts.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1400",
    tags: [
      "Data Visualization",
      "Key Metrics Performance",
      "State Optimization",
    ],
    link: "#",
  },
];

const cardVariants = {
  offscreen: { y: 20, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const Projects = () => {
  return (
    <section
      id="projects"
      className="py-24 bg-slate-950 relative z-10 border-t border-slate-900/60"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Business-Driven Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Case Studies
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-white">
              Proven Digital Solutions
            </h3>
          </div>
          <p className="text-sm text-slate-400 max-w-sm font-light leading-relaxed">
            A selective showcase of modern web systems engineered to improve
            loading speeds, maximize user conversions, and scale commercial
            brand revenue.
          </p>
        </div>

        {/* High-Performance Project Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.15 }} // Prevents multiple re-render loops on mobile scroll
              className="group bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden shadow-xl hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container - Swapped Heavy 3D Rotations for Fluid CSS Overlays */}
                <div className="aspect-video overflow-hidden relative bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy" // Native browser deferred offscreen loading
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300 transform-gpu"
                  />

                  {/* Clean Direct Dynamic Link Overlay */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-slate-300 opacity-0 group-hover:opacity-100 hover:text-white hover:border-slate-700 transition-all duration-200 shadow-xl"
                    aria-label={`Preview ${project.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </div>

                {/* Card Content Elements */}
                <div className="p-6">
                  {/* Business Outcome Subtext Tag Line */}
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
                    {project.businessOutcome}
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-200">
                    {project.title}
                  </h4>

                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Bottom Technical Tag Footnotes */}
              <div className="px-6 pb-6 pt-0">
                <div className="flex flex-wrap gap-1.5 border-t border-slate-900/80 pt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-medium tracking-wide px-2 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
