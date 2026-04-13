'use client';

import { Plus } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => {
        const handleOpen = () => setSelectedItem(item);
        
        return (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onTouchEnd={handleOpen}
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
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-sm w-full max-h-[90vh] overflow-y-auto mx-auto p-4 md:p-6 z-50 fixed">
         
          
          {selectedItem && (
            <>
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
 <DialogHeader>
            <div>
              <DialogTitle className="text-lg md:text-xl font-bold">{selectedItem?.name}</DialogTitle>
              <div className="text-sm md:text-base font-bold text-gray-600 mt-1">
                {selectedItem && `${formatPrice(selectedItem.price)} هەزار`}
              </div>
            </div>
          </DialogHeader>
              <div className="flex gap-3 flex-col md:flex-row">
             
                <Button 
                  variant="outline" 
                  className="flex-1 bg-[#386641] text-white hover:text-white hover:bg-[#2a4d30] rounded-md"
                  onClick={() => setSelectedItem(null)}
                >
                  داخستن
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
