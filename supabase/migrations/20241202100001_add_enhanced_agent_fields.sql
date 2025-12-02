-- Migration: Add enhanced agent fields
-- Created: 2024-12-02
-- Description: Add category, status, tags, icon, and color fields to agents table

-- Add new columns
ALTER TABLE public.agents 
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS tags JSONB,
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT;

-- Add check constraint for status
ALTER TABLE public.agents 
  ADD CONSTRAINT agents_status_check 
  CHECK (status IN ('active', 'draft', 'archived'));

-- Add check constraint for category
ALTER TABLE public.agents 
  ADD CONSTRAINT agents_category_check 
  CHECK (category IN ('customer-support', 'sales', 'content', 'analysis', 'development', 'general'));

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents(category);

-- Create GIN index on tags for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_agents_tags ON public.agents USING GIN(tags);

-- Add comments
COMMENT ON COLUMN public.agents.category IS 'Agent category for organization';
COMMENT ON COLUMN public.agents.status IS 'Agent status: active, draft, or archived';
COMMENT ON COLUMN public.agents.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN public.agents.icon IS 'Emoji or icon identifier';
COMMENT ON COLUMN public.agents.color IS 'Hex color code for visual identification';

