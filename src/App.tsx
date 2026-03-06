import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReorderRecommendations from './pages/ReorderRecommendations';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reorder-recommendations" element={<ReorderRecommendations />} />
      </Routes>
    </div>
  );
}

export default App;