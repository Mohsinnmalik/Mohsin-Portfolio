"use client";
import React, { useRef, useEffect } from 'react';
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
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (trackRef.current && trackRef.current.parentElement) {
        const track = trackRef.current;
        const container = track.parentElement;
        const speedPerMs = speed / 1000;
        const moveAmount = speedPerMs * dt;

        if (vertical) {
          const firstItem = track.children[0] as HTMLElement;
          if (firstItem) {
            const itemHeight = firstItem.offsetHeight + gap;
            
            const currentTransform = new DOMMatrixReadOnly(window.getComputedStyle(track).getPropertyValue('transform')).m42;
            const newTransform = currentTransform - moveAmount;
            track.style.transform = `translateY(${newTransform}px)`;

            if (Math.abs(newTransform) >= itemHeight) {
              track.style.transform = `translateY(${newTransform + itemHeight}px)`;
              track.appendChild(firstItem);
            }
          }
        } else {
          const firstItem = track.children[0] as HTMLElement;
          if (firstItem) {
            const itemWidth = firstItem.offsetWidth + gap;

            const currentTransform = new DOMMatrixReadOnly(window.getComputedStyle(track).getPropertyValue('transform')).m41;
            const newTransform = currentTransform - moveAmount;
            track.style.transform = `translateX(${newTransform}px)`;

            if (Math.abs(newTransform) >= itemWidth) {
              track.style.transform = `translateX(${newTransform + itemWidth}px)`;
              track.appendChild(firstItem);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, gap, vertical]);

  return (
    <div
      className={`logoloop ${vertical ? 'logoloop--vertical' : ''} ${className}`}
      style={
        {
          '--logoloop-gap': `${gap}px`,
          '--logoloop-logoHeight': `${logoHeight}px`
        } as React.CSSProperties
      }
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        style={{
          transition: pauseOnHover ? 'animation-play-state 0.3s' : '',
          animationPlayState: 'running'
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = 'paused';
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = 'running';
          }
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
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
        {/* Clone for seamless loop initialization */}
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
