/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `company` (text, required)
      - `phone` (text, optional)
      - `added_by` (uuid, foreign key to users)
      - `status` (enum: active, inactive, pending)
      - `projects` (integer, default 0)
      - `revenue` (numeric, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `clients` table
    - Add policy for users to manage their own clients
    - Add policy for team members to access clients
*/

-- Create enum for client status
CREATE TYPE client_status_enum AS ENUM ('active', 'inactive', 'pending');

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text,
  added_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status client_status_enum NOT NULL DEFAULT 'active',
  projects integer DEFAULT 0,
  revenue numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.uid() = added_by);

CREATE POLICY "Team members can access clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = added_by
      AND tm.member_email = auth.email()
      AND tm.status = 'active'
    )
  );