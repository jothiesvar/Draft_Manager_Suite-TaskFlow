/*
  # Create calendar_events table

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `date` (date, required)
      - `time` (time, optional)
      - `type` (enum: task, meeting, deadline)
      - `priority` (enum: low, medium, high, urgent)
      - `user_id` (uuid, foreign key to users)
      - `task_id` (uuid, foreign key to tasks, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policy for users to manage their own events
    - Add policy for team members to access events
*/

-- Create enums
CREATE TYPE event_type_enum AS ENUM ('task', 'meeting', 'deadline');
CREATE TYPE event_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time,
  type event_type_enum NOT NULL DEFAULT 'meeting',
  priority event_priority_enum NOT NULL DEFAULT 'medium',
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their calendar events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Team members can access calendar events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = user_id
      AND tm.member_email = auth.email()
      AND tm.status = 'active'
    )
  );