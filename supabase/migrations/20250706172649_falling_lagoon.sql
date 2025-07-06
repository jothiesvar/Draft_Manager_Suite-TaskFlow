/*
  # Create task_comments table

  1. New Tables
    - `task_comments`
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key to tasks)
      - `user_id` (uuid, foreign key to users)
      - `content` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `task_comments` table
    - Add policy for users to manage comments on accessible tasks
*/

-- Create task_comments table
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage comments on accessible tasks"
  ON task_comments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
      AND (
        t.creator_id = auth.uid() OR
        t.assignee_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM team_members tm
          WHERE tm.user_id = t.creator_id
          AND tm.member_email = auth.email()
          AND tm.status = 'active'
        )
      )
    )
  );