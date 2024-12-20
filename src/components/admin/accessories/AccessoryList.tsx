import { useState } from 'react';
import { useRouter } from 'next/router';
import { Image } from '@/components/common/Image';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

interface AccessoryListProps {
  accessories: Accessory[];
  onDelete: (id: string) => Promise<void>;
}

export function AccessoryList({ accessories, onDelete }: AccessoryListProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleVisibility = async (accessory: Accessory) => {
    try {
      const { error } = await supabase
        .from('accessories')
        .update({ visible: !accessory.visible })
        .eq('id', accessory.id);

      if (error) throw error;
      toast.success(`Accessory ${accessory.visible ? 'hidden from' : 'shown on'} main page`);
      router.reload();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accessory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visibility
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accessories.map((accessory) => (
            <tr key={accessory.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      src={accessory.image}
                      alt={accessory.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {accessory.name}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {accessory.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {accessory.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                £{accessory.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  accessory.in_stock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {accessory.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleVisibility(accessory)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                    accessory.visible
                      ? 'text-green-700 hover:text-green-800'
                      : 'text-gray-500 hover:text-gray-600'
                  }`}
                  title={accessory.visible ? 'Hide from main page' : 'Show on main page'}
                >
                  {accessory.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span>{accessory.visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push(`/admin/dashboard/accessories/${accessory.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit accessory"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(accessory.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete accessory"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteId && (
        <DeleteConfirmModal
          title="Delete Accessory"
          message="Are you sure you want to delete this accessory? This action cannot be undone."
          onConfirm={async () => {
            await onDelete(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}