-- =====================================================
-- Agent Builder Mobile - Supabase Database Setup
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard -> SQL Editor -> New Query

-- 1. Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  context TEXT NOT NULL,
  instructions TEXT NOT NULL,
  knowledge TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to auto-update updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- 5. Create policy to allow all operations (for now - you can restrict later)
-- This allows anyone with a valid JWT to read/write
CREATE POLICY "Enable all access for authenticated users" ON public.agents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: If you want to allow anonymous access (no auth required)
CREATE POLICY "Enable all access for anonymous users" ON public.agents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;

-- =====================================================
-- Verification Queries (optional - run to verify setup)
-- =====================================================

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'agents';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'agents'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'agents';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'agents';

