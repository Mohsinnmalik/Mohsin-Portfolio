"use client";

import { Github, Linkedin, Mail, Phone } from "lucide-react";

export function TraditionalFooter() {
  const socialLinks = [
    { 
      name: "LinkedIn", 
      icon: <Linkedin size={20} />, 
      url: "https://www.linkedin.com/in/mohsin-malik-0382b629b" 
    },
    { 
      name: "GitHub", 
      icon: <Github size={20} />, 
      url: "https://github.com/Mohsinnmalik" 
    },
    { 
      name: "Email", 
      icon: <Mail size={20} />, 
      url: "mailto:mohsinmalik1511@gmail.com" 
    },
    { 
      name: "Phone", 
      icon: <Phone size={20} />, 
      url: "tel:+919325808063" 
    }
  ];

  return (
    <footer className="py-12 bg-black border-t border-white/5 relative z-20">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-bold tracking-tighter text-white">
            MOHSIN<span className="text-orange-500">.MALIK</span>
          </span>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
            Full Stack & AI Engineer
          </p>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
            Built and Created by Mohsin Malik
          </p>
        </div>
      </div>
    </footer>
  );
}
