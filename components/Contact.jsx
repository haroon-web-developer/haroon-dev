import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Clock, ExternalLink, MessageSquare, Compass } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        'service_y5e7nnd',
        'template_73gc59l',
        formData,
        '_sJcsQDbJTLj1WYH2'
      )
      .then(() => {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      })
      .catch((error) => {
        console.error(error);
        setStatus('error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const whatsappUrl = `https://api.whatsapp.com/send?phone=923214576734&text=${encodeURIComponent("Hi Haroon, I want to discuss a website project in Islamabad.")}`;
  const googleMapsUrl = "https://www.google.com/maps/place/Islamabad,+Islamabad+Capital+Territory,+Pakistan/@33.6844202,73.0478848,12z";

  return (
    <section id="contact" className="py-24 bg-[#0a0f1d] relative overflow-hidden text-left">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-4">
            <Compass size={13} className="text-indigo-400 animate-spin-slow" />
            <span>ISLAMABAD STUDIO & GLOBAL CLIENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Let's Build Something <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400">
              Extraordinary Together.
            </span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed">
            Based in Islamabad, Pakistan. Available for in-person project strategy meetups across Islamabad & Rawalpindi, as well as worldwide remote collaborations.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Left Column: Direct Channels & Operational Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Location Card */}
            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex items-start space-x-4 group hover:border-indigo-500/30 transition-colors">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0 mt-1">
                <MapPin size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-indigo-400 uppercase tracking-widest font-mono font-bold">
                  Operational Hub
                </p>
                <p className="text-base text-white font-bold mt-0.5">
                  Islamabad, Pakistan
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Islamabad Capital Territory, 44000. Serving Blue Area, all F & G Sectors, I-8, DHA, Bahria Town & Rawalpindi.
                </p>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex items-start space-x-4 group hover:border-emerald-500/30 transition-colors">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 flex-shrink-0 mt-1">
                <Phone size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-emerald-400 uppercase tracking-widest font-mono font-bold">
                  Phone & WhatsApp
                </p>
                <a
                  href="tel:+923214576734"
                  className="text-base text-white font-bold block mt-0.5 hover:text-emerald-300 transition"
                >
                  +92 321 4576734
                </a>
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <MessageSquare size={13} />
                    <span>Chat Directly on WhatsApp →</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email Channel */}
            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex items-start space-x-4 group hover:border-rose-500/30 transition-colors">
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 flex-shrink-0 mt-1">
                <Mail size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-rose-400 uppercase tracking-widest font-mono font-bold">
                  Email Inquiries
                </p>
                <a
                  href="mailto:haroonashraf.dev@gmail.com"
                  className="text-base text-white font-bold block mt-0.5 hover:text-rose-300 transition truncate"
                >
                  haroonashraf.dev@gmail.com
                </a>
                <p className="text-xs text-slate-400 mt-1">
                  Average response time: &lt; 2 hours
                </p>
              </div>
            </div>

            {/* Hours & Availability */}
            <div className="p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex items-start space-x-4 group hover:border-amber-500/30 transition-colors">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 flex-shrink-0 mt-1">
                <Clock size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-mono font-bold">
                  Working Hours
                </p>
                <p className="text-sm text-white font-bold mt-0.5">
                  Monday – Sunday: 9:00 AM – 11:00 PM PKT
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Flexible time slots for US, UK, Gulf & Australian clients.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-900/60 border border-white/10 p-6 sm:p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">Send a Message</h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Fill in your requirements below for a detailed project breakdown and timeline estimate.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-semibold text-slate-300">
                    Your Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 outline-none transition"
                    placeholder="e.g. Ali Khan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="emailAddress" className="text-xs font-semibold text-slate-300">
                    Email Address *
                  </label>
                  <input
                    id="emailAddress"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 outline-none transition"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phoneNum" className="text-xs font-semibold text-slate-300">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  id="phoneNum"
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 outline-none transition"
                  placeholder="+92 3XX XXXXXXX"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-slate-300">
                  Project Brief & Requirements *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 outline-none resize-none transition"
                  placeholder="Tell us about your business goals, target audience, preferred timeline, and any reference sites..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:via-purple-500 hover:to-rose-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Transmitting..." : "Send Project Inquiry"}</span>
                <Send size={16} />
              </button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center text-xs font-semibold mt-4"
                >
                  🚀 Message sent successfully! Haroon will get back to you within 2 hours.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-center text-xs font-semibold mt-4"
                >
                  ❌ Something went wrong. Please WhatsApp or email directly at haroonashraf.dev@gmail.com!
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Embedded Google Map Section for Local Authority */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 sm:p-8 backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Islamabad Capital Territory & Twin Cities
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Serving all Islamabad Sectors (Blue Area, F, G, I Sectors, DHA, Bahria Town) & Rawalpindi — In-Person & Remote Strategy Sessions
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-indigo-300 hover:text-white transition self-start sm:self-center"
            >
              <ExternalLink size={14} />
              <span>Open on Google Maps</span>
            </a>
          </div>

          {/* Responsive Map Container */}
          <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
            <iframe
              title="Haroon Dev Operational Service Zone in Islamabad, Pakistan"
              src="https://maps.google.com/maps?q=Islamabad,+Pakistan&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] font-mono text-slate-300 shadow-xl flex items-center gap-2 pointer-events-none">
              <MapPin size={14} className="text-rose-400" />
              <span>Islamabad Capital Territory, PK</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;