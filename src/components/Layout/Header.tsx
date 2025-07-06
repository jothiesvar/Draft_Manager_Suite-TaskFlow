import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Bell, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clients, tasks, or invoices..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-orange-500 transition-colors" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </div>
          
          <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-orange-500 transition-colors" />
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.user_type || 'Member'}</p>
            </div>
            <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;