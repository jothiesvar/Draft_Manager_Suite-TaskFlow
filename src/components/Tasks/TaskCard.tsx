import React from 'react';
import { Task } from '../../types';
import { Clock, User, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDragStart }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onClick(task)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
          {task.title}
        </h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>{task.due_date.toLocaleDateString()}</span>
        </div>
        {task.comments && task.comments.length > 0 && (
          <div className="flex items-center space-x-1">
            <span>{task.comments.length}</span>
            <span>💬</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-600">{task.assignee_name || 'Unassigned'}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{Math.floor(Math.random() * 8) + 1}h</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;