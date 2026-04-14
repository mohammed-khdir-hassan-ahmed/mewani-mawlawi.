import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const body = await request.json();
    const { name, price, image_url } = body;

    // Validate input
    if (!name || !price) {
      return Response.json(
        { error: 'Missing required fields: name, price' },
        { status: 400 }
      );
    }

    // Get current item to preserve image if not updating
    const currentItem = await db.select().from(menuitem).where(eq(menuitem.id, id));
    
    if (currentItem.length === 0) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    // Update item in database
    const updatedItem = await db
      .update(menuitem)
      .set({
        name,
        price: parseInt(price),
        image_url: image_url || currentItem[0].image_url, // Use new image or keep old one
      })
      .where(eq(menuitem.id, id))
      .returning();

    // Revalidate the home page cache
    revalidatePath('/');

    return Response.json(updatedItem[0], { status: 200 });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return Response.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    // Delete item from database
    const deletedItem = await db
      .delete(menuitem)
      .where(eq(menuitem.id, id))
      .returning();

    if (deletedItem.length === 0) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    // Revalidate the home page cache
    revalidatePath('/');

    return Response.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return Response.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
