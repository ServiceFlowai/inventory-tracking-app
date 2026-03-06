import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ImportExport from './pages/ImportExport';
import RoleManagement from './pages/RoleManagement';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/import-export" element={<ImportExport />} />
        <Route path="/role-management" element={<RoleManagement />} />
      </Routes>
    </div>
  );
};

export default App;