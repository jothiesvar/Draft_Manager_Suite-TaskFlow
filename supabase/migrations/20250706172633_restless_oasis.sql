/*
  # Create leads table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `company` (text, required)
      - `phone` (text, optional)
      - `status` (enum: new, contacted, qualified, proposal, negotiation, closed)
      - `priority` (enum: low, medium, high)
      - `expected_value` (numeric, optional)
      - `source` (text, optional)
      - `owner_id` (uuid, foreign key to users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for users to manage their own leads
    - Add policy for team members to access leads
*/

-- Create enums
CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed');
CREATE TYPE lead_priority_enum AS ENUM ('low', 'medium', 'high');

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text,
  status lead_status_enum NOT NULL DEFAULT 'new',
  priority lead_priority_enum NOT NULL DEFAULT 'medium',
  expected_value numeric(12,2),
  source text,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Team members can access leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = owner_id
      AND tm.member_email = auth.email()
      AND tm.status = 'active'
    )
  );