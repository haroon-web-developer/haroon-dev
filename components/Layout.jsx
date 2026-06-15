
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter, Mail , Phone } from 'lucide-react';



const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    // { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen">
     <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    isScrolled
      ? "bg-[#0f172a]/70 backdrop-blur-xl border-b border-white/10 py-3"
      : "bg-transparent py-6"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
    
    {/* Logo */}
    <motion.a
      href="#"
      whileHover={{ scale: 1.05 }}
      className="text-2xl font-bold gradient-text tracking-tighter"
    >
      HAROON.DEV
    </motion.a>

    {/* Desktop Nav */}
    <div className="hidden md:flex items-center space-x-10">
      {navLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          whileHover={{ y: -2 }}
          className="relative text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          {link.name}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full" />
        </motion.a>
      ))}

      <motion.a
        href="https://api.whatsapp.com/send?phone=923214576734&text=Hello%20Haroon%20I%20visited%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project."
        target="_blank"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
      >
        Connect Me
      </motion.a>
    </div>

    {/* Mobile Toggle */}
    <motion.button
      aria-label="Toggle menu"
      whileTap={{ scale: 0.9 }}
      animate={{ rotate: isMenuOpen ? 90 : 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden text-slate-300"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
    </motion.button>
  </div>
</nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0f172a] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-semibold text-slate-300 border-b border-white/10 pb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                className="w-full py-4 rounded-xl bg-indigo-600 text-white text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>

      <footer className="bg-[#0f172a] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold gradient-text mb-4">HAROON.DEV</h3>
              <p className="text-slate-400 max-w-sm">
                Creating immersive digital experiences with modern web technologies. 
                Always learning, always building.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Socials</h4>
              <div className="flex space-x-4">
                <a href="https://github.com/haroonashraf-dev?tab=repositories" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><Github size={20} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><Linkedin size={20} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><Twitter size={20} /></a>
              </div>
            </div>
           <div>
  <h4 className="font-bold mb-4">Contact</h4>

  {/* Email */}
  <a
    href="mailto:haroonashraf.dev@gmail.com"
    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-2"
  >
    <Mail size={16} />
    <span>haroonashraf.dev@gmail.com</span>
  </a>

  {/* Phone */}
  <a
    href="tel:+92137656641"
    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
  >
    <Phone size={16} />
    <span>+92 137386619</span>
  </a>
</div>

          </div>
          <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Haroon. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
