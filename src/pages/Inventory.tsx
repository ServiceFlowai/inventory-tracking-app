import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface InventoryItem {
  sku: string;
  name: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  unitCost: number;
  supplier: string;
  quantity: number;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    axios.get('/api/inventory')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
      <table className="min-w-full mt-4 bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">SKU</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Unit Cost</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Supplier</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.sku}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{item.sku}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{item.name}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{item.category}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">${item.unitCost.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{item.supplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;