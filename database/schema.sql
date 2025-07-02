-- Budgeting Application Database Schema

-- Income table 
CREATE TABLE income(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  income_type VARCHAR(50) NOT NULL,
  amount DECIMAL (10,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) DEFAULT 'GBP',
  period VARCHAR(20) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_income_user_id ON income(user_id);

-- TODO: Add foreign key constraints when full DB setup
-- Consider additional indexing
-- Create RLS policy for viewing and INSERT/DELETE/UPDATE

