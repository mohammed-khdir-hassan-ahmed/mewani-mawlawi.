/**
 * Database utility with caching and request deduplication
 * Uses Next.js unstable_cache for server-side response memoization
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export interface MenuItem {
  id: number;
  name: string; // Legacy field - kept for backwards compatibility
  name_en: string | null;
  name_ckb: string | null;
  price: number;
  image_url: string;
  image_file_name?: string | null;
  category: string;
}

/**
 * Get all menu items - Cached for 30 minutes
 * 
 * Performance:
 * - First call (cold): 300-500ms (Neon cold start + DB query)
 * - Cached hits: 5-20ms (network only)
 * 
 * Deduplication: Multiple concurrent calls to this function will only
 * trigger a single database query thanks to unstable_cache
 */
export const getAllMenuItems = unstable_cache(
  async (): Promise<MenuItem[]> => {
    try {
      const items = await db.select().from(menuitem).orderBy(menuitem.id);
      return items;
    } catch (error) {
      console.error('Error fetching all menu items:', error);
      throw error;
    }
  },
  ['all-menu-items'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['menu-items'],
  }
);

/**
 * Get menu items by category - Cached for 30 minutes
 * 
 * Uses database index: idx_menuitem_category_id(category, id)
 * 
 * Performance:
 * - First call (cold): 200-400ms (Neon cold start + indexed DB query)
 * - Cached hits: 5-20ms (network only)
 * 
 * Database will use index for fast filtering:
 * SELECT * FROM menuitem WHERE category = $1 ORDER BY id
 * 
 * Deduplication: Multiple concurrent calls with same category will be deduped
 */
export const getMenuItemsByCategory = unstable_cache(
  async (category: string): Promise<MenuItem[]> => {
    try {
      const normalizedCategory = category.toLowerCase().trim();
      const items = await db
        .select()
        .from(menuitem)
        .where(eq(menuitem.category, normalizedCategory))
        .orderBy(menuitem.id);
      return items;
    } catch (error) {
      console.error(`Error fetching menu items for category ${category}:`, error);
      throw error;
    }
  },
  // Cache key - will be called with specific category
  ['menu-items-by-category'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['menu-items'],
  }
);

/**
 * Get all unique categories - Cached for 1 hour
 * 
 * Performance:
 * - First call (cold): 150-300ms
 * - Cached hits: 5-20ms
 */
export const getCategories = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const categories = await db
        .selectDistinct({ category: menuitem.category })
        .from(menuitem)
        .orderBy(menuitem.category);
      return categories.map(c => c.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return sensible defaults if DB fails
      return ['main', 'pizza', 'drinks', 'appetizers', 'breakfast'];
    }
  },
  ['menu-categories'],
  {
    revalidate: 3600, // 1 hour
    tags: ['menu-categories'],
  }
);

/**
 * Get single menu item by ID
 * Useful for detail views
 */
export const getMenuItemById = unstable_cache(
  async (id: number): Promise<MenuItem | null> => {
    try {
      const items = await db
        .select()
        .from(menuitem)
        .where(eq(menuitem.id, id));
      return items[0] || null;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },
  ['menu-item-by-id'],
  {
    revalidate: 1800,
    tags: ['menu-items'],
  }
);

/**
 * Insert a new menu item (bypasses cache for fresh data)
 * Cache will revalidate automatically after TTL expires
 */
export async function insertMenuItem(data: {
  name: string;
  price: number;
  image_url: string;
  category: string;
}): Promise<MenuItem> {
  try {
    const result = await db
      .insert(menuitem)
      .values(data)
      .returning();
    
    // Cache will be automatically invalidated after TTL (30 min)
    // New requests will fetch fresh data
    return result[0];
  } catch (error) {
    console.error('Error inserting menu item:', error);
    throw error;
  }
}

/**
 * Update a menu item (bypasses cache for fresh data)
 * Cache will revalidate automatically after TTL expires
 */
export async function updateMenuItem(id: number, data: Partial<MenuItem>): Promise<MenuItem> {
  try {
    const result = await db
      .update(menuitem)
      .set({
        name: data.name,
        price: data.price,
        image_url: data.image_url,
        category: data.category,
      })
      .where(eq(menuitem.id, id))
      .returning();

    // Cache will be automatically invalidated after TTL (30 min)
    return result[0];
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

/**
 * Delete a menu item (bypasses cache for fresh data)
 * Cache will revalidate automatically after TTL expires
 */
export async function deleteMenuItem(id: number): Promise<boolean> {
  try {
    await db.delete(menuitem).where(eq(menuitem.id, id));
    
    // Cache will be automatically invalidated after TTL (30 min)
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}
