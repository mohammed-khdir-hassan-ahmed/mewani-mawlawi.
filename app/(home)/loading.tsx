'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NetworkInfo {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export default function Loading() {
  const [networkStatus, setNetworkStatus] = useState<{
    speed: string;
    type: string;
    isLow: boolean;
  }>({
    speed: 'Detecting...',
    type: 'Unknown',
    isLow: false,
  });

  useEffect(() => {
    const getNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection as NetworkInfo;
        
        if (connection) {
          const effectiveType = connection.effectiveType || 'unknown';
          const downlink = connection.downlink || 0;
          const isLow =
            effectiveType === 'slow-2g' ||
            effectiveType === '2g' ||
            effectiveType === '3g' ||
            downlink < 2;

          const speedText =
            downlink > 0 ? `${downlink.toFixed(1)} Mbps` : effectiveType.toUpperCase();

          setNetworkStatus({
            speed: speedText,
            type: effectiveType.toUpperCase(),
            isLow,
          });
        }
      }
    };

    getNetworkInfo();

    // Update on connection change
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', getNetworkInfo);
      
      return () => {
        (navigator as any).connection?.removeEventListener('change', getNetworkInfo);
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-white z-50 pointer-events-auto">
      <div className="flex flex-col items-center justify-center gap-8 px-4 sm:gap-12">
        {/* Logo with ping circles */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
          {/* Ping circles */}
          <div className="absolute inset-0 rounded-full border-2 border-[#386641]/30 animate-ping"></div>
          <div
            className="absolute inset-0 rounded-full border-2 border-[#386641]/20 animate-ping"
            style={{ animationDelay: '0.3s' }}
          ></div>
          <div
            className="absolute inset-0 rounded-full border-2 border-[#386641]/10 animate-ping"
            style={{ animationDelay: '0.6s' }}
          ></div>

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

        {/* Network Status Display */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Loading...</h2>

          {/* Speed Info */}
          <div
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
              networkStatus.isLow
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}
          >
            {networkStatus.isLow ? '⚠️ Low Connection' : '✓ Good Connection'}
          </div>

          {/* Connection Details */}
          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
            <p>Speed: {networkStatus.speed}</p>
            <p>Type: {networkStatus.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
