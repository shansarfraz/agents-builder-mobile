import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const SUPABASE_URL = 'https://gwylysqaitmekgpgyrqa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3eWx5c3FhaXRtZWtncGd5cnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzY3MDIsImV4cCI6MjA4MDI1MjcwMn0.jCtyu5lQ-_R9gGUmp6vYDHYp1-KkbwjoekNWprKNluY';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

