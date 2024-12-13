```tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/dashboard/AdminNav';
import { ServiceList } from '@/components/admin/services/ServiceList';
import { getAllServices, deleteService } from '@/lib/api/services';
import { toast } from 'react-hot-toast';
import type { Service } from '@/lib/types/service';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success('Service deleted successfully');
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
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
              <h1 className="text-2xl font-bold text-gray-900">Services</h1>
              <button
                onClick={() => router.push('/admin/dashboard/services/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Service
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <ServiceList 
                services={services}
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