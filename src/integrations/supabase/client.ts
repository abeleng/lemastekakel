// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://otozsedjhqzxztkoslea.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90b3pzZWRqaHF6eHp0a29zbGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDI4NjYsImV4cCI6MjA1MDE3ODg2Nn0.okGD0ZYJN481GIWeOnCSP2BhqiAJlyGbsASpfNU7Zus";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);