import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Box, ClipboardList } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-around">
      <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <Home size={24} />
        <span>Dashboard</span>
      </Link>
      <Link to="/receiving" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <Box size={24} />
        <span>Receiving</span>
      </Link>
      <Link to="/picking" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <ClipboardList size={24} />
        <span>Picking</span>
      </Link>
    </nav>
  );
};

export default Navigation;