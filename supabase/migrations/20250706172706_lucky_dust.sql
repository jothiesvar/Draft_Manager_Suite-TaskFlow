/*
  # Create invoice_items table

  1. New Tables
    - `invoice_items`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key to invoices)
      - `description` (text, required)
      - `quantity` (numeric, required)
      - `rate` (numeric, required)
      - `amount` (numeric, required)

  2. Security
    - Enable RLS on `invoice_items` table
    - Add policy for users to manage items on their invoices
*/

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  rate numeric(12,2) NOT NULL,
  amount numeric(12,2) NOT NULL
);

-- Enable RLS
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage items on their invoices"
  ON invoice_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_id
      AND i.created_by = auth.uid()
    )
  );

CREATE POLICY "Team members can access invoice items"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices i
      JOIN team_members tm ON tm.user_id = i.created_by
      WHERE i.id = invoice_id
      AND tm.member_email = auth.email()
      AND tm.status = 'active'
    )
  );