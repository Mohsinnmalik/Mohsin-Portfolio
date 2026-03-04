"use client";

import { Mail, Github, Linkedin, Smartphone } from "lucide-react";
import SplitText from "../reactbits/SplitText";
import FadeContent from "../reactbits/FadeContent";
import Image from "next/image";

export function ContactPanel() {
  return (
    <section id="contact" className="py-24 bg-[#0a0f1d] text-slate-300 relative overflow-hidden z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Image & Socials */}
          {/* Left: Image & Socials */}
          <FadeContent 
            blur={true} 
            duration={1.2} 
            ease="power2.out" 
            initialOpacity={0}
            className="w-full lg:w-5/12 flex flex-col justify-center items-center lg:items-start"
          >
            <div className="text-center lg:text-left mb-10 w-full">
              <SplitText
                text="Get In Touch"
                className="text-3xl md:text-5xl font-bold text-white mb-4"
                delay={30}
                duration={1}
                ease="power2.out"
              />
              <p className="text-slate-400">Let&apos;s discuss your next project or system architecture.</p>
            </div>

            {/* The 3D Avatar Image with background-removal via mix-blend-lighten */}
            <div className="relative w-full aspect-[4/5] max-w-lg overflow-hidden flex items-center justify-center mb-10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent mix-blend-overlay rounded-full blur-3xl opacity-50 z-0"></div>
              {/* Note: mix-blend-lighten heavily reduces the dark background to transparent against our dark-navy site background. */}
              <Image 
                src="/images/contact-avatar.jpg" 
                alt="Get In Touch"
                fill
                className="object-cover mix-blend-lighten filter brightness-110 contrast-125 select-none z-10"
                style={{
                  maskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)",
                }}
              />
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-[#0f1525] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#0f1525] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#0f1525] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#0f1525] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-colors">
                <Smartphone size={20} />
              </a>
            </div>
          </FadeContent>

          {/* Right: Contact Form */}
          <FadeContent 
            blur={true} 
            duration={1.2} 
            ease="power2.out" 
            initialOpacity={0}
            delay={200}
            className="w-full lg:w-7/12"
          >
            <div className="bg-[#0f1525] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 ml-1">First Name</label>
                    <input type="text" className="w-full bg-[#1a2336] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 ml-1">Last Name</label>
                    <input type="text" className="w-full bg-[#1a2336] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-2 ml-1">Email Address</label>
                  <input type="email" className="w-full bg-[#1a2336] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2 ml-1">Your Message</label>
                  <textarea rows={5} className="w-full bg-[#1a2336] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none" placeholder="Let's build something amazing..."></textarea>
                </div>

                <button className="w-full py-4 mt-2 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                  Send Message
                </button>
              </form>
            </div>
          </FadeContent>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-32 border-t border-slate-800 pt-8 pb-12 w-full text-center">
        <p className="text-slate-500 text-sm">© 2026 Mohsin Malik | Systems & Software Engineer. All rights reserved.</p>
      </div>
    </section>
  );
}
