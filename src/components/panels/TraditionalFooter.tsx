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
    <footer className="py-12 bg-brutal-yellow border-t-4 border-black relative z-20 text-black">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-2xl font-black tracking-tight text-black font-display uppercase">
            MOHSIN<span className="text-brutal-purple font-extrabold">.MALIK</span>
          </span>
          <div className="text-xs text-black font-mono font-bold uppercase tracking-wider">
            Full Stack & AI Engineer
          </div>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black hover:bg-brutal-purple hover:text-white transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000]"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <div className="text-xs text-black font-mono font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} • Handcrafted by Mohsin
          </div>
        </div>
      </div>
    </footer>
  );
}
