const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:\\homebite\\.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfiles() {
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Auth error:", usersError);
    return;
  }
  console.log("Users in auth.users:", users.users.length);
  for (const u of users.users) {
    console.log(`- ${u.id} | Phone: ${u.phone}`);
  }

  const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
  if (profError) {
    console.error("Profiles error:", profError);
    return;
  }
  console.log("\nUsers in public.profiles:", profiles.length);
  for (const p of profiles) {
    console.log(`- ${p.id} | Phone: ${p.phone} | Role: ${p.role}`);
  }
}

checkProfiles();
