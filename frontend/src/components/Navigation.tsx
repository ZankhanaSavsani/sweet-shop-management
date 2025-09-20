import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600 flex items-center">
          <span className="mr-2">🍬</span> Sweet Shop
        </Link>
      </div>
      <button className="md:hidden p-2" onClick={() => setMenuOpen(m => !m)}>
        <span className="material-icons">menu</span>
      </button>
      <div className={`flex-col md:flex-row md:flex items-center md:space-x-4 ${menuOpen ? 'flex' : 'hidden'} md:!flex absolute md:static top-12 left-0 w-full md:w-auto bg-white md:bg-transparent z-10`}>
        <NavLink to="/dashboard" className={({ isActive }) => `block px-3 py-2 rounded hover:bg-blue-100 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>Dashboard</NavLink>
        {user?.isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `block px-3 py-2 rounded hover:bg-blue-100 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>Admin Panel</NavLink>
        )}
        <div className="flex items-center space-x-2 px-3 py-2">
          <span className="text-gray-600">Hello, {user?.username || 'Guest'}</span>
          <button onClick={handleLogout} className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
