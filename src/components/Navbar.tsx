import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Box, ShoppingCart, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-1">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/inventory" className="flex items-center space-x-1">
            <Box className="w-5 h-5" />
            <span>Inventory</span>
          </Link>
          <Link to="/orders" className="flex items-center space-x-1">
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link to="/analytics" className="flex items-center space-x-1">
            <BarChart2 className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;