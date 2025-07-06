import React from 'react';
import { CheckCircle, FileText, UserPlus, AlertCircle } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'task',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: 'Task completed: Website Redesign',
      subtitle: 'by John Doe • 2 hours ago',
    },
    {
      id: 2,
      type: 'invoice',
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      title: 'Invoice sent to Tech Solutions Inc.',
      subtitle: 'by Sarah Wilson • 4 hours ago',
    },
    {
      id: 3,
      type: 'client',
      icon: <UserPlus className="h-5 w-5 text-orange-500" />,
      title: 'New client added: Digital Marketing Pro',
      subtitle: 'by Mike Johnson • 1 day ago',
    },
    {
      id: 4,
      type: 'task',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      title: 'Task overdue: Database Migration',
      subtitle: 'by Jane Smith • 2 days ago',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;