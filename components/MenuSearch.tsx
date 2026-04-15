'use client';

import { useState } from 'react';
import { Search, Utensils, Pizza, Coffee, Salad, Egg, ArrowDownNarrowWideIcon, Home, Beef, BottleWine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MenuGrid from '@/components/MenuGrid';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

interface MenuSearchProps {
  items: MenuItem[];
}

export default function MenuSearch({ items }: MenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortedByPrice, setIsSortedByPrice] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: ' هەموو خواردنەکان', icon: Home },
    { id: 'main', name: 'خواردنە سەرەکیەکان', icon: Utensils },
    { id: 'pizza', name: 'برژاو', icon: Beef },
    { id: 'drinks', name: 'خواردنەوە', icon: BottleWine },
    { id: 'appetizers', name: 'مقەبیلات', icon: Salad },
    { id: 'breakfast', name: 'بەیانیان', icon: Egg },
  ];

  let filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isSortedByPrice) {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  }

  return (
    <>
      {/* Categories and Search Section */}
      <div className="flex flex-col gap-3 items-center mt-6 mb-4 px-1    md:px-0 w-full">
        {/* Categories */}
        <div 
          className="flex gap-1 md:gap-3 overflow-x-auto overflow-y-hidden w-full md:justify-center md:pb-2 pb-2 px-2 md:px-0 scroll-smooth [-webkit-overflow-scrolling:touch]" 
          style={{ 
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            .categories-scroll::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none transition-all duration-200 flex-shrink-0 border-b-2 ${
                  isSelected
                    ? 'bg-transparent border-b-2 border-[#386641] text-[#386641]'
                    : 'bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] text-gray-600 border-b-2 border-transparent'
                }`}
                style={{ scrollSnapAlign: 'center' }}
              >
                <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                <span className={`text-[11px] md:text-xs text-center whitespace-nowrap ${
                  isSelected ? 'font-bold' : 'font-medium'
                }`}>{category.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* Search Input and Price Filter */}
        <div className="w-full md:max-w-2xl flex-shrink-0 flex gap-2">
          {/* Price Sort Button */}
          <button
            onClick={() => setIsSortedByPrice(!isSortedByPrice)}
            className={`px-3 py-[11px] rounded-lg border transition-all duration-200 flex items-center justify-center ${
              isSortedByPrice
                ? 'bg-[#386641] text-white border-[#386641]'
                : 'bg-transparent text-gray-600 border-gray-300 hover:border-[#386641] hover:text-[#386641]'
            }`}
          >
            <ArrowDownNarrowWideIcon className="w-4 h-4" />
          </button>

          {/* Search Input */}
          <div className="relative h-full flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="دەتهەوێت چی بخۆیت؟" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full pl-10 pr-4 py-6 md:py-5 rounded-lg border border-gray-300 focus:border-[#386641] focus:outline-none focus:ring-2 focus:ring-[#386641]/10 transition-all text-base placeholder:text-sm"
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
