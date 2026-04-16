import { Suspense } from 'react';
// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
import { getAllMenuItems, type MenuItem } from '@/lib/db';
import MenuSearch from '@/components/MenuSearch';
import ImageKitWrapper from '@/components/ImageKitWrapper';
import Celebration from '@/components/Celebration';
import ScrollButtons from '@/components/ScrollButtons';
import Navbar from '@/components/Navbar';
import Loading from './loading';


async function MenuList({ locale }: { locale: string }) {
  try {
    const items: MenuItem[] = await getAllMenuItems();

    if (!items.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>{locale === 'en' ? 'No menu items available' : 'هیچ خواردنێک بەردەست نییە'}</p>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <h1 className="text-3xl md:text-4xl font-bold text-[#386641] text-center mt-6 md:mt-0">
          {locale === 'en' ? 'Miwani Mawlawi' : 'میوانی مەولەوی'}
        </h1>
        <MenuSearch items={items} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching menu:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <p>{locale === 'en' ? 'Error loading menu items' : 'خرابی لە بارکردنی خواردنەکان'}</p>
      </div>
    );
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ImageKitWrapper>
        <div className="flex-1 px-4 md:px-12 mb-8">
          <div className="mx-auto max-w-6xl">
            <Suspense fallback={<Loading />}>
              <MenuList locale={locale} />
            </Suspense>
          </div>
        </div>
      </ImageKitWrapper>
      <ScrollButtons />
      <Celebration />
    </div>
  );
}
