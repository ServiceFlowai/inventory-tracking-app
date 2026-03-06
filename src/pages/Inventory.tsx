import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const Inventory: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(['inventory'], async () => {
    const response = await axios.get('/api/inventory');
    return response.data;
  });

  const mutation = useMutation(
    (newItem: any) => axios.post('/api/inventory', newItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">SKU</th>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Stock Qty</th>
            <th className="py-2">Reorder Point</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item.sku} className="text-center">
              <td className="py-2">{item.sku}</td>
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.category}</td>
              <td className="py-2">{item.stockQty}</td>
              <td className="py-2">{item.reorderPoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;