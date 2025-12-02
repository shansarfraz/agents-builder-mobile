-- Migration: Enable Realtime
-- Created: 2024-12-02
-- Description: Enable real-time subscriptions for the agents table

-- Enable realtime for agents table
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;

-- Add comment
COMMENT ON TABLE public.agents IS 'Stores AI agent configurations with real-time sync enabled';

