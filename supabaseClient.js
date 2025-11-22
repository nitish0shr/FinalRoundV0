import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxpkmfrfuwbvyttwwhfe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cGttZnJmdXdidnl0dHd3aGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTkwMTcsImV4cCI6MjA3OTM5NTAxN30.IToH0YI5kLQ8EHwUQIBLyRdj8YBGS3KezmpbFuu8HGQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)