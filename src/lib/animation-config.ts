/**
 * Single source of truth for all animation timing, easing, and stagger values.
 * Import and reference these instead of hardcoding values in components.
 */
export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    verySlow: 1.2,
  },
  ease: {
    smooth: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
    enter: [0, 0, 0.2, 1] as [number, number, number, number],
  },
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
  },
} as const;

/** Framer Motion variants for staggered list entrance */
export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ANIMATION.stagger.normal,
      delayChildren: 0.1,
    },
  },
};

/** Framer Motion variants for individual list item entrance (no blur) */
export const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION.duration.slow,
      ease: ANIMATION.ease.smooth,
    },
  },
};
