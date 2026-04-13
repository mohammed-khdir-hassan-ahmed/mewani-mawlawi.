import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { Utensils, Pizza, Coffee, Salad, Egg } from 'lucide-react';
import MenuGrid from '@/components/MenuGrid';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

async function MenuList() {
  // Delay for 1 second to show loading page
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const items: MenuItem[] = await db.select().from(menuitem);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#386641] text-center">میوانی مەولەوی</h1>
        <p className="text-center text-gray-500 text-sm md:text-base mb-6">خێرا لە خزمەت  ، بێوەنە لەتام</p>
        
        {/* Categories */}
        <div className="flex justify-center gap-1 md:gap-3 overflow-x-auto pb-2 px-1">
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
      </div>
    <MenuGrid items={items} />
    </>
  );
}

export default async function Home() {
  return (
    <>
      <div className="p-3 md:p-8 pt-0">
        <MenuList />
      </div>
    </>
  );
}