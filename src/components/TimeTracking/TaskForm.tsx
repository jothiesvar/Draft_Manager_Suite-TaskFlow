import React, { useState } from 'react';
import { TimeEntry } from '../../types/timeTracking';
import { X, Play, Clock, DollarSign, FileText, Folder } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (taskData: Partial<TimeEntry>) => void;
  onClose: () => void;
  isTracking: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onClose, isTracking }) => {
  const [formData, setFormData] = useState({
    taskName: '',
    project: '',
    description: '',
    hourlyRate: 0,
    billable: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const projects = [
    'Website Development',
    'Mobile App',
    'Database Design',
    'UI/UX Design',
    'Marketing',
    'Research',
    'Client Meeting',
    'Administration',
    'General',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.taskName.trim()) {
      newErrors.taskName = 'Task name is required';
    } else if (formData.taskName.length > 100) {
      newErrors.taskName = 'Task name must be 100 characters or less';
    }
    
    if (!formData.project.trim()) {
      newErrors.project = 'Project is required';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }
    
    if (formData.hourlyRate < 0) {
      newErrors.hourlyRate = 'Hourly rate cannot be negative';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, project: e.target.value }));
    if (errors.project) {
      setErrors(prev => ({ ...prev, project: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Start Time Tracking</h2>
              <p className="text-orange-100 text-sm">Fill in the task details to begin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Name */}
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Task Name *</span>
              </div>
            </label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.taskName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter task name..."
            />
            {errors.taskName && (
              <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.taskName.length}/100 characters</p>
          </div>

          {/* Project */}
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4" />
                <span>Project *</span>
              </div>
            </label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleProjectChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.project ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            {errors.project && (
              <p className="mt-1 text-sm text-red-600">{errors.project}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Add task description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/500 characters</p>
          </div>

          {/* Hourly Rate and Billable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Hourly Rate</span>
                </div>
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  errors.hourlyRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.hourlyRate && (
                <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
              )}
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="billable"
                  checked={formData.billable}
                  onChange={handleChange}
                  className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Billable Time</span>
              </label>
            </div>
          </div>

          {/* Auto-save notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 Your form data is automatically saved as you type and will be restored if you close this dialog.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTracking}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4" />
              <span>Start Tracking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;