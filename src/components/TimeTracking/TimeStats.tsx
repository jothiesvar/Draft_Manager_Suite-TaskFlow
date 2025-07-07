import React from 'react';
import { TimeEntry } from '../../types/timeTracking';
import { Clock, DollarSign, Target, TrendingUp } from 'lucide-react';

interface TimeStatsProps {
  entries: TimeEntry[];
  formatDuration: (seconds: number) => string;
}

const TimeStats: React.FC<TimeStatsProps> = ({ entries, formatDuration }) => {
  const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalEarnings = entries.reduce((sum, entry) => sum + (entry.duration / 3600) * entry.hourlyRate, 0);
  const billableTime = entries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.duration, 0);
  const completedTasks = entries.length;

  const stats = [
    {
      title: 'Total Time',
      value: formatDuration(totalTime),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Billable Time',
      value: formatDuration(billableTime),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Tasks Completed',
      value: completedTasks.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const projects = entries.reduce((acc, entry) => {
    if (!acc[entry.project]) {
      acc[entry.project] = { time: 0, earnings: 0 };
    }
    acc[entry.project].time += entry.duration;
    acc[entry.project].earnings += (entry.duration / 3600) * entry.hourlyRate;
    return acc;
  }, {} as Record<string, { time: number; earnings: number }>);

  const topProjects = Object.entries(projects)
    .sort(([, a], [, b]) => b.time - a.time)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg mb-2`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Projects */}
      {topProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Projects Today</h3>
          
          <div className="space-y-3">
            {topProjects.map(([project, data], index) => (
              <div key={project} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-orange-500' :
                    index === 1 ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{project}</p>
                    <p className="text-xs text-gray-500">{formatDuration(data.time)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">${data.earnings.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm space-y-1 opacity-90">
          <li>• Use descriptive task names for better tracking</li>
          <li>• Set hourly rates to calculate earnings</li>
          <li>• Mark billable time for client invoicing</li>
          <li>• Export data for detailed reports</li>
        </ul>
      </div>
    </div>
  );
};

export default TimeStats;