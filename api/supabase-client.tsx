import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

export default createClient(supabaseUrl!, supabaseKey!);