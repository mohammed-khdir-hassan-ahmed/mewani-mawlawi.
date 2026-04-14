'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, LogOut, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  id?: number;
  name: string;
  price: number;
  image_url: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/login');
    } else {
      setAuthenticated(true);
      fetchItems();
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('adminAuth');
    router.push('/login');
  };

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
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
        setMessage('خواردن زیادکرا!');
        setMessageType('success');
        setFormData({ name: '', price: '', image_url: '' });
        fetchItems(); // Refresh the list
      } else {
        setMessage('هەڵە لە زیادکردندا');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('هەڵە لە زیادکردندا');
      setMessageType('error');
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

  // Handle delete item
  const handleDelete = async (id?: number) => {
    if (!id) return;
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/menu/${deleteId}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage('خواردن سڕایەوە!');
        setMessageType('success');
        fetchItems();
      } else {
        setMessage('هەڵە لە سڕینەوەدا');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('هەڵە لە سڕینەوەدا');
      setMessageType('error');
      console.error('Delete error:', error);
    }
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  // Handle edit button click
  const handleEditClick = (item: MenuItem) => {
    setEditingId(item.id || null);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      image_url: item.image_url,
    });
    setShowEditModal(true);
  };

  // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/menu/${editingId}`, {
        method: 'PUT',
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
        setMessage('خواردن نوێکراوە!');
        setMessageType('success');
        setFormData({ name: '', price: '', image_url: '' });
        setShowEditModal(false);
        setEditingId(null);
        fetchItems();
      } else {
        setMessage('هەڵە لە نوێکردنەوەدا');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('هەڵە لە نوێکردنەوەدا');
      setMessageType('error');
      console.error('Edit error:', error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#386641]">
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
            <h1 className="text-2xl md:text-3xl font-bold text-[#386641]">داشبۆردی ئەدمین</h1>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-[#386641] hover:bg-green-700 text-white rounded-lg px-4 py-2"
          >
            <LogOut className="w-4 h-4 mr-2" />
            چوونەژوورەوە
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Item Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">زیادکردنی خواردنی نوێ   </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  ناوی خواردن
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ناوی خواردن" 
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  نرخ
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="نرخی خواردن"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
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
                  <p className="text-sm font-semibold text-gray-700 mb-2">Preview</p>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm font-semibold ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#386641] hover:bg-[#2a4d30] text-white rounded-lg py-3 font-bold text-sm transition-all"
              >
                <Plus className="w-3 h-3 " />
                {submitting ? 'زیادکردنی خواردن...' : ' زیادکردنی خواردن'}
              </Button>
            </form>
          </div>

          {/* Current Items List */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">خواردنەکان ({items.length})</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8"> هیچ خواردنێک بەردەست نییە!</p>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-[#386641] font-semibold">{item.price} هەزار</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition"
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

      {/* Edit Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
          
            <DialogDescription className="text-center">
              زانیاری خواردنەکە بگۆڕە
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-700 mb-2">
                ناوی خواردن
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label htmlFor="edit-price" className="block text-sm font-semibold text-gray-700 mb-2">
                نرخ (هەزار)
              </label>
              <input
                id="edit-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label htmlFor="edit-image" className="block text-sm font-semibold text-gray-700 mb-2">
                URL وێنە
              </label>
              <input
                id="edit-image"
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Message in Edit Dialog */}
            {message && (
              <div className={`p-3 rounded-lg text-sm font-semibold ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingId(null);
                  setFormData({ name: '', price: '', image_url: '' });
                  setMessage('');
                  setMessageType('success');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                هەڵوەشاندن
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {submitting ? 'نوێکردن...' : 'نوێکردنەوە '}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            
            <DialogDescription className="text-center">
             ئایە دڵنیایت لە ڕەشکردنەوەی ئەم؟ 
            </DialogDescription>
          </DialogHeader>

          {/* Message in Delete Dialog */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-semibold ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteId(null);
                setMessage('');
                setMessageType('success');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              هەڵوەشاندن
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              ڕەشکردنەوە
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
