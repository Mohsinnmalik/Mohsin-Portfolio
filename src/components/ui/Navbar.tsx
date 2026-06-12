"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

const NAV_LINKS = [
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const aiMode = useUIStore((state) => state.aiMode);

  // Toggle shadow or slight scale when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Find offset to adjust for floating navbar height
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileOpen(false);
  };

  // Close mobile menu and keep DOM stable on aiMode change
  useEffect(() => {
    if (aiMode) {
      setIsMobileOpen(false);
    }
  }, [aiMode]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ 
          y: aiMode ? -120 : 0, 
          x: "-50%", 
          opacity: aiMode ? 0 : 1 
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ left: "50%" }}
        className={`fixed z-50 w-[calc(100%-2rem)] max-w-7xl bg-white border-3 border-black transition-all duration-300 flex items-center justify-between px-6 md:px-8 ${
          aiMode ? "pointer-events-none" : ""
        } ${
          isScrolled
            ? "top-2 h-14 shadow-[3px_3px_0px_#000]"
            : "top-4 h-16 shadow-[6px_6px_0px_#000]"
        }`}
      >
        {/* Logo — scrolls to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-black font-extrabold text-xl tracking-tight hover:text-brutal-purple transition-colors duration-300 font-display flex items-center"
        >
          MOHSIN MALIK<span className="text-brutal-purple font-black text-2xl">.</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-black font-mono font-bold text-sm tracking-wide px-3 py-1 rounded transition-all duration-200 border-2 border-transparent hover:border-black hover:bg-brutal-yellow"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="brutal-btn bg-brutal-purple text-white text-xs md:text-sm px-4 py-2 hover:bg-brutal-purple"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-1.5 border-2 border-black bg-brutal-yellow text-black hover:bg-brutal-purple hover:text-white transition-colors"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -10, x: "-50%" }}
            transition={{ duration: 0.2 }}
            style={{ left: "50%" }}
            className={`fixed z-40 w-[calc(100%-2rem)] max-w-7xl bg-white border-3 border-black shadow-[4px_4px_0px_#000] rounded md:hidden transition-all duration-300 ${
              isScrolled ? "top-[70px]" : "top-[88px]"
            }`}
          >
            <div className="flex flex-col py-2 font-mono font-bold">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-6 py-3.5 text-left text-black hover:bg-brutal-yellow border-b border-black last:border-0 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="px-6 pt-3 pb-3">
                <button
                  onClick={() => scrollTo("contact")}
                  className="w-full brutal-btn bg-brutal-purple text-white py-2.5 text-center text-sm"
                >
                  Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
