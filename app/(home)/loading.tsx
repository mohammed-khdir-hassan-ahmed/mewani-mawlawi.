'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Pinging Logo */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          {/* Ping Ripples */}
          <div className="absolute inset-0 rounded-full bg-[#386641]/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-[#386641]/10 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/image/logo.svg"
              alt="Loading"
              width={160}
              height={160}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Loading Text */}
      
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { 
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
