import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        'service_y5e7nnd',
        'template_73gc59l',
        formData,
        '_sJcsQDbJTLj1WYH2'
      )
      .then(() => {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error(error);
        alert('Something went wrong. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="contact" className="py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-indigo-500 uppercase mb-4">
              Contact
            </h2>

            <h3 className="text-3xl md:text-5xl font-bold mb-8">
              Let's build something <br />great together.
            </h3>

            <p className="text-slate-400 text-lg mb-12">
              Whether you have a specific project in mind or just want to chat about tech,
              feel free to reach out.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-6 p-6 bg-slate-800/20 border border-white/5 rounded-2xl">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                    Email
                  </p>
                  <p className="text-lg text-slate-200">
                    haroonashraf.dev@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 p-6 bg-slate-800/20 border border-white/5 rounded-2xl">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                    Location
                  </p>
                  <p className="text-lg text-slate-200">
                    Remote / Worldwide
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-800/40 border border-white/5 p-8 md:p-10 rounded-3xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-semibold text-slate-300 ml-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 outline-none"
                  placeholder="Abc"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="emailAddress" className="text-sm font-semibold text-slate-300 ml-1">
                  Email Address
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 outline-none"
                  placeholder="abc@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-300 ml-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 outline-none resize-none"
                  placeholder="How can I help you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
                <Send size={18} />
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;