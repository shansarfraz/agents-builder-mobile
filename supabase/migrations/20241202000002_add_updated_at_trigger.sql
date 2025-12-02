-- Migration: Add automatic updated_at trigger
-- Created: 2024-12-02
-- Description: Automatically updates the updated_at column when a row is modified

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on agents table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment
COMMENT ON FUNCTION public.handle_updated_at() IS 'Automatically updates the updated_at timestamp on row modification';

