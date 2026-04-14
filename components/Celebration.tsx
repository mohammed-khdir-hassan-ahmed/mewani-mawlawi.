'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Confetti {
  id: string;
  left: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  drift: number;
  size: number;
}

export default function Celebration() {
  const [isVisible, setIsVisible] = useState(true);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [mounted, setMounted] = useState(false);

  const colors = ['#386641', '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FF1493', '#32CD32', '#FF69B4', '#87CEEB', '#FFB6C1'];

  useEffect(() => {
    setMounted(true);

    // Generate confetti pieces
    const newConfetti: Confetti[] = [];
    Array.from({ length: 100 }).forEach((_, i) => {
      newConfetti.push({
        id: `confetti-${i}`,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8,
        duration: 3 + Math.random() * 1.5,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 150,
        size: 4 + Math.random() * 10,
      });
    });
    setConfetti(newConfetti);

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
      {/* Falling confetti pieces */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="fixed rounded-full"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            boxShadow: `0 0 ${piece.size * 1.5}px ${piece.color}, 0 0 ${piece.size * 2}px ${piece.color}80`,
          }}
          initial={{ y: 0, rotate: piece.rotation, opacity: 1, scale: 0 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: piece.rotation + 720,
            x: piece.drift,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
