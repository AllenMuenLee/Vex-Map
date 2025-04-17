
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zsaekkkjywbeifpqrhpq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzYWVra2tqeXdiZWlmcHFyaHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Njc3MzUsImV4cCI6MjA1ODQ0MzczNX0.sX4Il4kam4aOVfrjiKmdr98mN2P_PsS4Dl6aY2u2Ylk"
export const supabase = createClient(supabaseUrl, supabaseKey)