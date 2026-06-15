import React from "react";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Zap from "lucide-react/dist/esm/icons/zap";
import Target from "lucide-react/dist/esm/icons/target";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Users from "lucide-react/dist/esm/icons/users";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950 text-white select-none dynamic-layer-lock">
      {/* High-Performance Fixed Light Fields - Dropped Opacity & Blur Radii for Faster GPU Composite */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Optimized Performance Grid Overlay - Replaced Complex Gradients with Light Static Border System */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(circle_at_center,#000_50%,transparent_100%)] opacity-25 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center text-left">
          {/* LEFT COLUMN: Premium Copywriting & Core Business Hook */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Elite Status Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold tracking-wider uppercase shadow-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Premium Web Engineering &bull; Islamabad</span>
            </div>

            {/* High-Contrast Architectural Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              We Build Web Assets{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                That Generate Profit.
              </span>
            </h1>

            {/* Elite Business Value Proposition */}
            <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed max-w-xl">
              Most agency websites in Islamabad are slow and lose clients. At{" "}
              <span className="text-slate-100 font-semibold">HAROON.DEV</span>,
              we engineer ultra-fast, cloud-deployed digital systems tailored
              specifically for{" "}
              <span className="text-indigo-300 font-medium">
                Real Estate Agencies, Corporate Brands, and Premium Services
              </span>{" "}
              to systematically scale revenue.
            </p>

            {/* High-Converting Executive Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
              <a
                href="#projects"
                className="group w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-all duration-200 tracking-wide text-sm"
              >
                Explore Case Studies
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  size={16}
                />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=923214576734&text=Hello%20Haroon%20I%20visited%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-indigo-500/50 rounded-xl font-bold flex items-center justify-center active:scale-[0.98] transition-all duration-200 tracking-wide text-sm backdrop-blur-md shadow-md"
              >
                Request Free Performance Audit
              </a>
            </div>

            {/* Quick Proof Trust Line */}
            <div className="flex items-center space-x-6 text-xs text-slate-500 font-medium tracking-wide pt-4 border-t border-slate-900 w-full max-w-md">
              <div className="flex items-center">
                <Users size={14} className="text-indigo-400 mr-1.5" /> 100%
                Client Satisfaction
              </div>
              <div className="flex items-center">
                <Zap size={14} className="text-amber-400 mr-1.5" /> &lt; 1.0s
                Server Response
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive Lead Generation Visualization Panel */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            {/* Main Interactive Metric Terminal Block */}
            <div className="relative w-full max-w-md rounded-2xl border border-slate-900 bg-slate-900/40 p-5 backdrop-blur-md shadow-2xl transition-transform duration-300">
              {/* Window Controls UI Frame */}
              <div className="flex items-center justify-between border-b border-slate-800/40 pb-3 mb-5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                  Live_Performance_Matrix
                </span>
              </div>

              {/* Simulated Customer Growth Panel Item */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Conversion Velocity
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">
                        +248% Lead Growth
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-indigo-400" />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Zap size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Mobile Performance Core
                      </div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">
                        100/100 Perfect Speed
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Passed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Target size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Organic Reach Visibility
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">
                        Islamabad SEO Rank #1
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20">
                    Active
                  </span>
                </div>
              </div>

              {/* Window Footer Component */}
              <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-between items-center font-mono text-[10px] text-slate-500">
                <span>Infrastructure: Next.js Edge</span>
                <span className="text-indigo-400 font-semibold">
                  SSL_SECURED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
