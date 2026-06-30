import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Path-scoped Cherry-Picked Imports to slash bundle size instantly
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";
import Github from "lucide-react/dist/esm/icons/github";
import Linkedin from "lucide-react/dist/esm/icons/linkedin";
import { Facebook } from "lucide-react";
import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";

const Layout = ({ children }) => {
  const phone = "923214576734";
  const message =
    "Hey🖐, I am looking to develop a high-performance website for my business. Let's connect to discuss our project requirements and timeline.";

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message,
  )}`;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Configured with passive option to eliminate rendering lag on mobile devices
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform-gpu ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hover:scale-[1.02] transition-transform duration-200"
          >
            HAROON.DEV
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-slate-400 hover:text-white transition-colors group py-1"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all duration-200"
            >
              Let's Connect
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden text-slate-300 p-1 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xl font-semibold text-slate-300 border-b border-slate-900 pb-3 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-indigo-600 text-white text-center font-bold text-sm tracking-wide shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Request Free Performance Audit
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">{children}</main>

      {/* Premium Dark Mode Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                HAROON.DEV
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-light">
                Engineering ultra-fast, premium digital assets for corporate
                businesses, real estate portfolios, and high-ticket service
                operations in Islamabad.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Networks
              </h4>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/Haroon-Web-Developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 bg-slate-900/60 border border-slate-900 rounded-xl text-slate-400 hover:text-white hover:border-slate-800 transition-all duration-200"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/haroon-web-developer-a09217219/?isSelfProfile=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 bg-slate-900/60 border border-slate-900 rounded-xl text-slate-400 hover:text-white hover:border-slate-800 transition-all duration-200"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://www.facebook.com/share/1EYHVkoX55/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="p-2.5 bg-slate-900/60 border border-slate-900 rounded-xl text-slate-400 hover:text-white hover:border-slate-800 transition-all duration-200"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Communications
              </h4>
              <div className="flex flex-col space-y-3 text-sm font-light">
                <a
                  href="mailto:haroonashraf.dev@gmail.com"
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-indigo-400" />
                  <span>haroonashraf.dev@gmail.com</span>
                </a>
                <a
                  href="tel:+923214576734"
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-purple-400" />
                  <span>+92 321 4576734</span>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-xs font-medium tracking-wide">
            &copy; {new Date().getFullYear()} HAROON.DEV. Engineered for
            Performance.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
