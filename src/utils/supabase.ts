// supabase.js
import { createClient } from '@supabase/supabase-js';
// Define feedback type
export interface Feedback {
    id?: number;
    name: string;
    comment: string;
    created_at?: string;
  }
  
const supabaseUrl = 'https://xdywesvllsjqnllpypqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkeXdlc3ZsbHNqcW5sbHB5cHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzOTAxNzYsImV4cCI6MjA0Njk2NjE3Nn0.ZGIOu5wPzoPvHM7qe7nWkLr4mqdd89Rc8gvSuC4o4C0';
export const supabase = createClient(supabaseUrl, supabaseKey);



// NEXT_PUBLIC_SUPABASE_URL=https://xdywesvllsjqnllpypqx.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkeXdlc3ZsbHNqcW5sbHB5cHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzOTAxNzYsImV4cCI6MjA0Njk2NjE3Nn0.ZGIOu5wPzoPvHM7qe7nWkLr4mqdd89Rc8gvSuC4o4C0
            