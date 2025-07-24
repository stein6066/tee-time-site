import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwzbjzcrkrlzowoohqlq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3emJqemNya3Jsem93b29ocWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODE1MTAsImV4cCI6MjA2ODk1NzUxMH0.eCIJyON5AVsig18FqvdBGUXP2OOB4m7Ke5XDBSDq5KE'; // Get this from Supabase → Project → Settings → API

export const supabase = createClient(supabaseUrl, supabaseKey);
