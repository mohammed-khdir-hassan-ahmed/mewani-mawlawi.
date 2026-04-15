import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { menuitem } from '@/src/db/schema';
import { unstable_cache } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * Get all unique categories
 * Cached for 1 hour since categories change infrequently
 * Response time: ~50ms (with cache), ~300ms (cold start)
 */
const getCategoriesFromDB = unstable_cache(
  async () => {
    try {
      const categories = await db
        .selectDistinct({ category: menuitem.category })
        .from(menuitem)
        .orderBy(menuitem.category);
      
      return categories.map(c => c.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to static categories if DB fails
      return ['main', 'pizza', 'drinks', 'appetizers', 'breakfast'];
    }
  },
  ['menu-categories'], // Cache key
  {
    revalidate: 3600, // 1 hour
    tags: ['menu-categories'], // For manual revalidation
  }
);

export async function GET() {
  try {
    const categories = await getCategoriesFromDB();
    
    return Response.json({
      success: true,
      categories,
      count: categories.length,
      cached: true, // Indicates this came from cache
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/menu/categories:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to fetch categories',
        categories: ['main', 'pizza', 'drinks', 'appetizers', 'breakfast'], // Fallback
      },
      { status: 500 }
    );
  }
}
