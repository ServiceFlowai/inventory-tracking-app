import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Analytics: React.FC = () => {
  const { data, error, isLoading } = useQuery(['analytics'], async () => {
    const response = await axios.get('/api/analytics');
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const chartData = {
    labels: data.map((item: any) => item.category),
    datasets: [
      {
        label: 'Sales by Category',
        data: data.map((item: any) => item.sales),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Analytics;