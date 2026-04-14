'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 animate-bounce">
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
      `}</style>
    </div>
  );
}
