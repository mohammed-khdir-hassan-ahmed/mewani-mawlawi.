/**
 * Optimized Menu Item Component
 * Uses Next.js Image component with proper caching and responsive sizing
 */

'use client';

import Image from 'next/image';
import { imageKitLoader, getResponsiveSizes } from '@/lib/imagekit-loader';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

interface OptimizedMenuItemProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  priority?: boolean;
  index?: number;
}

function formatPrice(price: number): string {
  return price.toLocaleString();
}

export default function OptimizedMenuItem({
  item,
  onSelect,
  priority = false,
  index = 0,
}: OptimizedMenuItemProps) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  
  // Alternate animation direction: even items from left, odd from right
  const isFromLeft = index % 2 === 0;
  const initialX = isFromLeft ? -50 : 50;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
      }}
      onTouchEnd={(e) => {
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStart.x);
        const deltaY = Math.abs(touch.clientY - touchStart.y);

        if (deltaX < 10 && deltaY < 10) {
          onSelect(item);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(item);
        }
      }}
      initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: (index % 4) * 0.1 }}
      className="overflow-hidden p-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg bg-white flex flex-col h-full active:shadow-md"
    >
      {/* Image with Next.js Image component for optimization */}
      <div className="relative w-full h-44 md:h-48 overflow-hidden shrink-0 bg-gray-100">
        <Image
          loader={imageKitLoader}
          src={item.image_url}
          alt={item.name}
          width={300}
          height={200}
          sizes={getResponsiveSizes('thumbnail')}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23f3f4f6' width='300' height='200'/%3E%3C/svg%3E"
          quality={70}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback on error
            console.error(`Failed to load image for ${item.name}`);
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="flex items-start gap-3">
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="font-bold text-sm md:text-base line-clamp-2">
              {item.name}
            </div>
            <div className="text-xs font-bold text-gray-600 mt-1">
              {formatPrice(item.price)} دینار
            </div>
          </div>
          <Button
            className="bg-[#386641] hover:bg-[#2a4d30] text-white shrink-0 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Plus className="w-5 h-5 stroke-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
