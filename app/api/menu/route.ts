import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

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
    const { name, price, image_url } = body;

    // Validate input
    if (!name || !price || !image_url) {
      return Response.json(
        { error: 'Missing required fields: name, price, image_url' },
        { status: 400 }
      );
    }

    // Insert new item into database
    const newItem = await db
      .insert(menuitem)
      .values({
        name,
        price: parseInt(price),
        image_url,
      })
      .returning();

    return Response.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return Response.json({ error: 'Failed to add menu item' }, { status: 500 });
  }
}
