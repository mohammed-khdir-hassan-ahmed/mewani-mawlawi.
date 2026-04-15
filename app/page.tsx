import { redirect } from 'next/navigation';

/**
 * Root page - redirects to default locale (Kurdish)
 */
export default async function Home() {
  redirect('/ku');
}
