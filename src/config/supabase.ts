import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const SUPABASE_URL = 'https://gwylysqaitmekgpgyrqa.supabase.co';
// TODO: Replace with your actual anon key from Supabase Dashboard -> Settings -> API
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

