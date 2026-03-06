import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useQuery(['kpiData'], async () => {
    const response = await axios.get('/api/kpi');
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const stockoutData = {
    labels: data.stockouts.map((item: any) => item.sku),
    datasets: [
      {
        label: 'Stockouts',
        data: data.stockouts.map((item: any) => item.count),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporting & KPI Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Stockouts</h2>
          <Bar data={stockoutData} />
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Inventory Turnover</h2>
          <Line data={data.turnover} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;