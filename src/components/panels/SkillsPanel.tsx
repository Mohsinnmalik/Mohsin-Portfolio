"use client";

import { motion } from "framer-motion";
import SplitText from "../reactbits/SplitText";
import FadeContent from "../reactbits/FadeContent";

const skills = [
  { name: "React / Next.js", level: "95%" },
  { name: "Node.js & TypeScript", level: "90%" },
  { name: "Python / FastAPI", level: "85%" },
  { name: "Tailwind CSS", level: "95%" },
  { name: "Machine Learning (LLMs)", level: "80%" },
  { name: "Cloud / DevOps", level: "75%" }
];

export function SkillsPanel() {
  return (
    <section id="skills" className="py-24 bg-[#0a0f1d] text-slate-300 relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <SplitText
            text="My Skills"
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            delay={30}
            duration={1}
            ease="power2.out"
          />
          <FadeContent blur={true} duration={1} ease="power2.out" initialOpacity={0} delay={200}>
            <p className="text-slate-400">Technologies and tools I work with to build scalable systems.</p>
          </FadeContent>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <FadeContent
              key={skill.name}
              blur={true} 
              duration={0.8} 
              ease="power2.out" 
              initialOpacity={0}
              delay={i * 100}
              className="bg-[#0f1525] p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-white">{skill.name}</span>
                <span className="text-orange-500 font-mono text-sm">{skill.level}</span>
              </div>
              <div className="w-full bg-[#1a2336] h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-orange-600 to-orange-400 h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: skill.level }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
