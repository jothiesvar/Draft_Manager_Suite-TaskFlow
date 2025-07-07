import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TimerInterface from './TimerInterface';
import TaskForm from './TaskForm';
import TimeEntriesTable from './TimeEntriesTable';
import TimeStats from './TimeStats';
import { TimeEntry, TimeTrackingState } from '../../types/timeTracking';
import { Play, Pause, Square, Download, Filter, Calendar } from 'lucide-react';

const TimeTrackingView: React.FC = () => {
  const { user } = useAuth();
  const [trackingState, setTrackingState] = useState<TimeTrackingState>({
    isTracking: false,
    currentEntry: null,
    elapsedTime: 0,
    startTime: null,
  });
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');

  // Load saved data on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    const savedState = localStorage.getItem('trackingState');
    
    if (savedEntries) {
      const entries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: entry.endTime ? new Date(entry.endTime) : null,
        date: new Date(entry.date),
      }));
      setTimeEntries(entries);
    }
    
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.isTracking && state.startTime) {
        const startTime = new Date(state.startTime);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        
        setTrackingState({
          ...state,
          startTime,
          elapsedTime: elapsed,
          currentEntry: state.currentEntry ? {
            ...state.currentEntry,
            startTime: new Date(state.currentEntry.startTime),
          } : null,
        });
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem('trackingState', JSON.stringify(trackingState));
  }, [trackingState]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (trackingState.isTracking && trackingState.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - trackingState.startTime!.getTime()) / 1000);
        setTrackingState(prev => ({ ...prev, elapsedTime: elapsed }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trackingState.isTracking, trackingState.startTime]);

  const startTimer = (taskData: Partial<TimeEntry>) => {
    const now = new Date();
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskName: taskData.taskName || 'Untitled Task',
      project: taskData.project || 'General',
      description: taskData.description || '',
      startTime: now,
      endTime: null,
      duration: 0,
      date: now,
      userId: user?.id || '1',
      hourlyRate: taskData.hourlyRate || 0,
      billable: taskData.billable || false,
    };

    setTrackingState({
      isTracking: true,
      currentEntry: newEntry,
      elapsedTime: 0,
      startTime: now,
    });

    setShowTaskForm(false);
  };

  const stopTimer = () => {
    if (trackingState.currentEntry && trackingState.startTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - trackingState.startTime.getTime()) / 1000);
      
      const completedEntry: TimeEntry = {
        ...trackingState.currentEntry,
        endTime,
        duration,
      };

      setTimeEntries(prev => [completedEntry, ...prev]);
      setTrackingState({
        isTracking: false,
        currentEntry: null,
        elapsedTime: 0,
        startTime: null,
      });
    }
  };

  const pauseTimer = () => {
    if (trackingState.isTracking && trackingState.currentEntry) {
      stopTimer();
    }
  };

  const deleteEntry = (id: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const exportData = () => {
    const csvContent = [
      ['Task', 'Project', 'Start Time', 'End Time', 'Duration', 'Date', 'Rate', 'Total'],
      ...timeEntries.map(entry => [
        entry.taskName,
        entry.project,
        entry.startTime.toLocaleTimeString(),
        entry.endTime?.toLocaleTimeString() || 'In Progress',
        formatDuration(entry.duration),
        entry.date.toLocaleDateString(),
        `$${entry.hourlyRate}`,
        `$${((entry.duration / 3600) * entry.hourlyRate).toFixed(2)}`,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    const matchesDate = entry.date.toISOString().split('T')[0] === selectedDate;
    
    return matchesSearch && matchesProject && matchesDate;
  });

  const projects = Array.from(new Set(timeEntries.map(entry => entry.project)));

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Time Tracking</h1>
          <p className="text-gray-600 mt-1">Track your time and boost productivity</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Start Timer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Timer Interface */}
        <div className="lg:col-span-2">
          <TimerInterface
            trackingState={trackingState}
            onStart={() => setShowTaskForm(true)}
            onStop={stopTimer}
            onPause={pauseTimer}
            formatDuration={formatDuration}
          />
        </div>

        {/* Today's Stats */}
        <div>
          <TimeStats
            entries={timeEntries.filter(entry => 
              entry.date.toDateString() === new Date().toDateString()
            )}
            formatDuration={formatDuration}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search tasks or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Entries Table */}
      <TimeEntriesTable
        entries={filteredEntries}
        onDelete={deleteEntry}
        onUpdate={updateEntry}
        formatDuration={formatDuration}
      />

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={startTimer}
          onClose={() => setShowTaskForm(false)}
          isTracking={trackingState.isTracking}
        />
      )}
    </div>
  );
};

export default TimeTrackingView;