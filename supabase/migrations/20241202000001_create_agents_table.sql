-- Migration: Create agents table
-- Created: 2024-12-02
-- Description: Initial schema for agents table with all required fields

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) > 0),
  description TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  knowledge TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_name ON public.agents(name);

-- Add comments for documentation
COMMENT ON TABLE public.agents IS 'Stores AI agent configurations with their context, instructions, and knowledge base';
COMMENT ON COLUMN public.agents.id IS 'Unique identifier for the agent (UUID)';
COMMENT ON COLUMN public.agents.name IS 'Display name of the agent';
COMMENT ON COLUMN public.agents.description IS 'Brief description of what the agent does';
COMMENT ON COLUMN public.agents.context IS 'Context information for the agent';
COMMENT ON COLUMN public.agents.instructions IS 'Instructions for how the agent should behave';
COMMENT ON COLUMN public.agents.knowledge IS 'Knowledge base content for the agent';
COMMENT ON COLUMN public.agents.created_at IS 'Timestamp when the agent was created';
COMMENT ON COLUMN public.agents.updated_at IS 'Timestamp when the agent was last updated';

