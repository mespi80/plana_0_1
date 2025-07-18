import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAndUpdateUserRoles() {
  console.log('Checking user roles...');

  try {
    // Get all users from profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    console.log(`Found ${profiles?.length || 0} users:`);
    
    profiles?.forEach(profile => {
      console.log(`- ${profile.email}: ${profile.role}`);
    });

    // Check if there are any users without roles
    const usersWithoutRole = profiles?.filter(p => !p.role);
    if (usersWithoutRole && usersWithoutRole.length > 0) {
      console.log('\nUsers without roles found. Setting default role...');
      
      for (const user of usersWithoutRole) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('id', user.id);
        
        if (updateError) {
          console.error(`Error updating user ${user.email}:`, updateError);
        } else {
          console.log(`Updated ${user.email} to role: user`);
        }
      }
    }

    // Check if there are any admin users
    const adminUsers = profiles?.filter(p => p.role === 'admin');
    if (adminUsers && adminUsers.length > 0) {
      console.log('\nAdmin users found:');
      adminUsers.forEach(user => {
        console.log(`- ${user.email}: ${user.role}`);
      });
    } else {
      console.log('\nNo admin users found. You may need to manually set a user as admin.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndUpdateUserRoles(); 