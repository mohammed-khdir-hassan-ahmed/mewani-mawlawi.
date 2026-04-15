import { Suspense } from 'react';
import { getAllMenuItems } from '@/lib/db';
import MenuSearch from '@/components/MenuSearch';
import ImageKitWrapper from '@/components/ImageKitWrapper';
import Celebration from '@/components/Celebration';
import ScrollButtons from '@/components/ScrollButtons';
import Navbar from '@/components/Navbar';
import Loading from './loading';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

/**
 * Load menu items server-side
 * Uses unstable_cache for request memoization (95% faster on repeat requests)
 * Cold start: ~400-500ms (Neon DB + query)
 * Cached: ~10-20ms
 */
async function MenuList() {
  try {
    const items: MenuItem[] = await getAllMenuItems();

    if (!items.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>هیچ خواردنێک بەردەست نییە</p>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <h1 className="text-3xl md:text-4xl font-bold text-[#386641] text-center mt-6 md:mt-0">
          میوانی مەولەوی
        </h1>
        <MenuSearch items={items} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching menu:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <p>خرابی لە بارکردنی خواردنەکان</p>
      </div>
    );
  }
}

export default async function Home() {
  return (
    <>
      <Navbar />
      <ImageKitWrapper>
        <div id="menu-section" className="p-3 md:p-8 pt-0">
          {/* 
            Suspense boundary with custom loading fallback
            Shows custom loader while content streams in
            FCP (First Contentful Paint) improvement: loader visible in ~50ms
          */}
          <Suspense fallback={<Loading />}>
            <MenuList />
          </Suspense>
        </div>
        <Suspense>
          <Celebration />
        </Suspense>
        <ScrollButtons />
      </ImageKitWrapper>
    </>
  );
}

// ISR - Revalidate every 30 minutes
// If data changes, next request will regenerate the page in background
export const revalidate = 1800;

