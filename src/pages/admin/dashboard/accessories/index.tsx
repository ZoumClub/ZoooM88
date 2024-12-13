```tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/dashboard/AdminNav';
import { AccessoryList } from '@/components/admin/accessories/AccessoryList';
import { getAllAccessories, deleteAccessory } from '@/lib/api/accessories';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

export default function AccessoriesPage() {
  const router = useRouter();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = async () => {
    try {
      const data = await getAllAccessories();
      setAccessories(data);
    } catch (error) {
      console.error('Error loading accessories:', error);
      toast.error('Failed to load accessories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccessory(id);
      toast.success('Accessory deleted successfully');
      loadAccessories();
    } catch (error) {
      console.error('Error deleting accessory:', error);
      toast.error('Failed to delete accessory');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen">
          <AdminNav onLogout={() => router.push('/admin/login')} />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen">
        <AdminNav onLogout={() => router.push('/admin/login')} />
        
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Accessories</h1>
              <button
                onClick={() => router.push('/admin/dashboard/accessories/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Accessory
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <AccessoryList 
                accessories={accessories}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```