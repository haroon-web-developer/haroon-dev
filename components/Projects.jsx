import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Code2, Sparkles } from "lucide-react";
import { projects as defaultProjects } from "../services/projectsData";
import { projectsService } from "../services/projectsService";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const Projects = () => {
  const [projectList, setProjectList] = useState(defaultProjects);

  useEffect(() => {
    let active = true;
    projectsService.getProjects().then((list) => {
      if (active) {
        setProjectList(list);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="projects" className="pt-6 pb-20 md:pt-8 md:pb-24 relative overflow-hidden bg-slate-950">
      {/* Premium ambient decorative elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} className="animate-spin" />
            <span>Top-Tier Creations</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Latest Client <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-500">Case Studies</span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            A handpicked registry of pixel-perfect commercial web platforms designed to lock in user attention and load lightning-fast.
          </p>
        </div>

        {/* Project Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {projectList.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative bg-[#0d1425]/60 border border-white/5 hover:border-indigo-500/30 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full hover:shadow-indigo-500/5"
            >
              {/* Image Frame with soft tags overlay */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-900 group-auto">
                {/* Accent border highlight inside card top */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-linear-to-r ${project.highlightColor}`} />
                
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark gradient mask */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />

                {/* Left Top category pill */}
                <span className="absolute top-4 left-4 inline-flex px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-indigo-300 border border-white/5">
                  {project.category}
                </span>

                {/* Big Floating Number ID */}
                <span className="absolute bottom-3 right-4 font-mono font-black text-4xl text-white/10 group-hover:text-indigo-400/25 transition-colors duration-300 tracking-tight select-none">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
              </div>

              {/* Card Body & Information */}
              <div className="p-6 sm:p-7 flex flex-col grow justify-between space-y-5">
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Footer space containing Technologies and Live Links */}
                <div className="space-y-5 pt-2 border-t border-white/5">
                  {/* Tag badging */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium tracking-wide px-2 py-0.5 bg-slate-900 text-slate-400 rounded-md border border-white/3"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Call to action element */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">Live Deployment</span>
                    
                    {project.link !== "#" ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors py-1 pl-2"
                      >
                        <span>Launch App</span>
                        <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium italic">Internal Product</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
