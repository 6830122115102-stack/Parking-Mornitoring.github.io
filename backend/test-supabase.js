const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './config.env' });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🔄 Testing connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('parking_spots')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testConnection();
