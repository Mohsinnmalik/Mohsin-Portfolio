"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download, FileText, Sparkles } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [activeTab, setActiveTab] = useState<"fullstack" | "genai">("fullstack");

  const resumes = {
    fullstack: {
      title: "Full Stack Developer",
      image: "/images/fullstack-resume.jpg",
      description: "Focused on scalable SaaS, MERN stack, and high-performance web systems."
    },
    genai: {
      title: "Generative AI Engineer",
      image: "/images/genai-resume.jpg",
      description: "Focused on LLM integration, AI automation, and intelligent product design."
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumes[activeTab].image;
    link.download = `Mohsin_Malik_${activeTab}_Resume.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh] pointer-events-auto"
          >
            {/* Left Side: Controls & Info */}
            <div className="w-full md:w-1/3 p-8 border-r border-white/10 flex flex-col justify-between bg-black/40">
              <div>
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-bold text-white leading-tight">Expertise Selection</h2>
                   <button
                      onClick={onClose}
                      className="md:hidden p-2 rounded-full bg-white/5 text-white/50 hover:text-white"
                      type="button"
                    >
                      <X size={20} />
                    </button>
                </div>
                
                <p className="text-slate-400 text-sm mb-8">Choose a version to view and download based on your requirements.</p>

                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab("fullstack")}
                    type="button"
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border ${
                      activeTab === "fullstack" 
                        ? "bg-orange-500/10 border-orange-500/50 text-white" 
                        : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className={`p-2 rounded-lg ${activeTab === "fullstack" ? "bg-orange-500 text-white" : "bg-white/10 text-slate-500"}`}>
                      <FileText size={18} />
                    </span>
                    <span className="text-left">
                      <span className="text-sm font-bold block">Full Stack Dev</span>
                      <span className="text-[10px] opacity-60 font-mono block">SCALABLE SAAS</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("genai")}
                    type="button"
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border ${
                      activeTab === "genai" 
                        ? "bg-blue-500/10 border-blue-500/50 text-white" 
                        : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className={`p-2 rounded-lg ${activeTab === "genai" ? "bg-blue-500 text-white" : "bg-white/10 text-slate-500"}`}>
                      <Sparkles size={18} />
                    </span>
                    <span className="text-left">
                      <span className="text-sm font-bold block">GenAI Engineer</span>
                      <span className="text-[10px] opacity-60 font-mono block">LLM & AUTOMATION</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 leading-relaxed italic mb-4">
                  &quot;{resumes[activeTab].description}&quot;
                </p>
                <button
                  onClick={handleDownload}
                  type="button"
                  className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                >
                  <Download size={16} />
                  Download Resume
                </button>
              </div>
            </div>

            {/* Right Side: Preview */}
            <div className="w-full md:w-2/3 bg-black/60 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5 }}
                 className="relative w-full h-full shadow-2xl rounded-lg overflow-hidden flex items-start justify-center"
               >
                 <div className="w-full h-full overflow-y-auto custom-scrollbar bg-white">
                     <Image
                       src={resumes[activeTab].image}
                       alt="Resume Layout"
                       width={1200}
                       height={1600}
                       className="w-full h-auto"
                     />
                 </div>
                 
                 {/* Close Button Desktop */}
                 <button
                    onClick={onClose}
                    type="button"
                    className="hidden md:flex absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/50 hover:text-white transition-all hover:scale-110"
                  >
                    <X size={20} />
                  </button>
               </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}