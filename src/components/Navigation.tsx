import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Box } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Link to="/inventory" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
              <Box className="w-5 h-5 mr-2" />
              Inventory
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;