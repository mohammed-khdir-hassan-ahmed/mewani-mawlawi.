import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, price, image_url } = body;

    // Validate input
    if (!name || !price || !image_url) {
      return Response.json(
        { error: 'Missing required fields: name, price, image_url' },
        { status: 400 }
      );
    }

    // Update item in database
    const updatedItem = await db
      .update(menuitem)
      .set({
        name,
        price: parseInt(price),
        image_url,
      })
      .where(eq(menuitem.id, id))
      .returning();

    if (updatedItem.length === 0) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    return Response.json(updatedItem[0], { status: 200 });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return Response.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Delete item from database
    const deletedItem = await db
      .delete(menuitem)
      .where(eq(menuitem.id, id))
      .returning();

    if (deletedItem.length === 0) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    return Response.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return Response.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
