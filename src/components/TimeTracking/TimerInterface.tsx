import React, { useState, useEffect } from 'react';
import { TimeTrackingState } from '../../types/timeTracking';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface TimerInterfaceProps {
  trackingState: TimeTrackingState;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  formatDuration: (seconds: number) => string;
}

const TimerInterface: React.FC<TimerInterfaceProps> = ({
  trackingState,
  onStart,
  onStop,
  onPause,
  formatDuration,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrentTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-semibold text-gray-800">Timer</h2>
        </div>
        
        {/* Current Time Display */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Current Time</p>
          <div className="text-2xl font-mono text-gray-600 bg-gray-50 rounded-lg py-2 px-4 inline-block">
            {formatCurrentTime(currentTime)}
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-8">
          <div className={`text-6xl font-mono font-bold mb-4 transition-colors duration-300 ${
            trackingState.isTracking ? 'text-orange-500' : 'text-gray-800'
          }`}>
            {formatDuration(trackingState.elapsedTime)}
          </div>
          
          {trackingState.isTracking && trackingState.currentEntry && (
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-600 mb-1">Currently tracking</p>
              <p className="font-semibold text-orange-800">{trackingState.currentEntry.taskName}</p>
              <p className="text-sm text-orange-600">{trackingState.currentEntry.project}</p>
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!trackingState.isTracking ? (
            <button
              onClick={onStart}
              className={`flex items-center space-x-3 px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg ${
                trackingState.isTracking ? 'animate-pulse' : ''
              }`}
            >
              <Play className="h-6 w-6" />
              <span className="text-lg">Start Timer</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={onPause}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                <Pause className="h-5 w-5" />
                <span>Pause</span>
              </button>
              
              <button
                onClick={onStop}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <Square className="h-5 w-5" />
                <span>Stop</span>
              </button>
            </div>
          )}
        </div>

        {trackingState.isTracking && (
          <div className="mt-6 text-sm text-gray-500">
            Started at {trackingState.startTime?.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerInterface;