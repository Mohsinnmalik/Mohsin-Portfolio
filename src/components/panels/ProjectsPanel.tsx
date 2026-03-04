"use client";

import { ArrowUpRight } from "lucide-react";
import SplitText from "../reactbits/SplitText";
import FadeContent from "../reactbits/FadeContent";

const projects = [
  { 
    id: "1", 
    title: "DocuFlux AI", 
    category: "LLM Medical Application",
    desc: "A medical documentation assistant with voice input and generative AI scribe workflows.",
    tags: ["React", "Node.js", "MongoDB", "Gemini AI"]
  },
  { 
    id: "2", 
    title: "SafeHer AI", 
    category: "Edge AI Surveillance",
    desc: "Hybrid AI surveillance system using ESP32-CAM and YOLOv5 for anomaly detection.",
    tags: ["Python", "OpenCV", "YOLOv5", "IoT"]
  },
  { 
    id: "3", 
    title: "Dynamic Resume AI", 
    category: "Generative Structured Systems",
    desc: "A live SaaS platform that constructs resumes dynamically through AI mentor interactions.",
    tags: ["Next.js", "GPT-4", "Tailwind"]
  }
];

export function ProjectsPanel() {
  return (
    <section id="projects" className="py-24 bg-[#0B1121] text-slate-300 relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <SplitText
            text="My Projects"
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            delay={30}
            duration={1}
            ease="power2.out"
          />
          <FadeContent blur={true} duration={1} ease="power2.out" initialOpacity={0} delay={200}>
            <p className="text-slate-400">A showcase of my recent production systems and applications.</p>
          </FadeContent>
        </div>
        
        <div className="flex flex-col gap-10">
          {projects.map((p, i) => (
            <FadeContent 
              key={p.id}
              blur={true} 
              duration={0.8} 
              ease="power2.out" 
              initialOpacity={0}
              delay={i * 200}
              className="bg-[#0f1525] rounded-3xl border border-slate-800 overflow-hidden flex flex-col md:flex-row group hover:border-orange-500/30 transition-all"
            >
              {/* Project Image Placeholder */}
              <div className="w-full md:w-5/12 aspect-video md:aspect-auto bg-slate-800/20 relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent"></div>
                <div className="z-10 text-center">
                  <p className="text-orange-500 font-mono text-xs tracking-widest uppercase mb-2">Image</p>
                  <p className="text-slate-500 text-xs px-8">[PROJECT THUMBNAIL PLACEHOLDER]</p>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8 md:p-10 w-full md:w-7/12 flex flex-col justify-center">
                <span className="text-orange-500 font-mono text-xs tracking-widest uppercase mb-2 block">{p.category}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{p.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed bg-[#1a2336] p-4 rounded-xl border border-slate-700/50">
                  {p.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-[#0a0f1d] text-slate-300 text-xs rounded-full border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-auto">
                  <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full font-medium text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                    View Live <ArrowUpRight size={16} />
                  </button>
                  <button className="px-6 py-3 bg-transparent border border-slate-700 text-white rounded-full font-medium text-sm hover:bg-[#1a2336] transition-colors">
                    Source Code
                  </button>
                </div>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
