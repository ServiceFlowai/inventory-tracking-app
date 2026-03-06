import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Receiving from './pages/Receiving';
import Picking from './pages/Picking';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/receiving" element={<Receiving />} />
        <Route path="/picking" element={<Picking />} />
      </Routes>
    </div>
  );
};

export default App;