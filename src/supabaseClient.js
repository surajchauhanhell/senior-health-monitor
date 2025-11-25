import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vltdfrogzzllrwxbevwe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdGRmcm9nenpsbHJ3eGJldndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDY2NjMsImV4cCI6MjA3OTYyMjY2M30.AOSIB3AF9_JwkLAtv3LTaEZjVYC2kzJnI74TlA_pv4M'

export const supabase = createClient(supabaseUrl, supabaseKey)
