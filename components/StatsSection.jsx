import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { statsService } from '../services/statsService';

const StatsSection = () => {
  const [statsList, setStatsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getStats();
        setStatsList(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-[#0c122c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#0c122c] border-y border-white/5 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Tag */}
        <div className="flex items-center justify-center gap-1.5 mb-10 text-center">
          <Icons.Sparkles size={14} className="text-amber-400" />
          <span className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">
            ESTABLISHED TRACK RECORD
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, idx) => {
            const Icon = Icons[stat.icon] || Icons.Trophy;
            return (
              <motion.div
                key={stat.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.15)" }}
                className="p-6 bg-[#0f173a]/40 border border-white/5 rounded-2xl transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Icon & Counter */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                      {stat.value}
                    </div>
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300">
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-white tracking-wide mb-2 uppercase">
                    {stat.label}
                  </h4>

                  {/* Description */}
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom decorative color slide */}
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${stat.color || "from-indigo-500 to-purple-500"} mt-6 opacity-60`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
