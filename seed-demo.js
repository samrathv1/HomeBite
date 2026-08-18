const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const phone = '9876543210';
  const mockEmail = `test_${phone}@homebite.demo`;
  const mockPassword = `HomeBiteMock123!`;

  console.log(`Creating demo user: ${mockEmail}`);

  // Create user via admin API (bypasses email confirmation completely)
  const { data, error } = await supabase.auth.admin.createUser({
    email: mockEmail,
    password: mockPassword,
    phone: `+91${phone}`,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: {
      full_name: 'Demo User',
      role: 'customer'
    }
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('User already exists! The mock auth should work now.');
    } else {
      console.error('Error creating user:', error);
    }
    return;
  }

  console.log('Successfully created demo user!', data.user.id);
}

main();
