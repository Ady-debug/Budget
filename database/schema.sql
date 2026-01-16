-- Budgeting Application Database Schema

-- Budget table 
CREATE TABLE budget(
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  category VARCHAR(50) NOT NULL,
  item VARCHAR(50) NOT NULL,
  amount DECIMAL (10,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) DEFAULT 'GBP',
  period VARCHAR(20) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION auto_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on any UPDATE
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON budget
FOR EACH ROW
EXECUTE FUNCTION auto_update_timestamp();

-- Indexes for better query performance
CREATE INDEX idx_budget_user_id ON budget(user_id);

-- Enable Row Level Security
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own budget data
CREATE POLICY "Users can view their own budget data"
  ON budget
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget data"
  ON budget
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget data"
  ON budget
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget data"
  ON budget
  FOR DELETE
  USING (auth.uid() = user_id);

-- TODO: Add foreign key constraints when full DB setup
-- Consider additional indexing

