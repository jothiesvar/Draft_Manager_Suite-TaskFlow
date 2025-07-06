/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `creator_id` (uuid, foreign key to users)
      - `assignee_id` (uuid, foreign key to users, optional)
      - `status` (enum: todo, in-progress, review, completed)
      - `priority` (enum: low, medium, high, urgent)
      - `due_date` (date, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for users to manage their own tasks
    - Add policy for assigned users to access tasks
    - Add policy for team members to access tasks
*/

-- Create enums
CREATE TYPE task_status_enum AS ENUM ('todo', 'in-progress', 'review', 'completed');
CREATE TYPE task_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  creator_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status task_status_enum NOT NULL DEFAULT 'todo',
  priority task_priority_enum NOT NULL DEFAULT 'medium',
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their created tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Assigned users can access their tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = assignee_id);

CREATE POLICY "Assigned users can update their tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = assignee_id);

CREATE POLICY "Team members can access tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = creator_id
      AND tm.member_email = auth.email()
      AND tm.status = 'active'
    )
  );

-- Create trigger to update updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();