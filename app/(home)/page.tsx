import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import MenuSearch from '@/components/MenuSearch';
import ImageKitWrapper from '@/components/ImageKitWrapper';

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
    <div className="mt-3">
      <h1 className="text-2xl md:text-3xl font-bold text-[#386641] text-center">میوانی مەولەوی</h1>
      <p className="text-center text-gray-500 text-sm md:text-base mb-3 mt-2">خێرا لە خزمەت  ، بێوەنە لەتام</p>
      <MenuSearch items={items} />
    </div>
  );
}

export default async function Home() {
  return (
    <ImageKitWrapper>
      <div className="p-3 md:p-8 pt-0">
        <MenuList />
      </div>
    </ImageKitWrapper>
  );
}
