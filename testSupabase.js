import { supabase } from './supabaseClient.js'

async function run() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')

  if (error) {
    console.error('Error communicating with Supabase:', error)
    return
  }

  console.log('Data from Supabase:')
  console.log(data)
}

run()