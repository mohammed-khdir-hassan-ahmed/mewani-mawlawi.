'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: string;
  distance: number;
  color: string;
  burstIdx: number;
  particleIdx: number;
}

interface SpiralParticle {
  id: string;
  x: number;
  y: number;
  trailIdx: number;
  particleIdx: number;
}

export default function Celebration() {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [spiralParticles, setSpiralParticles] = useState<SpiralParticle[]>([]);
  const [mounted, setMounted] = useState(false);

  const bursts = [
    { x: '10%', y: '20%' },
    { x: '30%', y: '15%' },
    { x: '50%', y: '10%' },
    { x: '70%', y: '15%' },
    { x: '90%', y: '20%' },
    { x: '20%', y: '60%' },
    { x: '50%', y: '55%' },
    { x: '80%', y: '60%' },
    { x: '35%', y: '85%' },
    { x: '65%', y: '85%' },
  ];

  const colors = ['#386641', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FF1493', '#32CD32'];

  useEffect(() => {
    setMounted(true);

    // Generate particles on client only
    const newParticles: Particle[] = [];
    bursts.forEach((_, burstIdx) => {
      Array.from({ length: 30 }).forEach((_, i) => {
        newParticles.push({
          id: `particle-${burstIdx}-${i}`,
          distance: 200 + Math.random() * 150,
          color: colors[Math.floor(Math.random() * colors.length)],
          burstIdx,
          particleIdx: i,
        });
      });
    });
    setParticles(newParticles);

    // Generate spiral particles
    const newSpiralParticles: SpiralParticle[] = [];
    Array.from({ length: 2 }).forEach((_, trailIdx) => {
      Array.from({ length: 20 }).forEach((_, i) => {
        newSpiralParticles.push({
          id: `spiral-${trailIdx}-${i}`,
          x: Math.cos((i / 20) * Math.PI * 4) * 150,
          y: Math.sin((i / 20) * Math.PI * 4) * 150 - i * 10,
          trailIdx,
          particleIdx: i,
        });
      });
    });
    setSpiralParticles(newSpiralParticles);

    // Hide celebration after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Multiple firework bursts */}
      {particles.map((particle) => {
        const burst = bursts[particle.burstIdx];
        const angle = (360 / 30) * particle.particleIdx;
        const rad = (angle * Math.PI) / 180;
        const endX = Math.cos(rad) * particle.distance;
        const endY = Math.sin(rad) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            className="fixed w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
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
              delay: particle.burstIdx * 0.2 + particle.particleIdx * 0.01,
              ease: 'easeOut',
            }}
          />
        );
      })}

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
      {spiralParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed w-1.5 h-1.5 rounded-full bg-[#FFD700]"
          style={{
            left: '50%',
            top: '50%',
          }}
          initial={{ opacity: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: particle.trailIdx * 0.3 + particle.particleIdx * 0.05,
            ease: 'easeInOut',
          }}
        />
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
