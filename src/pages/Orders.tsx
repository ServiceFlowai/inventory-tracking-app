import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Orders: React.FC = () => {
  const { data, error, isLoading } = useQuery(['orders'], async () => {
    const response = await axios.get('/api/orders');
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">Status</th>
            <th className="py-2">Date</th>
            <th className="py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order: any) => (
            <tr key={order.id} className="text-center">
              <td className="py-2">{order.id}</td>
              <td className="py-2">{order.status}</td>
              <td className="py-2">{order.date}</td>
              <td className="py-2">${order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;