/*
  # Create task_attachments table

  1. New Tables
    - `task_attachments`
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key to tasks)
      - `filename` (text, required)
      - `file_url` (text, required)
      - `uploaded_by` (uuid, foreign key to users)
      - `uploaded_at` (timestamp)

  2. Security
    - Enable RLS on `task_attachments` table
    - Add policy for users to manage attachments on accessible tasks
*/

-- Create task_attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_url text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage attachments on accessible tasks"
  ON task_attachments
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