"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "15+", label: "Systems Deployed" },
  { value: "$2M+", label: "Revenue Generated" },
  { value: "90%", label: "Latency Optimized" }
];

export function ImpactPanel() {
  return (
    <section className="h-screen flex items-center justify-start px-6 md:px-24 container mx-auto pointer-events-none">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass p-10 md:p-12 rounded-2xl max-w-xl pointer-events-auto border border-white/10 relative overflow-hidden backdrop-blur-md bg-white/5"
      >
        <h2 className="text-xs font-mono text-neutral-500 mb-10 tracking-widest uppercase">
          {/* Measurable Impact */}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl font-light text-white">{stat.value}</span>
              <span className="text-xs font-mono uppercase text-neutral-500">{stat.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="text-sm text-neutral-400 italic font-light leading-relaxed">
            &quot;The hallmark of a great AI engineer isn&apos;t just knowing the latest models, but knowing how to architect a system where AI provides concrete ROI without breaking the bank on compute.&quot;
          </div>
        </div>
      </motion.div>
    </section>
  );
}
