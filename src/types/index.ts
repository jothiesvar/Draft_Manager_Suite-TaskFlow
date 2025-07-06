export interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: 'freelancer' | 'business' | 'agency';
  company_name?: string;
  gst_number?: string;
  billing_address?: string;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: string;
  user_id: string;
  member_email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  status: 'pending' | 'active' | 'inactive';
  joined_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  assignee_id?: string;
  assignee_name?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: Date;
  created_at: Date;
  updated_at: Date;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: Date;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  filename: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  added_by: string;
  status: 'active' | 'inactive' | 'pending';
  projects: number;
  revenue: number;
  created_at: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  priority: 'low' | 'medium' | 'high';
  expected_value?: number;
  source?: string;
  owner_id: string;
  created_at: Date;
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'meeting' | 'deadline';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}