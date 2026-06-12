"use client";

import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#0a0b10] relative z-20 border-t-4 border-black">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-8 leading-tight font-display">
            Let&apos;s Build Something <span className="underline decoration-[#00f0ff] decoration-4">Incredible.</span>
          </h2>
          <div className="text-sm md:text-base text-slate-300 font-mono font-bold leading-relaxed max-w-2xl mx-auto uppercase tracking-wider">
            Whether you have a specific AI integration challenge or a large-scale web project, 
            I&apos;m ready to turn your vision into a production-ready reality.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
