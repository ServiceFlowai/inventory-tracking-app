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
  primaryLocation: string;
  secondaryLocation: string;
}

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    axios.get('/api/inventory')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">SKU</th>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Unit Cost</th>
            <th className="py-2">Supplier</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.sku} className="border-b">
              <td className="py-2">{item.sku}</td>
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.category}</td>
              <td className="py-2">${item.unitCost.toFixed(2)}</td>
              <td className="py-2">{item.supplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;