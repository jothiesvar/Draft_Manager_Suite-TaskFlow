/*
  # Create team_members table

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `member_email` (text, required)
      - `role` (enum: admin, manager, member, viewer)
      - `status` (enum: pending, active, inactive)
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS on `team_members` table
    - Add policy for users to manage their own team members
    - Add policy for team members to read team data
*/

-- Create enums
CREATE TYPE member_role_enum AS ENUM ('admin', 'manager', 'member', 'viewer');
CREATE TYPE member_status_enum AS ENUM ('pending', 'active', 'inactive');

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_email text NOT NULL,
  role member_role_enum NOT NULL DEFAULT 'member',
  status member_status_enum NOT NULL DEFAULT 'pending',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, member_email)
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Team members can read team data"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    member_email = auth.email() OR
    auth.uid() = user_id
  );