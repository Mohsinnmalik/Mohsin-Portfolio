"use client";

import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#0a0f1d] relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
            Let&apos;s Build Something <span className="text-orange-500">Incredible.</span>
          </h2>
          <div className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
            Whether you have a specific AI integration challenge or a large-scale web project, 
            I&apos;m ready to turn your vision into a production-ready reality.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
