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
    const bodyText = `Name: ${formData.firstName} ${formData.lastName}\r\nEmail: ${formData.email}\r\n\r\nMessage:\r\n${formData.message}`;
    const mailtoUrl = `mailto:mohsinmalik1511@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="pb-24 bg-[#0a0b10] border-b-4 border-black relative z-30 isolate">
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
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-4 font-display">Get In Touch</h2>
              <div className="text-slate-300 font-mono text-sm md:text-base font-bold uppercase tracking-wider">Let&apos;s discuss your next project or system architecture.</div>
            </div>

            <div className="relative group">
              <div className="relative brutal-card p-4 bg-[#0c0d14] border-3 border-black max-w-md mx-auto lg:mx-0 shadow-[8px_8px_0px_#00f0ff]">
                <Image 
                  src="/images/contact-avatar.jpg" 
                  alt="Mohsin Malik Avatar" 
                  width={800}
                  height={800}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 border-2 border-black"
                />
                
                {/* Floating Elements (Badges) */}
                <div className="absolute inset-0 pointer-events-none">
                   <div className="absolute top-1/4 -right-4 w-12 h-12 bg-blue-600 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] animate-bounce" style={{ animationDuration: '3s' }}>
                      <span className="text-white font-mono font-bold text-xs">in</span>
                   </div>
                   <div className="absolute bottom-1/4 -left-4 w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                      <span className="text-black font-mono font-bold text-xs">Git</span>
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
            className="bg-[#0c0d14] brutal-card border-3 border-black p-6 md:p-10 text-white shadow-[8px_8px_0px_#7c3aed]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] font-bold ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c3aed]" size={18} />
                    <input 
                      id="firstName"
                      type="text" 
                      name="firstName"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#11131e] border-3 border-black focus:shadow-[4px_4px_0px_#7c3aed] rounded-none py-3.5 pl-12 pr-6 text-white placeholder-slate-600 transition-all outline-none font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] font-bold ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c3aed]" size={18} />
                    <input 
                      id="lastName"
                      type="text" 
                      name="lastName"
                      required
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#11131e] border-3 border-black focus:shadow-[4px_4px_0px_#7c3aed] rounded-none py-3.5 pl-12 pr-6 text-white placeholder-slate-600 transition-all outline-none font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] font-bold ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c3aed]" size={18} />
                  <input 
                    id="email"
                    type="email" 
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#11131e] border-3 border-black focus:shadow-[4px_4px_0px_#7c3aed] rounded-none py-3.5 pl-12 pr-6 text-white placeholder-slate-600 transition-all outline-none font-sans"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] font-bold ml-1">Your Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-[#7c3aed]" size={18} />
                  <textarea 
                    id="message"
                    name="message"
                    required
                    placeholder="Let's build something amazing..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#11131e] border-3 border-black focus:shadow-[4px_4px_0px_#7c3aed] rounded-none py-5 pl-12 pr-6 text-white placeholder-slate-600 transition-all outline-none resize-none font-sans"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-3 border-black text-lg font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-3 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] shadow-[4px_4px_0px_#000] transition-all"
              >
                Send Message Protocol
                <Send size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
