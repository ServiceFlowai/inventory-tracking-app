import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white font-bold">Inventory App</div>
        <div className="flex space-x-4">
          <Link to="/" className="text-white">Dashboard</Link>
          <Link to="/import-export" className="text-white">Import/Export</Link>
          <Link to="/role-management" className="text-white">Role Management</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;