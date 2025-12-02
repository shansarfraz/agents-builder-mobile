-- Migration: Enable Row Level Security (RLS)
-- Created: 2024-12-02
-- Description: Enable RLS and create initial policies for agents table

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read access (for development)
-- TODO: Replace with user-specific policies in production
CREATE POLICY "Allow anonymous read access" 
  ON public.agents
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow anonymous insert (for development)
-- TODO: Replace with authenticated user policies in production
CREATE POLICY "Allow anonymous insert" 
  ON public.agents
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous update (for development)
-- TODO: Replace with authenticated user policies in production
CREATE POLICY "Allow anonymous update" 
  ON public.agents
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anonymous delete (for development)
-- TODO: Replace with authenticated user policies in production
CREATE POLICY "Allow anonymous delete" 
  ON public.agents
  FOR DELETE
  TO anon
  USING (true);

-- Policy: Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access" 
  ON public.agents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comments
COMMENT ON POLICY "Allow anonymous read access" ON public.agents IS 'Development policy - allows anonymous read access. Should be restricted in production.';
COMMENT ON POLICY "Allow authenticated users full access" ON public.agents IS 'Allows all authenticated users to perform any operation. Should be restricted to user-owned data in production.';

