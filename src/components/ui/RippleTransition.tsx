"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RippleTransitionProps {
  imageUrl: string;
}

export function RippleTransition({ imageUrl }: RippleTransitionProps) {
  // Generate a unique filter ID per mount so entering/exiting images don't clash filters
  const [filterId] = useState(() => `ripple-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#070b14]">
      {/* 
        Visually hidden SVG (but NOT display: none, otherwise filters fail)
      */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015 0.02" 
              numOctaves="3" 
              result="noise"
            >
              {/* Slowly flow the water current continuously */}
              <animate 
                attributeName="baseFrequency" 
                dur="8s" 
                values="0.015 0.02; 0.02 0.025; 0.015 0.02" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            >
              {/* 
                When mounted (enter), slam scale to 80 and animate it smoothly down to 0 (clear).
                This makes the image "arrive" through a heavy water distortion that settles.
              */}
              <animate 
                 attributeName="scale" 
                 begin="0s" 
                 dur="1.5s" 
                 values="80; 0" 
                 fill="freeze"
                 keyTimes="0; 1"
                 calcMode="spline"
                 keySplines="0.16 1 0.3 1"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <motion.div
        className="w-full h-full bg-cover bg-center origin-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          filter: `url(#${filterId})` 
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
