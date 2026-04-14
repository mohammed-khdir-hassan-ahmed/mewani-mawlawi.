'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce">
          <Image
            src="/image/logo.svg"
            alt="Loading"
            width={120}
            height={120}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @media (max-width: 768px) {
          .animate-bounce {
            animation: bounce 0.8s infinite;
          }
        }
      `}</style>
    </div>
  );
}
