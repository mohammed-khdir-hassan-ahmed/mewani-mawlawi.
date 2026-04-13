import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { menuitem } from './src/db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  const fakeData = [
    { name: 'کباب', price: 15000, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561f1f?w=400' },
    { name: 'رێز', price: 12000, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { name: 'پیتزا', price: 20000, image_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400' },
    { name: 'سلاتە', price: 8000, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { name: 'شۆپە', price: 18000, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'بێف استیک', price: 25000, image_url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400' },
    { name: 'چیکن استیک', price: 18000, image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400' },
    { name: 'فیش', price: 20000, image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400' },
    { name: 'شەریم', price: 16000, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { name: 'باغەتە', price: 10000, image_url: 'https://images.unsplash.com/photo-1585238341710-4e5f75880f8d?w=400' },
    { name: 'لاپاتا', price: 14000, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561f1f?w=400' },
    { name: 'ماکارۆنی', price: 12000, image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
    { name: 'سوشی', price: 22000, image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
    { name: 'بورگەر', price: 13000, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'ساندویچ', price: 9000, image_url: 'https://images.unsplash.com/photo-1528735602780-cf6f53cf6537?w=400' },
    { name: 'تاکۆ', price: 11000, image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
    { name: 'فرایز', price: 7000, image_url: 'https://images.unsplash.com/photo-1589080876848-a8f5ce04c8d5?w=400' },
    { name: 'زۆمباک', price: 15000, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561f1f?w=400' },
    { name: 'مۈزلی', price: 8500, image_url: 'https://images.unsplash.com/photo-1585238341710-4e5f75880f8d?w=400' },
    { name: 'ساندویچ مرغ', price: 10000, image_url: 'https://images.unsplash.com/photo-1562547256-57e5c76e8d3e?w=400' },
  ];

  try {
    await db.insert(menuitem).values(fakeData);
    console.log('✅ 20 fake menu items added successfully!');
  } catch (error) {
    console.error('❌ Error adding fake data:', error);
  }
}

seed();
