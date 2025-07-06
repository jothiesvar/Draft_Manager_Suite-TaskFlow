import React from 'react';
import { Task } from '../../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  onTaskClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  tasks, 
  color, 
  onTaskClick, 
  onDragStart, 
  onDrop, 
  onDragOver 
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-h-[600px]"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className={`${color} rounded-lg p-3 mb-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={onTaskClick}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;