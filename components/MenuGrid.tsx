'use client';

import { Plus, Minus, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

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
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => {
        const handleOpen = () => setSelectedItem(item);
        
        return (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            handleOpen();
          }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            setTouchStart({ x: touch.clientX, y: touch.clientY });
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - touchStart.x);
            const deltaY = Math.abs(touch.clientY - touchStart.y);
            
            // Only trigger if touch didn't move much (tap, not scroll)
            if (deltaX < 10 && deltaY < 10) {
              e.preventDefault();
              handleOpen();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleOpen();
            }
          }}
          className="overflow-hidden p-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg bg-white flex flex-col h-full active:shadow-md"
        >
          <div className="relative w-full h-44 md:h-48 overflow-hidden shrink-0">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div className="flex items-start gap-3">
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className='font-bold text-sm md:text-base line-clamp-2'>{item.name}</div>
                <div className='text-xs font-bold text-gray-600'>{formatPrice(item.price)} هەزار</div>
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
        </div>
        );
      })}

      {/* Modal Dialog */}
      {selectedItem && (
        <Dialog open={true} onOpenChange={() => {
          setSelectedItem(null);
          setQuantity(1);
        }}>
          <DialogContent className="max-h-[85vh] overflow-y-auto max-w-sm">
            {/* Image */}
            <div className="rounded-lg overflow-hidden mb-4 -mt-6 -mx-6">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.name}
                className="w-full h-60 object-cover"
              />
            </div>

            {/* Title and Price */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-gray-900 flex-1">
                {selectedItem.name}
              </h2>
              <p className="text-2xl font-bold text-[#386641] whitespace-nowrap">
                {formatPrice(selectedItem.price)} هەزار
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-lg p-3 mb-4 w-full mx-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="hover:bg-gray-200 rounded p-1 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="hover:bg-gray-200 rounded p-1 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-col">
              <Button 
                className="w-full bg-[#386641] hover:bg-[#2a4d30] text-white rounded-lg py-3 font-semibold"
                onClick={() => {
                  setSelectedItem(null);
                  setQuantity(1);
                }}
              >
                داخستن
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
