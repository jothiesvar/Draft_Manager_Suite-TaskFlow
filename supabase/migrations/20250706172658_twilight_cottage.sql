/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text, unique, required)
      - `client_id` (uuid, foreign key to clients)
      - `amount` (numeric, required)
      - `date` (date, required)
      - `due_date` (date, required)
      - `status` (enum: draft, sent, paid, overdue)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `invoices` table
    - Add policy for users to manage their own invoices
    - Add policy for team members to access invoices
*/

-- Create enum for invoice status
CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'paid', 'overdue');

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  status invoice_status_enum NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Team members can access invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = created_by
      AND tm.member_email = auth.email()
      AND tm.status = 'active'
    )
  );

-- Create trigger to update updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();