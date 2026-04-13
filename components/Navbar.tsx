'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-12 py-2 md:py-1 border-b-2 border-gray-100 top-0 z-40 bg-white gap-6 sticky">
        {/* Left side - Logo */}
        <div className="w-20 h-20 md:w-20 md:h-20 flex-shrink-0">
          <Image
            src="/image/caffelogo.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Location Button */}
        <Button
          size="lg"
          className="md:size-icon bg-[#386641] hover:bg-[#2a4d30] text-white rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <MapPin className="w-6 h-6 md:w-5 md:h-5" />
        </Button>
      </nav>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal</DialogTitle>
            <DialogDescription>
              Add your modal content here
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
