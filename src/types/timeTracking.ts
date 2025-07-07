export interface TimeEntry {
  id: string;
  taskName: string;
  project: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  date: Date;
  userId: string;
  hourlyRate: number;
  billable: boolean;
}

export interface TimeTrackingState {
  isTracking: boolean;
  currentEntry: TimeEntry | null;
  elapsedTime: number;
  startTime: Date | null;
}

export interface ProjectSummary {
  project: string;
  totalTime: number;
  totalEarnings: number;
  taskCount: number;
}

export interface DailySummary {
  date: Date;
  totalTime: number;
  totalEarnings: number;
  taskCount: number;
  projects: ProjectSummary[];
}