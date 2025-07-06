import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Download, Filter, Calendar } from 'lucide-react';

const ReportsSection: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Projects Completed',
      value: '28',
      change: '+8.2%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-blue-600',
    },
    {
      title: 'Active Clients',
      value: '15',
      change: '+3',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
    },
    {
      title: 'Hours Tracked',
      value: '342',
      change: '+15.3%',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-600',
    },
  ];

  const projectData = [
    { name: 'Website Redesign', completion: 85, revenue: '$12,500', status: 'In Progress' },
    { name: 'Mobile App Development', completion: 100, revenue: '$25,000', status: 'Completed' },
    { name: 'Brand Identity', completion: 60, revenue: '$8,500', status: 'In Progress' },
    { name: 'E-commerce Platform', completion: 100, revenue: '$18,200', status: 'Completed' },
    { name: 'Marketing Campaign', completion: 40, revenue: '$6,800', status: 'In Progress' },
  ];

  const teamPerformance = [
    { name: 'John Doe', tasksCompleted: 24, hoursLogged: 156, efficiency: 92 },
    { name: 'Jane Smith', tasksCompleted: 18, hoursLogged: 142, efficiency: 88 },
    { name: 'Mike Johnson', tasksCompleted: 21, hoursLogged: 138, efficiency: 85 },
    { name: 'Sarah Wilson', tasksCompleted: 16, hoursLogged: 124, efficiency: 90 },
  ];

  const exportReport = () => {
    // Mock export functionality
    console.log('Exporting report...');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: 'Projects' },
              { id: 'team', label: 'Team Performance' },
              { id: 'financial', label: 'Financial' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  reportType === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-600">{metric.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Content */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Completion Rate</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      )}

      {reportType === 'projects' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Project Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectData.map((project, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-800">{project.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.completion}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800">{project.revenue}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'team' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Team Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks Completed
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Logged
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamPerformance.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-800">{member.tasksCompleted}</td>
                    <td className="py-4 px-6 text-gray-800">{member.hoursLogged}h</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${member.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{member.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Project Revenue</span>
                <span className="font-semibold text-gray-800">$38,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recurring Revenue</span>
                <span className="font-semibold text-gray-800">$7,030</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">One-time Revenue</span>
                <span className="font-semibold text-gray-800">$0</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Total Revenue</span>
                  <span className="font-bold text-orange-600">$45,230</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Operational Costs</span>
                <span className="font-semibold text-gray-800">$8,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Software & Tools</span>
                <span className="font-semibold text-gray-800">$2,300</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Marketing</span>
                <span className="font-semibold text-gray-800">$1,800</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Net Profit</span>
                  <span className="font-bold text-green-600">$32,630</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;