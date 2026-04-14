import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET() {
  try {
    const items = await db.select().from(menuitem);
    return Response.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return Response.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, image_url, category } = body;

    console.log('📥 POST /api/menu received:', { name, price, image_url: image_url?.substring(0, 50) + '...', category });

    // Validate input
    if (!name || !price || !image_url) {
      console.error('❌ Missing required fields');
      return Response.json(
        { error: `Missing required fields. Received: ${JSON.stringify({ name: !!name, price: !!price, image_url: !!image_url })}` },
        { status: 400 }
      );
    }

    // Insert new item into database
    console.log('🔄 Inserting to database...');
    const newItem = await db
      .insert(menuitem)
      .values({
        name,
        price: parseInt(price),
        image_url,
        category: category || 'main',
      })
      .returning();

    console.log('✅ Item inserted successfully:', newItem[0]);
    
    // Revalidate the home page cache
    revalidatePath('/');
    
    return Response.json(newItem[0], { status: 201 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Error adding menu item:', errorMsg);
    return Response.json({ error: `Failed to add menu item: ${errorMsg}` }, { status: 500 });
  }
}
