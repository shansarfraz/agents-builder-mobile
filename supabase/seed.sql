-- Seed file for development
-- This file is run when you execute: npm run db:reset

-- Clear existing data (for development only)
TRUNCATE public.agents CASCADE;

-- Insert sample agents for testing
INSERT INTO public.agents (name, description, context, instructions, knowledge) VALUES
(
  'Customer Support Agent',
  'Helpful AI assistant for customer inquiries',
  'You are a friendly customer support agent for a B2B SaaS company.',
  'Always be polite, professional, and provide clear solutions. Escalate complex issues to human support.',
  'Product documentation, FAQ, common troubleshooting steps'
),
(
  'Sales Assistant',
  'Assists with lead qualification and product demos',
  'You are a knowledgeable sales assistant who helps qualify leads.',
  'Ask qualifying questions, understand customer needs, and provide relevant product information.',
  'Product features, pricing tiers, competitor analysis'
),
(
  'Content Writer',
  'Generates marketing content and blog posts',
  'You are a creative content writer specializing in B2B SaaS marketing.',
  'Write engaging, SEO-optimized content that demonstrates thought leadership.',
  'Brand guidelines, SEO best practices, industry trends'
);

-- Log seed completion
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Total agents: %', (SELECT COUNT(*) FROM public.agents);
END $$;

