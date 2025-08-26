const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:3000/api';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASS = 'Test@1234';

async function testAuth() {
  console.log('=== Testing Authentication Flow ===\n');
  
  // 1. Test Registration
  console.log('1. Testing Registration...');
  try {
    const registerRes = await axios.post(`${API_BASE}/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASS,
      name: 'Test User'
    });
    console.log('✅ Registration successful');
    console.log('   User ID:', registerRes.data.user?.id);
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return;
  }

  // 2. Test Login
  console.log('\n2. Testing Login...');
  try {
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASS
    });
    console.log('✅ Login successful');
    
    const authToken = loginRes.data.token;
    console.log('   Token:', authToken ? 'Received' : 'Missing');
    
    // 3. Test Session
    console.log('\n3. Testing Session...');
    const sessionRes = await axios.get(`${API_BASE}/auth/session`, {
      headers: { 'Cookie': `sb-access-token=${authToken}` }
    });
    console.log('✅ Session verified');
    console.log('   User:', sessionRes.data.user?.email);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
