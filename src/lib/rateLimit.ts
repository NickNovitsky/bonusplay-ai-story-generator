import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function checkRateLimit(ip: string) {
  const { data: existing } = await supabase
    .from('abuse_flags')
    .select('*')
    .eq('ip', ip)
    .single()

  if (existing?.blocked) return false

  const now = new Date()
  const { count } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('timestamp', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())

  if ((count ?? 0) >= 5) {
    await supabase.from('abuse_flags')
      .upsert({ ip, flag_count: 1, blocked: true })
    return false
  }

  await supabase.from('usage_logs').insert({ ip, action: 'generate-preview' })
  return true
}

export async function flagRepeatAbuser(ip: string) {
  const { data: flag } = await supabase.from('abuse_flags').select('*').eq('ip', ip).single()
  if (!flag) {
    await supabase.from('abuse_flags').insert({ ip, flag_count: 1 })
  } else {
    await supabase.from('abuse_flags')
      .update({ flag_count: flag.flag_count + 1, blocked: flag.flag_count + 1 >= 3 })
      .eq('ip', ip)
  }
}
