import { Suspense } from 'react';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import MenuSearch from '@/components/MenuSearch';
import ImageKitWrapper from '@/components/ImageKitWrapper';
import Celebration from '@/components/Celebration';
import ScrollButtons from '@/components/ScrollButtons';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

// Sleep function to delay loading
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function MenuList() {
  try {
    // Add 1500 second delay
    await sleep(5000);
    
    // Fetch with Next.js cache
    // revalidate: 3600 means ISR - regenerate every hour
    const items: MenuItem[] = await db.select().from(menuitem);

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
    <ImageKitWrapper>
      <Celebration />
      <div id="menu-section" className="p-3 md:p-8 pt-0">
        <MenuList />
      </div>
      <ScrollButtons />
    </ImageKitWrapper>
  );
}

/**
 * ISR Configuration:
 * revalidate: 3600 means the page will be regenerated every 3600 seconds (1 hour)
 */
export const revalidate = 3600; // Revalidate every hour
