'use client';

import { useState } from 'react';
import { Search, Utensils, Pizza, Coffee, Salad, Egg } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MenuGrid from '@/components/MenuGrid';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface MenuSearchProps {
  items: MenuItem[];
}

export default function MenuSearch({ items }: MenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Categories and Search Section */}
      <div className="flex flex-col gap-3 items-center mb-4 px-1 md:px-0 w-full">
        {/* Categories */}
        <div className="flex justify-center gap-1 md:gap-3 overflow-x-auto w-full md:pb-2">
          <button className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] transition-all duration-200 text-gray-600 flex-shrink-0 border-b-2 border-transparent">
            <Utensils className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-xs font-medium text-center whitespace-nowrap"> خواردنە سەرەکیەکان</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] transition-all duration-200 text-gray-600 flex-shrink-0 border-b-2 border-transparent">
            <Pizza className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-xs font-medium text-center whitespace-nowrap">برژاو</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] transition-all duration-200 text-gray-600 flex-shrink-0 border-b-2 border-transparent">
            <Coffee className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-xs font-medium text-center whitespace-nowrap">خواردنەوە</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] transition-all duration-200 text-gray-600 flex-shrink-0 border-b-2 border-transparent">
            <Salad className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-xs font-medium text-center whitespace-nowrap">مقەبیلات</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] transition-all duration-200 text-gray-600 flex-shrink-0 border-b-2 border-transparent">
            <Egg className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-xs font-medium text-center whitespace-nowrap">بەیانیان</span>
          </button>
        </div>
        
        {/* Search Input */}
        <div className="w-full md:max-w-2xl flex-shrink-0">
          <div className="relative h-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="دەتهەوێت چی بخۆیت؟" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full pl-10 pr-4 py-5 md:py-4 rounded-lg border border-gray-300 focus:border-[#386641] focus:outline-none focus:ring-2 focus:ring-[#386641]/10 transition-all text-base placeholder:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="mt-6">
        <MenuGrid items={filteredItems} />
      </div>
    </>
  );
}
