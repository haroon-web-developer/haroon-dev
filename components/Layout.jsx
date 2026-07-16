import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter, Mail, Phone, MessageSquare, Facebook, Instagram } from 'lucide-react';

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isPortfolio = location.pathname === '/portfolio';

  const navLinks = isPortfolio
    ? [
        { name: 'Agency Home', to: '/' },
        { name: 'About', to: '/portfolio#about', isHash: true },
        { name: 'Services', to: '/portfolio#services', isHash: true },
        { name: 'Projects', to: '/portfolio#projects', isHash: true },
        { name: 'Skills', to: '/portfolio#skills', isHash: true }
      ]
    : [
        { name: 'Home', to: '/' },
        { name: 'Solutions', to: '/#solutions', isHash: true },
        { name: 'Portfolio', to: '/portfolio' }
      ];

  const handleLinkClick = (link, e) => {
    setIsMenuOpen(false);
    if (link.isHash) {
      e.preventDefault();
      const parts = link.to.split('#');
      const pathName = parts[0];
      const hash = parts[1];
      if (location.pathname === pathName) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(pathName);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  };

  const scrollToQuote = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById('quote-configurator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('quote-configurator');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isPortfolio) {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      scrollToQuote(e);
    }
  };

  const phone = "923214576734";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent("Hi, I want to talk about a project inquiry.")}`;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white">
      {!isAdminRoute && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 print:hidden ${
            isScrolled
              ? "bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-white/5 py-3"
              : "bg-transparent py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-black tracking-tighter"
            >
              <Link to="/" className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-rose-400 to-amber-400">
                HAROON-DEV
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={(e) => handleLinkClick(link, e)}
                  className="relative text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors group"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}

              {/* Swismax Style WhatsApp & Free Quote Header buttons */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Connect via WhatsApp"
                >
                  <MessageSquare size={14} />
                  <span className="hidden lg:inline">WhatsApp</span>
                </a>

                <button
                  onClick={handleCtaClick}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-black tracking-wider uppercase shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                    isPortfolio
                      ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10"
                      : "bg-linear-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-600/10"
                  }`}
                >
                  {isPortfolio ? "Connect Me" : "Get Free Quote →"}
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <motion.button
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-slate-300 p-1 bg-white/5 rounded-lg border border-white/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </nav>
      )}

      {/* Mobile Menu */}
      {!isAdminRoute && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-40 bg-[#0a0f1d] pt-24 px-6 md:hidden flex flex-col justify-between pb-8"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.to}
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-xl font-bold text-slate-200 border-b border-white/5 pb-3 text-left"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-3.5">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Connect WhatsApp</span>
                </a>
                
                <button 
                  onClick={handleCtaClick}
                  className={`w-full py-3.5 rounded-xl text-white text-center font-bold text-sm shadow-md ${
                    isPortfolio
                      ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10"
                      : "bg-linear-to-r from-rose-600 to-amber-600 shadow-rose-600/10"
                  }`}
                >
                  {isPortfolio ? "Connect Me" : "Get Free Quote"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <main>{children}</main>

      {!isAdminRoute && (
        <footer className="bg-[#080d1a] border-t border-white/5 py-12 text-left print:hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-rose-400 to-amber-400">
                  HAROON.DEV
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  Creating high-performance digital experiences and scalable full-stack assets for forward-thinking business owners.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Quick Navigation</h4>
                <div className="flex flex-col space-y-2 text-sm text-slate-400">
                  <Link to="/" className="hover:text-white transition">Home Page</Link>
                  <Link to="/portfolio" className="hover:text-white transition">Core Portfolio</Link>
                  <button onClick={scrollToQuote} className="hover:text-white transition text-left cursor-pointer">Project Estimator</button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Social Channels</h4>
                <div className="flex flex-col space-y-2.5 text-sm text-slate-400">
                  <a
                    href="https://www.facebook.com/HaroonWebDev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 hover:text-white transition duration-200"
                  >
                    <Facebook size={14} className="text-indigo-400" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/haroon_web_developer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 hover:text-white transition duration-200"
                  >
                    <Instagram size={14} className="text-rose-400" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/haroon-web-developer-a09217219/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 hover:text-white transition duration-200"
                  >
                    <Linkedin size={14} className="text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/haroon-web-developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 hover:text-white transition duration-200"
                  >
                    <Github size={14} className="text-slate-400" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Direct Inquiries</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <a
                    href="mailto:haroonashraf.dev@gmail.com"
                    className="flex items-center space-x-2 hover:text-white transition-colors"
                  >
                    <Mail size={14} className="text-indigo-400" />
                    <span>haroonashraf.dev@gmail.com</span>
                  </a>

                  <a
                    href="tel:+923214576734"
                    className="flex items-center space-x-2 hover:text-white transition-colors"
                  >
                    <Phone size={14} className="text-rose-400" />
                    <span>+92 321 4576734</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 text-center text-slate-500 text-xs  flex-col sm:flex-row items-center justify-between gap-4 font-mono">
              <span>© {new Date().getFullYear()} HAROON-DEV. All rights reserved.</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
