import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-xl font-bold">Inventory App</div>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
          <Link to="/inventory" className="text-gray-700 hover:text-gray-900">Inventory</Link>
          <Link to="/alerts" className="text-gray-700 hover:text-gray-900">Alerts</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;