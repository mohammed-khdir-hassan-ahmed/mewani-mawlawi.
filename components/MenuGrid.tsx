'use client';

import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { imageKitLoader, getResponsiveSizes } from '@/lib/imagekit-loader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import OptimizedMenuItem from './OptimizedMenuItem';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

interface MenuGridProps {
  items: MenuItem[];
}

function formatPrice(price: number): string {
  return price.toLocaleString();
}

export default function MenuGrid({ items }: MenuGridProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, index) => (
          <OptimizedMenuItem
            key={item.id}
            item={item}
            onSelect={setSelectedItem}
            // Priority loading for first 4 items (above the fold)
            priority={index < 4}
            // Pass index for staggered animation
            index={index}
          />
        ))}
      </div>

      {/* Detail Modal with optimized image */}
      {selectedItem && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setSelectedItem(null);
            setQuantity(1);
          }}
        >
          <DialogContent className="max-h-[85vh] overflow-y-auto max-w-xs md:max-w-sm">
            <DialogTitle className="hidden md:block text-lg md:text-xl">{selectedItem.name}</DialogTitle>

            {/* Detail Image with optimization */}
            <div className="rounded-lg overflow-hidden mb-4 -mt-6 -mx-6 bg-gray-100">
              <Image
                loader={imageKitLoader}
                src={selectedItem.image_url}
                alt={selectedItem.name}
                width={500}
                height={400}
                sizes={getResponsiveSizes('detail')}
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 400'%3E%3Crect fill='%23f3f4f6' width='500' height='400'/%3E%3C/svg%3E"
                quality={80}
                className="w-full h-60 md:h-72 object-cover"
              />
            </div>

            {/* Title and Price */}
            <div className="mb-6 flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 flex-1">
                {selectedItem.name}
              </h2>
              <p className="text-lg md:text-xl font-bold text-[#386641] whitespace-nowrap">
                {formatPrice(selectedItem.price * quantity)} هەزار
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1 mb-3 w-full mx-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="hover:bg-gray-200 rounded p-0.5 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-base font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="hover:bg-gray-200 rounded p-0.5 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => {
                setSelectedItem(null);
                setQuantity(1);
              }}
              className="w-full bg-[#386641] hover:bg-[#2a4d30] text-white py-3 font-bold"
            >
           
               داخستن
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
