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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Ensure each user can only have one entry per category/item combination
  CONSTRAINT unique_user_category_item UNIQUE (user_id, category, item)
  -- Removes budget data when user is deleted
  CONSTRAINT budget_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Profiles table for user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
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

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that runs after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();

-- Trigger for budget updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON budget
FOR EACH ROW
EXECUTE FUNCTION auto_update_timestamp();

-- Trigger for profiles updated_at
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION auto_update_timestamp();

-- Indexes for better query performance
CREATE INDEX idx_budget_user_id ON budget(user_id);
CREATE INDEX idx_budget_category ON budget(category);
CREATE INDEX idx_budget_user_category ON budget(user_id, category);

-- Enable Row Level Security
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);
