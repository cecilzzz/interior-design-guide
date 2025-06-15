#!/usr/bin/env node

// Proxy setup - must be imported before other modules
import './proxy-setup.mts';

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Load environment variables
config({ path: resolve(projectRoot, '.env.local') });

/**
 * Generate Pinterest OAuth authorization URL
 */
function generateAuthUrl(): string {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI || 'https://httpstat.us/200';
  
  if (!clientId) {
    throw new Error('Missing PINTEREST_CLIENT_ID environment variable');
  }

  // Required scopes for write permissions
  const scopes = [
    'boards:read',
    'boards:write', 
    'pins:read',
    'pins:write',
    'user_accounts:read'
  ];
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state: 'pinterest_oauth_' + Date.now() // Random state for security
  });
  
  return `https://www.pinterest.com/oauth/?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(authCode: string): Promise<any> {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI || 'https://httpstat.us/200';
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing PINTEREST_CLIENT_ID or PINTEREST_CLIENT_SECRET environment variables');
  }

  console.log('🔄 Exchanging authorization code for access token...');
  
  // Create Basic Auth header
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Token exchange failed:', response.status, errorText);
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();
  console.log('✅ Successfully obtained access token!');
  
  return tokenData;
}

/**
 * Test access token validity
 */
async function testAccessToken(token: string): Promise<boolean> {
  try {
    console.log('🧪 Testing access token...');
    
    const response = await fetch('https://api.pinterest.com/v5/user_account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Access token is valid!');
      console.log('👤 User info:', {
        username: data.username,
        account_type: data.account_type
      });
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Access token is invalid:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Token test failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log(`
Pinterest OAuth Flow - Complete Guide
${'='.repeat(50)}

Step 1: Generate Authorization URL
  npm run pinterest-oauth auth

Step 2: Visit the URL and authorize your app
  - Click "Allow" to grant permissions
  - Copy the "code" parameter from the redirect URL

Step 3: Exchange code for access token
  npm run pinterest-oauth exchange <authorization_code>

Step 4: Test your access token
  npm run pinterest-oauth test

Required Environment Variables (.env.local):
  PINTEREST_CLIENT_ID=your_client_id_here
  PINTEREST_CLIENT_SECRET=your_client_secret_here
  PINTEREST_REDIRECT_URI=https://httpstat.us/200  # Optional, defaults to this

Required Scopes (automatically included):
  - boards:read, boards:write
  - pins:read, pins:write  
  - user_accounts:read

Note: Make sure you have Standard API access for production use.
Sandbox mode tokens won't work with the production API endpoints.
`);
}

async function main() {
  try {
    const [,, command, ...args] = process.argv;
    
    switch (command) {
      case 'auth':
        console.log('🔗 Generating Pinterest OAuth authorization URL...\n');
        
        const authUrl = generateAuthUrl();
        console.log('Please visit the following URL to authorize your application:');
        console.log('📋 Copy this URL to your browser:');
        console.log(`\n${authUrl}\n`);
        
        console.log('📝 After authorization:');
        console.log('1. You will be redirected to the redirect URI');
        console.log('2. Copy the "code" parameter from the URL');
        console.log('3. Run: npm run pinterest-oauth exchange <code>');
        break;
        
      case 'exchange':
        const authCode = args[0];
        if (!authCode) {
          console.log('❌ Please provide the authorization code');
          console.log('Usage: npm run pinterest-oauth exchange <authorization_code>');
          return;
        }
        
        const tokenData = await exchangeCodeForToken(authCode);
        
        console.log('\n🎉 Token Information:');
        console.log('Access Token:', tokenData.access_token);
        console.log('Token Type:', tokenData.token_type);
        console.log('Expires In:', tokenData.expires_in, 'seconds');
        console.log('Refresh Token:', tokenData.refresh_token);
        console.log('Scope:', tokenData.scope);
        
        console.log('\n📝 Add this to your .env.local file:');
        console.log(`PINTEREST_ACCESS_TOKEN=${tokenData.access_token}`);
        
        // Test the token
        await testAccessToken(tokenData.access_token);
        break;
        
      case 'test':
        const token = process.env.PINTEREST_ACCESS_TOKEN;
        if (!token) {
          console.log('❌ PINTEREST_ACCESS_TOKEN not found in environment variables');
          return;
        }
        
        await testAccessToken(token);
        break;
        
      default:
        showUsage();
        break;
    }
    
  } catch (error) {
    console.error('❌ Script execution failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Unhandled error:', error instanceof Error ? error.message : error);
  process.exit(1);
}); 