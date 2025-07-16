import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiHome, FiFileText, FiUsers, FiServer, FiActivity, FiSettings, FiX } = FiIcons;

const Sidebar = ({ closeSidebar }) => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/monitoring', icon: FiActivity, label: 'System Monitoring' },
    { path: '/logs', icon: FiFileText, label: 'Event Logs' },
    { path: '/api-endpoints', icon: FiSettings, label: 'API Endpoints' },
    ...(user?.role === 'admin' ? [
      { path: '/users', icon: FiUsers, label: 'User Management' },
      { path: '/servers', icon: FiServer, label: 'Server Management' }
    ] : [])
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-dark-900 text-white flex flex-col h-screen"
    >
      <div className="p-6 border-b border-dark-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Server Overwatch</h1>
          <p className="text-sm text-dark-400 mt-1">Monitoring System</p>
        </div>
        {/* Close button - visible only on mobile */}
        <button 
          onClick={closeSidebar} 
          className="lg:hidden text-dark-400 hover:text-white transition-colors"
        >
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;