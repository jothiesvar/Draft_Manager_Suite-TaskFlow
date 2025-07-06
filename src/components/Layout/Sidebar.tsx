import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  UserPlus, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Clock, 
  BarChart3, 
  Settings,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'leads', label: 'Leads', icon: UserPlus },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const bottomMenuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
        <p className="text-sm text-gray-600">Management Suite</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeItem === item.id
                  ? 'bg-orange-50 text-orange-600 border-r-3 border-orange-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeItem === item.id
                  ? 'bg-orange-50 text-orange-600 border-r-3 border-orange-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={logout}
          className="w-full flex items-center px-6 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;