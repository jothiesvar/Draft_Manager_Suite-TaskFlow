/*
  # Create database indexes and utility functions

  1. Indexes
    - Performance indexes for common queries
    - Foreign key indexes
    - Search indexes

  2. Functions
    - User lookup functions
    - Statistics functions
    - Utility functions

  3. Views
    - Task summary views
    - Client summary views
*/

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(member_email);
CREATE INDEX IF NOT EXISTS idx_clients_added_by ON clients(added_by);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_tasks_creator_id ON tasks(creator_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);

-- Function to get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email text)
RETURNS TABLE(
  id uuid,
  full_name text,
  email text,
  user_type user_type_enum,
  company_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.full_name, u.email, u.user_type, u.company_name
  FROM users u
  WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get task statistics for a user
CREATE OR REPLACE FUNCTION get_task_stats(user_uuid uuid)
RETURNS TABLE(
  total_tasks bigint,
  completed_tasks bigint,
  overdue_tasks bigint,
  in_progress_tasks bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
    COUNT(*) FILTER (WHERE status != 'completed' AND due_date < CURRENT_DATE) as overdue_tasks,
    COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress_tasks
  FROM tasks
  WHERE creator_id = user_uuid OR assignee_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get client revenue summary
CREATE OR REPLACE FUNCTION get_client_revenue_summary(user_uuid uuid)
RETURNS TABLE(
  total_clients bigint,
  active_clients bigint,
  total_revenue numeric,
  monthly_revenue numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_clients,
    COUNT(*) FILTER (WHERE status = 'active') as active_clients,
    COALESCE(SUM(revenue), 0) as total_revenue,
    COALESCE(SUM(revenue) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)), 0) as monthly_revenue
  FROM clients
  WHERE added_by = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for task details with assignee names
CREATE OR REPLACE VIEW task_details AS
SELECT 
  t.*,
  u_creator.full_name as creator_name,
  u_assignee.full_name as assignee_name,
  COUNT(tc.id) as comment_count,
  COUNT(ta.id) as attachment_count
FROM tasks t
LEFT JOIN users u_creator ON t.creator_id = u_creator.id
LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
LEFT JOIN task_comments tc ON t.id = tc.task_id
LEFT JOIN task_attachments ta ON t.id = ta.task_id
GROUP BY t.id, u_creator.full_name, u_assignee.full_name;

-- View for client details with project counts
CREATE OR REPLACE VIEW client_details AS
SELECT 
  c.*,
  u.full_name as added_by_name,
  COUNT(DISTINCT t.id) as actual_projects,
  COALESCE(SUM(i.amount), 0) as actual_revenue
FROM clients c
LEFT JOIN users u ON c.added_by = u.id
LEFT JOIN tasks t ON t.creator_id = c.added_by
LEFT JOIN invoices i ON i.client_id = c.id AND i.status = 'paid'
GROUP BY c.id, u.full_name;