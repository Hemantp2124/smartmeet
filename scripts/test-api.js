const axios = require('axios');
const fs = require('fs');

const API_BASE_URL = 'http://localhost:3000/api';

// Test configuration
const TEST_USER = {
  email: 'test@example.com',
  password: 'Test@1234'
};

let authToken = '';

// Helper function to make authenticated requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

async function testAuth() {
  console.log('\n=== Testing Authentication ===');
  
  try {
    // 1. Register a test user
    console.log('1. Testing user registration...');
    await api.post('/auth/register', {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: 'Test User'
    });
    console.log('✅ Registration successful');

    // 2. Test login
    console.log('\n2. Testing login...');
    const loginRes = await api.post('/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    authToken = loginRes.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('✅ Login successful');
    
  } catch (error) {
    console.log('ℹ️ User might already exist, trying login...');
    const loginRes = await api.post('/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    authToken = loginRes.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('✅ Login successful');
  }
}

async function testMeetings() {
  console.log('\n=== Testing Meetings API ===');
  let meetingId;

  try {
    // 1. Create a meeting
    console.log('1. Creating a new meeting...');
    const newMeeting = {
      title: 'Test Meeting',
      sourceLink: 'https://example.com/meeting-1',
      status: 'scheduled'
    };
    
    const createRes = await api.post('/meetings', newMeeting);
    meetingId = createRes.data.id;
    console.log(`✅ Meeting created with ID: ${meetingId}`);

    // 2. Get all meetings
    console.log('\n2. Fetching all meetings...');
    const meetingsRes = await api.get('/meetings');
    console.log(`✅ Found ${meetingsRes.data.length} meetings`);

    // 3. Get single meeting
    console.log(`\n3. Fetching meeting ${meetingId}...`);
    await api.get(`/meetings/${meetingId}`);
    console.log('✅ Meeting retrieved successfully');

    // 4. Update meeting
    console.log('\n4. Updating meeting...');
    await api.patch(`/meetings/${meetingId}`, {
      title: 'Updated Test Meeting'
    });
    console.log('✅ Meeting updated successfully');

    // 5. Delete meeting
    console.log('\n5. Deleting meeting...');
    await api.delete(`/meetings/${meetingId}`);
    console.log('✅ Meeting deleted successfully');

  } catch (error) {
    console.error('❌ Meeting test failed:', error.response?.data || error.message);
  }
}

async function testFileUpload() {
  console.log('\n=== Testing File Upload ===');
  
  try {
    // Create a test file
    const testFilePath = './test-upload.txt';
    fs.writeFileSync(testFilePath, 'This is a test file');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    
    const uploadRes = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ File uploaded successfully:', uploadRes.data);
    fs.unlinkSync(testFilePath); // Clean up
    
  } catch (error) {
    console.error('❌ File upload test failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  try {
    await testAuth();
    await testMeetings();
    await testFileUpload();
    
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  }
}

runTests();
