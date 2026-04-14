'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Trash2, Edit2, Home } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  id?: number;
  name: string;
  price: number;
  image_url: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<'login' | 'dashboard'>('login');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Check for existing auth on mount
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (isAuth) {
      setStep('dashboard');
      fetchItems();
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  // Fetch items from database
  const fetchItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem('adminAuth', 'true');
      setStep('dashboard');
      setUsername('');
      setPassword('');
      fetchItems();
    } else {
      setLoginError('ناویی بەکارهێنەر یان تێپەڕە هەڵە یە');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setStep('login');
    setUsername('');
    setPassword('');
    setFormData({ name: '', price: '', image_url: '' });
    setMessage('');
  };

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/menu/${editingId}` : '/api/menu';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseInt(formData.price),
          image_url: formData.image_url,
        }),
      });

      if (response.ok) {
        const successMsg = editingId ? 'توێکە بە سەرکەوتووی نوێ کرایەوە!' : 'توێکە بە سەرکەوتووی زیاد کرا!';
        setMessage(successMsg);
        setFormData({ name: '', price: '', image_url: '' });
        setEditingId(null);
        fetchItems();
      } else {
        setMessage(editingId ? 'هەڵە لە نوێکردنەوەی توێ' : 'هەڵە لە زیادکردنی توێ');
      }
    } catch (error) {
      setMessage(editingId ? 'هەڵە لە نوێکردنەوەی توێ' : 'هەڵە لە زیادکردنی توێ');
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('تۆ دڵنیاییت کە دەتانەوی ئەم توێیە سڕی بکریت؟')) return;
    
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('توێکە بە سەرکەوتووی سڕاوە!');
        fetchItems();
      } else {
        setMessage('هەڵە لە سڕانەوەی توێ');
      }
    } catch (error) {
      setMessage('هەڵە لە سڕانەوەی توێ');
      console.error('Error:', error);
    }
  };

  // Handle edit
  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      image_url: item.image_url,
    });
    setEditingId(item.id || null);
    window.scrollTo(0, 0);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({ name: '', price: '', image_url: '' });
    setEditingId(null);
  };

  // Loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <Image
              src="/image/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain animate-bounce"
            />
          </div>
          <p className="text-gray-600 text-lg">جاری بارکردن...</p>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (step === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
        {/* Home Button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 bg-white text-[#386641] hover:bg-gray-100 rounded-full p-3 shadow-lg transition"
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
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">چونەوەی بەرێوەبەر</h1>
          <p className="text-center text-gray-600 mb-8">
            ناویی بەکارهێنەر و تێپەڕەت دابنێ
          </p>

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
                placeholder="ناویی بەکارهێنایی بەرێوەبەر"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                تێپەڕە
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="تێپەڕەی بەرێوەبەر"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {loginError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#386641] hover:bg-[#2a4d30] text-white rounded-lg py-3 font-bold text-lg transition-all"
            >
              چونەوە
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD PAGE
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <Image
                src="/image/logo.svg"
                alt="Logo"
                width={50}
                height={50}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#386641]">بەرێوەبەریی مێنیو</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="bg-white text-[#386641] hover:bg-gray-100 rounded-lg px-4 py-2 font-semibold transition"
            >
              <Home className="w-4 h-4 inline mr-2" />
              ماڵەوە
            </button>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              دەرچوون
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Item Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              {editingId ? (
                <>
                  <Edit2 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">دەستکاریکردنی توێی مێنیو</h2>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">زیادکردنی توێی نوێ</h2>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  ناوی توێ
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="بۆ نموونە، بێرگەری ڕوپ"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  نرخ (هەزار)
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="بۆ نموونە، 15"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-semibold text-gray-700 mb-2">
                  URL وێنەکە
                </label>
                <input
                  id="image_url"
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
                />
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">پێشدیتین</p>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm font-semibold ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#386641] hover:bg-[#2a4d30] text-white rounded-lg py-3 font-bold text-lg transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {submitting ? 'بار دەکەم...' : (editingId ? 'نوێکردنەوە' : 'زیادکردن')}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg py-3 font-bold text-lg transition-all"
                  >
                    هەڵوەشاندنەوە
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Current Items List */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">توێکانی مێنیو ({items.length})</h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">هیچ توێیەک هەبوو نیە. یەکێک زیاد بکە بۆ دەستپێکردن!</p>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-[#386641] font-semibold">{item.price} هەزار</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-colors"
                        title="دەستکاریکردن"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors"
                        title="سڕانەوە"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
