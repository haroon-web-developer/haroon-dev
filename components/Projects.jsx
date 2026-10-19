import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Code2, Sparkles } from "lucide-react";
import { projects as defaultProjects } from "./projectsData";
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
    // Live subscription to project changes and ordering
    const unsubscribe = projectsService.subscribeProjects((list) => {
      setProjectList(list);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <section id="projects" className="pt-6 pb-20 md:pt-8 md:pb-24 relative overflow-hidden bg-slate-950">
      {/* Premium ambient decorative elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} className="animate-spin" />
            <span>Top-Tier Creations</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Latest Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Case Studies</span>
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
          {projectList.map((project, index) => {
            const rawLink = project.link ? project.link.trim() : "";
            const hasValidLink = rawLink !== "" && rawLink !== "#";
            const projectUrl = hasValidLink 
              ? (/^https?:\/\//i.test(rawLink) ? rawLink : `https://${rawLink}`)
              : null;

            return (
              <motion.div
                key={project.id}
                layout
                variants={itemVariants}
                className="group relative bg-[#0d1425]/60 border border-white/5 hover:border-indigo-500/30 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full hover:shadow-indigo-500/5"
              >
                {/* Image Frame - Clickable to open project */}
                {projectUrl ? (
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[16/10] overflow-hidden bg-slate-900 group/image block cursor-pointer"
                    title={`Open ${project.title} (Live App)`}
                    aria-label={`Open ${project.title} live application`}
                  >
                    {/* Accent border highlight inside card top */}
                    <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${project.highlightColor || "from-blue-500 to-indigo-500"} z-10`} />
                    
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover/image:scale-108"
                    />

                    {/* Dark gradient mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover/image:opacity-60 transition-opacity duration-300" />

                    {/* Floating Launch Indicator on Image Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 bg-slate-950/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600/90 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transform translate-y-1 group-hover/image:translate-y-0 transition-transform">
                        <span>Launch App</span>
                        <ExternalLink size={13} />
                      </span>
                    </div>

                    {/* Left Top category pill */}
                    <span className="absolute top-4 left-4 inline-flex px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-indigo-300 border border-white/5 z-10">
                      {project.category}
                    </span>

                    {/* Big Floating Number ID */}
                    <span className="absolute bottom-3 right-4 font-mono font-black text-4xl text-white/10 group-hover:text-indigo-400/25 transition-colors duration-300 tracking-tight select-none pointer-events-none z-10">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </a>
                ) : (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${project.highlightColor || "from-blue-500 to-indigo-500"} z-10`} />
                    
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />

                    <span className="absolute top-4 left-4 inline-flex px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-indigo-300 border border-white/5 z-10">
                      {project.category}
                    </span>

                    <span className="absolute bottom-3 right-4 font-mono font-black text-4xl text-white/10 group-hover:text-indigo-400/25 transition-colors duration-300 tracking-tight select-none z-10">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </div>
                )}

                {/* Card Body & Information */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white transition-colors duration-300">
                      {projectUrl ? (
                        <a
                          href={projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-300 group/title inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          title={`Open ${project.title} in new tab`}
                        >
                          <span className="underline-offset-4 group-hover/title:underline">{project.title}</span>
                          <ExternalLink size={16} className="text-indigo-400 opacity-60 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
                        </a>
                      ) : (
                        <span>{project.title}</span>
                      )}
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
                          className="text-[10px] font-medium tracking-wide px-2 py-0.5 bg-slate-900 text-slate-400 rounded-md border border-white/[0.03]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Call to action element */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-mono">Live Deployment</span>
                      
                      {projectUrl ? (
                        <a
                          href={projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 group/link transition-colors py-1 pl-2 cursor-pointer"
                          aria-label={`Launch ${project.title} application`}
                        >
                          <span className="underline-offset-2 group-hover/link:underline">Launch App</span>
                          <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium italic">Internal Product</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
