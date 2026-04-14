'use client';

import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { imageKitLoader, getResponsiveSizes } from '@/lib/imagekit-loader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OptimizedMenuItem from './OptimizedMenuItem';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <DialogTitle className="hidden md:block text-lg md:text-xl">{selectedItem.name}</DialogTitle>

              {/* Detail Image with optimization */}
              <div className="rounded-lg overflow-hidden mb-4 -mt-6 -mx-6 bg-gray-100">
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
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
                </motion.div>
              </div>

              {/* Title and Price */}
              <motion.div
                className="mb-6 flex items-center justify-between gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-lg md:text-xl font-bold text-gray-900 flex-1">
                  {selectedItem.name}
                </h2>
                <motion.p
                  key={quantity}
                  className="text-lg md:text-xl font-bold text-[#386641] whitespace-nowrap"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatPrice(selectedItem.price * quantity)} هەزار
                </motion.p>
              </motion.div>

              {/* Quantity Selector */}
              <motion.div
                className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1 mb-3 w-full mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:bg-gray-200 rounded p-0.5 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus className="w-3 h-3" />
                </motion.button>
                <span className="text-base font-bold w-6 text-center">{quantity}</span>
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:bg-gray-200 rounded p-0.5 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <button 
                  onClick={() => {
                    setSelectedItem(null);
                    setQuantity(1);
                  }}
                  className="w-full bg-[#386641] hover:bg-[#2a4d30] text-white py-3 font-bold rounded transition-colors"
                >
                  داخستن
                </button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
