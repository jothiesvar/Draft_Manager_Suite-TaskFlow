import React from 'react';
import { DashboardMetric } from '../../types';
import { 
  DollarSign, 
  Users, 
  CheckCircle, 
  TrendingUp 
} from 'lucide-react';

interface MetricCardProps {
  metric: DashboardMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar-sign':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'users':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'check-circle':
        return <CheckCircle className="h-6 w-6 text-orange-500" />;
      case 'trending-up':
        return <TrendingUp className="h-6 w-6 text-purple-500" />;
      default:
        return <TrendingUp className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
        {getIcon(metric.icon)}
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
      </div>
      
      <div className="flex items-center">
        <span className={`text-sm font-medium ${
          metric.trend === 'up' ? 'text-green-600' : 
          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {metric.change}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;