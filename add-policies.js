const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // First test if exec_sql exists
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
      CREATE POLICY "Users can insert own customer profile" ON public.customer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
    `
  });
  if (error) console.error(error);
  else console.log('Successfully added policies via RPC');
}
run();
