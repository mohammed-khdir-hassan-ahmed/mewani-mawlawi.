'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Celebration() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide celebration after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  // Fireworks burst positions
  const bursts = [
    { x: '30%', y: '25%' },
    { x: '70%', y: '25%' },
    { x: '50%', y: '50%' },
    { x: '25%', y: '65%' },
    { x: '75%', y: '65%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Multiple firework bursts */}
      {bursts.map((burst, burstIdx) => (
        <div key={`burst-${burstIdx}`}>
          {/* Particles from each burst */}
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (360 / 30) * i;
            const distance = 200 + Math.random() * 150;
            const rad = (angle * Math.PI) / 180;
            const endX = Math.cos(rad) * distance;
            const endY = Math.sin(rad) * distance;

            return (
              <motion.div
                key={`particle-${burstIdx}-${i}`}
                className="fixed w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#386641', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FF1493', '#32CD32'][
                    Math.floor(Math.random() * 7)
                  ],
                  left: burst.x,
                  top: burst.y,
                  boxShadow: 'glow',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: endX,
                  y: endY,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: burstIdx * 0.2 + i * 0.01,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Glowing circles at burst points */}
      {bursts.map((burst, i) => (
        <motion.div
          key={`glow-${i}`}
          className="fixed rounded-full"
          style={{
            width: '40px',
            height: '40px',
            left: burst.x,
            top: burst.y,
            backgroundColor: ['#386641', '#FFD700', '#FF6B6B'][i % 3],
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Spiral trails */}
      {[0, 1].map((trailIdx) => (
        <motion.div
          key={`spiral-${trailIdx}`}
          className="fixed"
          style={{
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`spiral-particle-${trailIdx}-${i}`}
              className="fixed w-1.5 h-1.5 rounded-full bg-[#FFD700]"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ opacity: 0 }}
              animate={{
                x: Math.cos((i / 20) * Math.PI * 4) * 150,
                y: Math.sin((i / 20) * Math.PI * 4) * 150 - i * 10,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: trailIdx * 0.3 + i * 0.05,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Center pulse waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`pulse-${i}`}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            width: '40px',
            height: '40px',
            borderColor: ['#386641', '#FFD700', '#FF6B6B'][i],
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{
            duration: 1.3 + i * 0.2,
            delay: i * 0.15,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
