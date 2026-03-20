"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Send, User, Mail, MessageSquare } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Portfolio Inquiry from ${formData.firstName} ${formData.lastName}`;
    const body = `Name: ${formData.firstName} ${formData.lastName}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    window.location.href = `mailto:mohsinmalik1511@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 bg-[#0a0f1d] relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Avatar & Visuals */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="text-left mb-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Get In Touch</h2>
              <div className="text-slate-400 font-light">Let&apos;s discuss your next project or system architecture.</div>
            </div>

            <div className="relative group">
              {/* Glass Frame for Avatar */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-blue-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl aspect-square max-w-md mx-auto lg:mx-0">
                <Image 
                  src="/images/contact-avatar.jpg" 
                  alt="Mohsin Malik Avatar" 
                  width={800}
                  height={800}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                
                {/* Floating Elements (Mocking social icons from screenshot) */}
                <div className="absolute inset-0 pointer-events-none">
                   <div className="absolute top-1/4 -right-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                      <span className="text-white font-bold text-xs">in</span>
                   </div>
                   <div className="absolute bottom-1/4 -left-4 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                      <span className="text-white font-bold text-xs">Git</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0f1525]/50 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl py-4 pl-12 pr-6 text-white transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl py-4 pl-12 pr-6 text-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl py-4 pl-12 pr-6 text-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-slate-500 ml-1">Your Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-slate-600" size={18} />
                  <textarea 
                    name="message"
                    required
                    placeholder="Let's build something amazing..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl py-6 pl-12 pr-6 text-white transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]"
              >
                Send Message
                <Send size={20} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
