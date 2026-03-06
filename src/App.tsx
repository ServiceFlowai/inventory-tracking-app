import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import OrderWorkflow from './pages/OrderWorkflow';
import ReorderRecommendations from './pages/ReorderRecommendations';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/order-workflow" element={<OrderWorkflow />} />
        <Route path="/reorder-recommendations" element={<ReorderRecommendations />} />
      </Routes>
    </div>
  );
}

export default App;
