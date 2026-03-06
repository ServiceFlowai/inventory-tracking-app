import React from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useQuery(['stockData'], async () => {
    const response = await axios.get('/api/stock');
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const chartData = {
    labels: data.map((item: any) => item.date),
    datasets: [
      {
        label: 'Stock Levels',
        data: data.map((item: any) => item.stock),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;