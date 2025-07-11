import { Client, Lead, Task, Invoice, DashboardMetric, User, TeamMember } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    user_type: 'business',
    company_name: 'Tech Solutions Inc.',
    gst_number: 'GST123456789',
    billing_address: '123 Business Street, Tech City, TC 12345',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-12-01'),
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    user_id: '1',
    member_email: 'jane@example.com',
    role: 'manager',
    status: 'active',
    joined_at: new Date('2024-02-01'),
  },
  {
    id: '2',
    user_id: '1',
    member_email: 'mike@example.com',
    role: 'member',
    status: 'active',
    joined_at: new Date('2024-03-15'),
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    status: 'active',
    projects: 5,
    revenue: 125000,
    added_by: '1',
    created_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@digitalmarketing.com',
    phone: '+1 (555) 234-5678',
    company: 'Digital Marketing Pro',
    status: 'active',
    projects: 3,
    revenue: 85000,
    added_by: '1',
    created_at: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@startupcorp.com',
    phone: '+1 (555) 345-6789',
    company: 'StartupCorp',
    status: 'pending',
    projects: 1,
    revenue: 25000,
    added_by: '1',
    created_at: new Date('2024-03-10'),
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Emily Rodriguez',
    email: 'emily@globalenterprises.com',
    phone: '+1 (555) 456-7890',
    company: 'Global Enterprises',
    status: 'qualified',
    priority: 'high',
    expected_value: 75000,
    source: 'Website',
    owner_id: '1',
    created_at: new Date('2024-12-01'),
  },
  {
    id: '2',
    name: 'David Wilson',
    email: 'david@localbusiness.com',
    phone: '+1 (555) 567-8901',
    company: 'Local Business Co.',
    status: 'contacted',
    priority: 'medium',
    expected_value: 35000,
    source: 'Referral',
    owner_id: '1',
    created_at: new Date('2024-12-03'),
  },
  {
    id: '3',
    name: 'Lisa Anderson',
    email: 'lisa@fashionforward.com',
    phone: '+1 (555) 678-9012',
    company: 'Fashion Forward',
    status: 'new',
    priority: 'low',
    expected_value: 20000,
    source: 'LinkedIn',
    owner_id: '1',
    created_at: new Date('2024-12-05'),
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete redesign of company website with new branding and improved user experience',
    creator_id: '1',
    assignee_id: '2',
    assignee_name: 'Jane Smith',
    status: 'in-progress',
    priority: 'high',
    due_date: new Date('2024-12-20'),
    created_at: new Date('2024-12-01'),
    updated_at: new Date('2024-12-10'),
    comments: [
      {
        id: '1',
        task_id: '1',
        user_id: '1',
        user_name: 'John Doe',
        content: 'Please focus on mobile responsiveness',
        created_at: new Date('2024-12-05'),
      },
    ],
  },
  {
    id: '2',
    title: 'Database Migration',
    description: 'Migrate customer data to new database system with improved performance',
    creator_id: '1',
    assignee_id: '3',
    assignee_name: 'Mike Johnson',
    status: 'todo',
    priority: 'urgent',
    due_date: new Date('2024-12-15'),
    created_at: new Date('2024-12-02'),
    updated_at: new Date('2024-12-02'),
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Launch Q1 marketing campaign across all digital channels',
    creator_id: '1',
    assignee_id: '2',
    assignee_name: 'Jane Smith',
    status: 'review',
    priority: 'medium',
    due_date: new Date('2024-12-25'),
    created_at: new Date('2024-12-03'),
    updated_at: new Date('2024-12-08'),
  },
  {
    id: '4',
    title: 'Client Presentation',
    description: 'Prepare and deliver project presentation to client stakeholders',
    creator_id: '1',
    assignee_id: '1',
    assignee_name: 'John Doe',
    status: 'completed',
    priority: 'high',
    due_date: new Date('2024-12-10'),
    created_at: new Date('2024-12-01'),
    updated_at: new Date('2024-12-10'),
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: '1',
    clientName: 'Tech Solutions Inc.',
    amount: 15000,
    date: new Date('2024-12-15'),
    dueDate: new Date('2025-01-15'),
    status: 'sent',
    items: [
      {
        id: '1',
        description: 'Website Development',
        quantity: 1,
        rate: 15000,
        amount: 15000,
      },
    ],
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientId: '2',
    clientName: 'Digital Marketing Pro',
    amount: 8500,
    date: new Date('2024-12-10'),
    dueDate: new Date('2025-01-10'),
    status: 'paid',
    items: [
      {
        id: '2',
        description: 'SEO Optimization',
        quantity: 1,
        rate: 8500,
        amount: 8500,
      },
    ],
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    title: 'Total Revenue',
    value: '$259,000',
    change: '+12.5% from last month',
    trend: 'up',
    icon: 'dollar-sign',
  },
  {
    title: 'Active Clients',
    value: '23',
    change: '+3 from last month',
    trend: 'up',
    icon: 'users',
  },
  {
    title: 'Tasks Completed',
    value: '127',
    change: '+8.2% from last month',
    trend: 'up',
    icon: 'check-circle',
  },
  {
    title: 'Growth Rate',
    value: '23.5%',
    change: '+2.1% from last month',
    trend: 'up',
    icon: 'trending-up',
  },
];