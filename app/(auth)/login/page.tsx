'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Home,LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login with username:', username);
      
      // Send login request to server
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📥 Login response status:', response.status);
      const data = await response.json();
      console.log('📥 Login response data:', data);

      if (response.ok) {
        // Set auth token in localStorage as backup for client-side checks
        localStorage.setItem('adminAuth', 'true');
        console.log('✅ Login successful, redirecting...');
        router.push('/admin/dashboard');
      } else {
        const errorMsg = data.message || 'ناویی بەکارهێنەر یان وشەی نهێنی هەڵەیە';
        setError(errorMsg);
        console.error('❌ Login failed:', errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError('خۆڵای سێرڤەر: ' + errorMsg);
      console.error('❌ Login error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#386641] p-4">
      {/* Home Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 bg-green-600 text-white hover:bg-green-700 rounded-full p-3 shadow-lg transition"
      >
        <Home className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24">
            <Image
              src="/image/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
           داشبۆرد
        </h1>
        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              ناویی بەکارهێنەر
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ناویی بەکارهێنەر"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
        وشەی نهێنی
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="وشەی نهێنی"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#386641] hover:bg-[#2a4d30] text-white rounded-lg py-5 font-medium text-sm transition-all "
          >
            {loading ? 'چونەژوورەوە...' : 'چونەژوورەوە'}
            <LogIn className="w-7 h-7 mr-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}
