import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Stockouts</h2>
          <p>Count: 5</p>
          <p>Percentage: 2%</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Inventory Turnover</h2>
          <p>Rate: 8</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Days of Cover</h2>
          <p>Days: 30</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Slow-moving SKUs</h2>
          <p>Count: 12</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;