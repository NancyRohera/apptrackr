import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://yhleunqwiznkurnxnden.supabase.co"
const supabaseKey = "sb_publishable_3FFbDNWr8_0bd6xF-WBErg_CTMe5A9J"

export const supabase = createClient(supabaseUrl, supabaseKey)