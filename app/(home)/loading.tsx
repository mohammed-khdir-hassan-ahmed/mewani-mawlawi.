'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center justify-center gap-12 px-4">
        {/* Logo with ping circles */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          {/* Ping circles */}
          <div className="absolute inset-0 rounded-full border-2 border-[#386641]/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-2 border-[#386641]/20 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute inset-0 rounded-full border-2 border-[#386641]/10 animate-ping" style={{ animationDelay: '0.6s' }}></div>
          
          {/* Logo */}
          <Image
            src="/image/logo.jpg"
            alt="Loading"
            width={80}
            height={80}
            priority
            className="w-full h-full object-contain"
          />
        </div>

       
      </div>
    </div>
  );
}
