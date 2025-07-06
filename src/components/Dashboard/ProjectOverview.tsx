import React from 'react';

const ProjectOverview: React.FC = () => {
  const projectStats = [
    { label: 'Active Projects', value: '12', color: 'text-blue-600' },
    { label: 'Completed This Month', value: '8', color: 'text-green-600' },
    { label: 'Overdue Tasks', value: '3', color: 'text-red-600' },
    { label: 'Team Utilization', value: '87%', color: 'text-orange-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Overview</h2>
      
      <div className="space-y-4">
        {projectStats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className={`text-lg font-semibold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectOverview;