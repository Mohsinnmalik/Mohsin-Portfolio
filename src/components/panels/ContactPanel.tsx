"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    icon: <Linkedin size={24} />,
    url: "https://www.linkedin.com/in/mohsin-malik-0382b629b",
    color: "#0077B5",
    label: "/in/mohsin-malik"
  },
  {
    name: "GitHub",
    icon: <Github size={24} />,
    url: "https://github.com/Mohsinnmalik",
    color: "#333",
    label: "@Mohsinnmalik"
  },
  {
    name: "Email",
    icon: <Mail size={24} />,
    url: "mailto:mohsinmalik1511@gmail.com",
    color: "#EA4335",
    label: "mohsinmalik1511@gmail.com"
  },
  {
    name: "Call Me",
    icon: <Phone size={24} />,
    url: "tel:+919325808063",
    color: "#34A853",
    label: "+91 9325808063"
  }
];

export function ContactPanel() {
  return (
    <section id="contact" className="relative py-24 bg-black overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
              Let&apos;s Build Something <span className="text-orange-500">Incredible.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
              Whether you have a specific AI integration challenge or a large-scale web project, 
              I&apos;m ready to turn your vision into a production-ready reality.
            </p>
          </motion.div>

          {/* Social Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {SOCIAL_LINKS.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                  style={{ backgroundColor: `${link.color}20`, color: link.color }}
                >
                  {link.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{link.name}</h3>
                <span className="text-slate-500 text-xs font-mono">{link.label}</span>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="text-white/40" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Footer Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/10 gap-8"
          >
            <div className="flex flex-col items-center md:items-start gap-2">
               <span className="text-white font-bold text-xl tracking-tighter">MOHSIN MALIK</span>
               <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em]">Full Stack AI Product Builder</p>
            </div>
            
            <div className="text-slate-600 text-[10px] font-mono uppercase tracking-widest text-center md:text-right">
              &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED • BUILT BY CREATION DAY 1
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
