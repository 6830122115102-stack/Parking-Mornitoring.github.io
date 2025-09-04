const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/config.env' });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Environment variables status:', {
    SUPABASE_URL: !!supabaseUrl,
    SUPABASE_ANON_KEY: !!supabaseAnonKey,
    SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
    NODE_ENV: process.env.NODE_ENV
  });
  console.error('Please check your config.env file or Vercel environment variables');
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client (for server-side operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

console.log('✅ Supabase client initialized successfully');

module.exports = {
  supabase,
  supabaseAdmin
};
