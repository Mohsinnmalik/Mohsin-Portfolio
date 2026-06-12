"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import './LogoLoop.css';

const LogoLoop = ({
  items = [],
  gap = 32,
  logoHeight = 28,
  speed = 40,
  fadeColorAuto = true,
  className = '',
  vertical = false,
  pauseOnHover = true,
  scaleOnHover = 1.05
}: {
  items?: Array<any>;
  gap?: number;
  logoHeight?: number;
  speed?: number;
  fadeColorAuto?: boolean;
  className?: string;
  vertical?: boolean;
  pauseOnHover?: boolean;
  scaleOnHover?: number;
}) => {
  // Calculate marquee speed based on number of items to keep movement linear
  const duration = useMemo(() => {
    const itemCount = items.length || 1;
    return Math.max(5, (itemCount * 80) / Math.max(1, speed));
  }, [items.length, speed]);

  const cardStyle = useMemo(() => {
    return {
      '--logoloop-gap': `${gap}px`,
      '--logoloop-logoHeight': `${logoHeight}px`,
      '--logoloop-duration': `${duration}s`,
      '--logoloop-pause-state': pauseOnHover ? 'paused' : 'running'
    } as React.CSSProperties;
  }, [gap, logoHeight, duration, pauseOnHover]);

  return (
    <div
      className={`logoloop ${vertical ? 'logoloop--vertical' : ''} ${className}`}
      style={cardStyle}
    >
      <div
        className={`logoloop__track ${vertical ? 'logoloop__track--vertical' : 'logoloop__track--horizontal'}`}
      >
        {items.map((item, index) => (
          <div
            key={`orig-${index}`}
            className={`logoloop__item ${scaleOnHover ? 'logoloop--scale-hover' : ''}`}
            style={scaleOnHover ? { transition: 'transform 0.3s', cursor: 'default' } : {}}
            onMouseEnter={(e) => {
              if (scaleOnHover) e.currentTarget.style.transform = `scale(${scaleOnHover})`;
            }}
            onMouseLeave={(e) => {
              if (scaleOnHover) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {item.custom ? (
              item.custom
            ) : item.image ? (
              <Image 
                src={item.url || item.image} 
                alt={item.name} 
                width={200}
                height={100}
                unoptimized
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
              />
            ) : item.icon ? (
              item.icon
            ) : (
              <span style={{ fontSize: '1em', fontWeight: 600 }}>{item.name}</span>
            )}
          </div>
        ))}
        {/* Clone for seamless loop */}
        {items.map((item, index) => (
          <div
            key={`clone-${index}`}
            className={`logoloop__item ${scaleOnHover ? 'logoloop--scale-hover' : ''}`}
            style={scaleOnHover ? { transition: 'transform 0.3s', cursor: 'default' } : {}}
            onMouseEnter={(e) => {
              if (scaleOnHover) e.currentTarget.style.transform = `scale(${scaleOnHover})`;
            }}
            onMouseLeave={(e) => {
              if (scaleOnHover) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {item.custom ? (
              item.custom
            ) : item.image ? (
              <Image 
                src={item.url || item.image} 
                alt={item.name} 
                width={200}
                height={100}
                unoptimized
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
              />
            ) : item.icon ? (
              item.icon
            ) : (
              <span style={{ fontSize: '1em', fontWeight: 600 }}>{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
