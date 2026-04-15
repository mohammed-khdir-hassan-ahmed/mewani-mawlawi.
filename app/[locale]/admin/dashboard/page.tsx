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
import { Plus, LogOut, Edit, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { Image as IKImage, ImageKitProvider } from '@imagekit/react';
import { getAdminImageUrl } from '@/lib/imagekit';
import { useLocale } from 'next-intl';
import DashboardLanguageSwitcher from '@/components/DashboardLanguageSwitcher';
import { type MenuItem } from '@/lib/db';

export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ckb: '',
    price: '',
    image_url: '',
    image_file_name: '',
    category: '',
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
      router.push(`/${locale}/login`);
    } else {
      setAuthenticated(true);
      fetchItems();
    }
    setLoading(false);
  }, [router, locale]);

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
    router.push(`/${locale}/login`);
  };

  // Handle form input
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (name === 'image_file' && files && files[0]) {
      const file = files[0];
      try {
        setMessage('وێنە بارکرادەكە...');
        setMessageType('success');
        
        console.log('📤 Starting server-side upload...');
        console.log('  File:', file.name, '(' + file.size + ' bytes)');
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Step 1: Upload to backend (which uploads to ImageKit)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('📥 Upload response status:', uploadRes.status);
        const uploadData = await uploadRes.json();
        console.log('📥 Upload response:', uploadData);

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Upload failed');
        }

        if (!uploadData.filePath) {
          throw new Error('No file path returned from upload');
        }

        setFormData((prev) => ({
          ...prev,
          image_url: uploadData.filePath,
          image_file_name: file.name,
        }));
        
        setMessage('وێنە بسەرکەوتوویی بارکرا ✅');
        setMessageType('success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.error('Upload error:', errorMessage);
        setMessage(`هەڵە: ${errorMessage}`);
        setMessageType('error');
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (!formData.name_en || !formData.name_ckb || !formData.price) {
        setMessage('براکو ناو (ئینگلێزی و کوردی) و نرخ پڕ بکە');
        setMessageType('error');
        setSubmitting(false);
        return;
      }

      if (!formData.image_url) {
        setMessage('براکو وێنەیەک بسووڕینەوە');
        setMessageType('error');
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_en: formData.name_en,
          name_ckb: formData.name_ckb,
          price: parseInt(formData.price),
          image_url: formData.image_url,
          category: formData.category,
        }),
      });

      if (response.ok) {
        setMessage('خواردن بسەرکەوتوویی زیادکرا!');
        setMessageType('success');
        setFormData({ 
          name_en: '', 
          name_ckb: '', 
          price: '', 
          image_url: '', 
          image_file_name: '', 
          category: '' 
        });
        setShowAddModal(false);
        fetchItems();
      } else {
        const responseData = await response.json();
        setMessage(`هەڵە: ${responseData?.error || 'خواردن زیاد نەکرا'}`);
        setMessageType('error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`هەڵە: ${errorMessage}`);
      setMessageType('error');
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
      name_en: item.name_en || '',
      name_ckb: item.name_ckb || '',
      price: item.price.toString(),
      image_url: item.image_url,
      image_file_name: '',
      category: item.category || '',
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
          name_en: formData.name_en,
          name_ckb: formData.name_ckb,
          price: parseInt(formData.price),
          image_url: formData.image_url,
          category: formData.category,
        }),
      });

      if (response.ok) {
        setMessage('خواردن نوێکراوە!');
        setMessageType('success');
        setFormData({ 
          name_en: '', 
          name_ckb: '', 
          price: '', 
          image_url: '', 
          image_file_name: '', 
          category: '' 
        });
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
    return <div>Loading.</div>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''}>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <Image
                src="/image/logo.jpg"
                alt="Logo"
                width={50}
                height={50}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#386641]">داشبۆردی ئەدمین</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleLogout}
              className="bg-[#386641] hover:bg-green-700 text-white rounded-lg px-4 py-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              چوونەژوورەوە
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">خواردنەکان ({items.length})</h2>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#386641] hover:bg-green-700 text-white rounded-lg px-6 py-2 font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            زیادکردنی خواردنی نوێ
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 text-lg">هیچ خواردنێک بەردەست نییە!</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={item.id || idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <IKImage
                    src={getAdminImageUrl(item.image_url)}
                    alt={item.name_en}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg text-gray-900">{item.name_en}</p>
                  <p className="font-bold text-base text-gray-700 mb-2">{item.name_ckb}</p>
                  <p className="text-sm text-[#386641] font-bold mb-3">{item.price} دینار</p>
                  {item.category && (
                    <p className="text-xs text-gray-500 mb-3">قۆناغ: {item.category}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <Edit className="w-4 h-4" />
                      گۆڕین
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      سڕینەوە
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">زیادکردنی خواردنی نوێ</DialogTitle>
           
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* English Name */}
            <div>
              <label htmlFor="name_en" className="block text-sm font-semibold text-gray-700 mb-2">
                ناوی خواردنەی (English) *
              </label>
              <input
                id="name_en"
                type="text"
                name="name_en"
                value={formData.name_en}
                onChange={handleInputChange}
                placeholder="  Food Name"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {/* Kurdish Name */}
            <div>
              <label htmlFor="name_ckb" className="block text-sm font-semibold text-gray-700 mb-2">
                ناوی خواردنەی (Kurdish) *
              </label>
              <input
                id="name_ckb"
                type="text"
                name="name_ckb"
                value={formData.name_ckb}
                onChange={handleInputChange}
                placeholder="ناوی خواردنەی"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
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
                placeholder="5000"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                بەشەکان
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              >
                <option value="">هەڵبژاردنی بەشەکان</option>
                <option value="main">خواردنە سەرەکیەکان</option>
                <option value="pizza">برژاو</option>
                <option value="drinks">خواردنەوە</option>
                <option value="appetizers">مقەبیلات</option>
                <option value="breakfast">بەیانیان</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                 وێنە
              </label>
              <div className="relative">
                <input
                  id="image_file"
                  type="file"
                  name="image_file"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full px-4 py-3 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 text-[#386641] cursor-pointer transition flex items-center gap-2 justify-center font-bold">
                  <Upload className="w-5 h-5" />
                  {formData.image_file_name ? formData.image_file_name : 'کلیک یکە بۆ بارکردن'}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-4">
                <IKImage
                  src={getAdminImageUrl(formData.image_url)}
                  alt="Preview"
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm font-semibold ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ 
                    name_en: '', 
                    name_ckb: '', 
                    price: '', 
                    image_url: '', 
                    image_file_name: '', 
                    category: '' 
                  });
                  setMessage('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                هەڵوەشاندنەوە
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#386641] hover:bg-[#2a4d30] text-white"
              >
                {submitting ? 'زیادکردن...' : 'زیادکردن'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">گۆڕینی زانیاری خواردن</DialogTitle>
      
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* English Name */}
            <div>
              <label htmlFor="edit-name_en" className="block text-sm font-semibold text-gray-700 mb-2">
                ناوی خواردنەی (English)
              </label>
              <input
                id="edit-name_en"
                type="text"
                name="name_en"
                value={formData.name_en}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {/* Kurdish Name */}
            <div>
              <label htmlFor="edit-name_ckb" className="block text-sm font-semibold text-gray-700 mb-2">
                ناوی خواردنەی (Kurdish)
              </label>
              <input
                id="edit-name_ckb"
                type="text"
                name="name_ckb"
                value={formData.name_ckb}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="edit-price" className="block text-sm font-semibold text-gray-700 mb-2">
                نرخ
              </label>
              <input
                id="edit-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="edit-category" className="block text-sm font-semibold text-gray-700 mb-2">
                بەشەکان
              </label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#386641] text-gray-900"
              >
                <option value="">هەڵبژاردنی بەشەکان</option>
                <option value="main">خواردنە سەرەکیەکان</option>
                <option value="pizza">برژاو</option>
                <option value="drinks">خواردنەوە</option>
                <option value="appetizers">مقەبیلات</option>
                <option value="breakfast">بەیانیان</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                وێنە بسووڕینەوە
              </label>
              <div className="relative">
                <input
                  id="edit-image"
                  type="file"
                  name="image_file"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 cursor-pointer hover:border-[#386641] transition flex items-center gap-2 justify-center font-semibold">
                  <Upload className="w-4 h-4 text-gray-500" />
                  {formData.image_file_name ? formData.image_file_name : 'فایل هیلبژێرە'}
                </div>
              </div>
              {formData.image_url && (
                <div className="mt-3">
                  <IKImage
                    src={getAdminImageUrl(formData.image_url)}
                    alt="Preview"
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Message in Edit Dialog */}
            {message && (
              <div className={`p-3 rounded-lg text-sm font-semibold ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingId(null);
                  setFormData({ 
                    name_en: '', 
                    name_ckb: '', 
                    price: '', 
                    image_url: '', 
                    image_file_name: '', 
                    category: '' 
                  });
                  setMessage('');
                  setMessageType('success');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                هەڵوەشاندنەوە
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#386641] hover:bg-[#2a4d30] text-white"
              >
                {submitting ? 'نوێکردن...' : 'نوێکردنەوە'}
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
    </ImageKitProvider>
  );
}
