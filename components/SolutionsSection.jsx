import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { solutionsService } from '../services/solutionsService';

const SolutionsSection = ({ onGetQuoteClick }) => {
  const [solutionsList, setSolutionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await solutionsService.getSolutions();
        setSolutionsList(data);
      } catch (err) {
        console.error("Failed to load solutions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSolutions();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 bg-[#0a0f1d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500" />
      </div>
    );
  }

  return (
    <section id="solutions" className="py-24 bg-[#0a0f1d] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-black tracking-[0.3em] text-rose-500 uppercase">
            OUR CORE SPECIALTIES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Tailor-Made Digital Solutions <br />
            For Small Businesses
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
            We don't just assemble static layouts. We architect secure, lightning-fast digital assets specifically configured to boost your inquiries and revenue.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {solutionsList.map((sol, idx) => {
            const Icon = Icons[sol.icon] || Icons.Cpu;
            return (
              <Link
                key={sol.id || idx}
                to={`/service/${sol.id}`}
                className="group block focus:outline-none"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-8 h-full rounded-3xl bg-slate-900/30 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/5"
                >
                  <div className="space-y-6">
                    {/* Icon & Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold tracking-widest text-slate-400 group-hover:text-rose-500 transition-colors">
                        {sol.tagline}
                      </span>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
                        <Icon size={20} className="text-white group-hover:text-rose-400 transition-colors" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3 text-left">
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-rose-400 transition-colors">
                        {sol.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-light">
                        {sol.description}
                      </p>
                    </div>

                    {/* Core Features List */}
                    <div className="space-y-2.5 pt-4 border-t border-white/5 text-left">
                      {(sol.benefits || []).slice(0, 3).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                          <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Icons.Check size={12} />
                          </div>
                          <span className="line-clamp-1">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link indicator */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors duration-200">
                    <span>View Service Scope</span>
                    <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Call-to-Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-linear-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left"
        >
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Have a unique business requirement?</h4>
            <p className="text-slate-400 text-sm font-light max-w-xl">
              We spec and build completely custom databases, automated customer relations portals, or full-blown cloud apps. Talk directly with Haroon to design your system.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button
              onClick={onGetQuoteClick}
              className="px-6 py-3 bg-white text-slate-950 font-bold rounded-xl text-sm shadow-xl hover:bg-slate-100 transition-colors cursor-pointer w-full md:w-auto text-center"
            >
              Get Custom Quote
            </button>
            <Link
              to="/portfolio"
              className="px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-bold rounded-xl text-sm transition-colors w-full md:w-auto text-center"
            >
              Browse Full Portfolio
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SolutionsSection;
