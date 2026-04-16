'use client';

import { useState, useTransition, useMemo } from 'react';
import { Search, Utensils, Pizza, Coffee, Salad, Egg, ArrowDownNarrowWideIcon, Home, Beef, BottleWine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MenuGrid from '@/components/MenuGrid';
import { useLocale } from 'next-intl';
import { type MenuItem } from '@/lib/db';

interface MenuSearchProps {
  items: MenuItem[];
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  main: ['main', 'خواردنە سەرەکیەکان'],
  pizza: ['pizza', 'برژاو'],
  drinks: ['drinks', 'خواردنەوە'],
  appetizers: ['appetizers', 'مقەبیلات'],
  breakfast: ['breakfast', 'بەیانیان'],
};

function normalizeCategory(value?: string | null): string {
  if (!value) return 'main';

  const normalized = value.trim().toLowerCase();
  for (const [key, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return key;
    }
  }

  return value;
}

export default function MenuSearch({ items }: MenuSearchProps) {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortedByPrice, setIsSortedByPrice] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // useTransition for non-blocking category filtering
  // Shows loading state without blocking user input
  const [isPending, startTransition] = useTransition();
  
  const getDisplayName = (item: MenuItem) => {
    // Show language-specific name with proper fallbacks
    if (locale === 'ku') {
      // For Kurdish: prefer name_ckb, then legacy name, then English
      return item.name_ckb || item.name || item.name_en || 'Menu Item';
    } else {
      // For English: prefer name_en, then legacy name, then Kurdish
      return item.name_en || item.name || item.name_ckb || 'Menu Item';
    }
  };

  const categories = [
    { id: 'all', name: locale === 'en' ? 'All Items' : ' هەموو خواردنەکان', icon: Home },
    { id: 'main', name: locale === 'en' ? 'Main Dishes' : 'خواردنە سەرەکیەکان', icon: Utensils },
    { id: 'pizza', name: locale === 'en' ? 'Roasted' : 'برژاو', icon: Beef },
    { id: 'drinks', name: locale === 'en' ? 'Drinks' : 'خواردنەوە', icon: BottleWine },
    { id: 'appetizers', name: locale === 'en' ? 'Appetizers' : 'مقەبیلات', icon: Salad },
    { id: 'breakfast', name: locale === 'en' ? 'Breakfast' : 'بەیانیان', icon: Egg },
  ];

  const categoryMap: { [key: string]: string } = {
    'main': locale === 'en' ? 'Main Dishes' : 'خواردنە سەرەکیەکان',
    'pizza': locale === 'en' ? 'Roasted' : 'برژاو',
    'drinks': locale === 'en' ? 'Drinks' : 'خواردنەوە',
    'appetizers': locale === 'en' ? 'Appetizers' : 'مقەبیلات',
    'breakfast': locale === 'en' ? 'Breakfast' : 'بەیانیان',
  };

  // Memoized filtering to prevent unnecessary re-renders
  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      const displayName = getDisplayName(item);
      const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                           (item.name_ckb?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || normalizeCategory(item.category) === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (isSortedByPrice) {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    return result;
  }, [items, searchQuery, selectedCategory, isSortedByPrice, locale]);

  // Group items by category when viewing "all"
  const groupedItems: { [key: string]: MenuItem[] } = useMemo(() => {
    const grouped: { [key: string]: MenuItem[] } = {};
    if (selectedCategory === 'all') {
      filteredItems.forEach(item => {
        const cat = normalizeCategory(item.category);
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push(item);
      });
    }
    return grouped;
  }, [filteredItems, selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    startTransition(() => {
      setSelectedCategory(categoryId);
    });
  };

  return (
    <>
      {/* Categories and Search Section */}
      <div className="flex flex-col gap-3 items-center mt-6 mb-4 px-1 md:px-0 w-full">
        {/* Categories with loading indicator */}
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
                onClick={() => handleCategoryClick(category.id)}
                disabled={isPending}
                className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1.5 md:py-2 rounded-none transition-all duration-200 flex-shrink-0 border-b-2 disabled:opacity-60 ${
                  isSelected
                    ? 'bg-transparent border-b-2 border-[#386641] text-[#386641]'
                    : 'bg-transparent hover:border-b-2 hover:border-[#386641] hover:text-[#386641] text-gray-600 border-b-2 border-transparent'
                }`}
                style={{ scrollSnapAlign: 'center' }}
                title={category.name}
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
            title="Sort by price"
          >
            <ArrowDownNarrowWideIcon className="w-4 h-4" />
          </button>

          {/* Search Input */}
          <div className="relative h-full flex-1">
            {locale === 'en' ? (
              <>
                <Input 
                  type="text" 
                  placeholder="What would you like to eat?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-6 md:py-5 rounded-lg border border-gray-300 focus:border-[#386641] focus:outline-none focus:ring-2 focus:ring-[#386641]/10 transition-all text-base placeholder:text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </>
            ) : (
              <>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="دەتهەوێت چی بخۆیت؟"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-6 md:py-5 rounded-lg border border-gray-300 focus:border-[#386641] focus:outline-none focus:ring-2 focus:ring-[#386641]/10 transition-all text-base placeholder:text-sm"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Loading indicator for category transitions */}
      {isPending && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>{locale === 'en' ? 'Filtering...' : 'جاری کردندە...'}</p>
        </div>
      )}

      {/* Menu Grid */}
      <div className="mt-6">
        {selectedCategory === 'all' && Object.keys(groupedItems).length > 0 ? (
          <div className="flex flex-col gap-10">
            {Object.entries(groupedItems).map(([categoryId, categoryItems]) => (
              <div key={categoryId}>
                <div className="mb-6 md:mb-8">
                  {/* Mobile: Stacked layout */}
                  <div className="md:hidden flex items-center justify-center gap-3">
                    <div className="flex-1 h-0.5 bg-[#386641]"></div>
                    <h2 className="text-base font-bold text-[#386641] text-center whitespace-nowrap px-2">
                      {categoryMap[categoryId] || categoryId}
                    </h2>
                    <div className="flex-1 h-0.5 bg-[#386641]"></div>
                  </div>
                  
                  {/* Desktop: Line design */}
                  <div className="hidden md:flex items-center justify-center gap-4">
                    <div className="flex-1 h-px bg-[#386641]"></div>
                    <h2 className="text-lg font-bold text-[#386641] px-4 whitespace-nowrap">
                      {categoryMap[categoryId] || categoryId}
                    </h2>
                    <div className="flex-1 h-px bg-[#386641]"></div>
                  </div>
                </div>
                <MenuGrid items={categoryItems} />
              </div>
            ))}
          </div>
        ) : selectedCategory !== 'all' && filteredItems.length > 0 ? (
          <MenuGrid items={filteredItems} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{locale === 'en' ? 'No items found' : 'خواردنێک نەدۆزرایەوە'}</p>
          </div>
        )}
      </div>
    </>
  );
}
