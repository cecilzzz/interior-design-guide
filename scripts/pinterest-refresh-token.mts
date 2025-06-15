#!/usr/bin/env node

// Proxy setup - must be imported before other modules
import './proxy-setup.mts';

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readFileSync } from 'fs';

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Load environment variables
config({ path: resolve(projectRoot, '.env.local') });

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing PINTEREST_CLIENT_ID or PINTEREST_CLIENT_SECRET environment variables');
  }

  console.log('🔄 Refreshing access token...');
  
  // Create Basic Auth header
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Token refresh failed:', response.status, errorText);
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();
  console.log('✅ Successfully refreshed access token!');
  
  return tokenData;
}

/**
 * Update .env.local file with new tokens
 */
function updateEnvFile(accessToken: string, refreshToken: string): void {
  const envPath = resolve(projectRoot, '.env.local');
  
  try {
    let envContent = readFileSync(envPath, 'utf8');
    
    // Update access token
    if (envContent.includes('PINTEREST_ACCESS_TOKEN=')) {
      envContent = envContent.replace(
        /PINTEREST_ACCESS_TOKEN=.*/,
        `PINTEREST_ACCESS_TOKEN=${accessToken}`
      );
    } else {
      envContent += `\nPINTEREST_ACCESS_TOKEN=${accessToken}`;
    }
    
    // Update refresh token
    if (envContent.includes('PINTEREST_REFRESH_TOKEN=')) {
      envContent = envContent.replace(
        /PINTEREST_REFRESH_TOKEN=.*/,
        `PINTEREST_REFRESH_TOKEN=${refreshToken}`
      );
    } else {
      envContent += `\nPINTEREST_REFRESH_TOKEN=${refreshToken}`;
    }
    
    writeFileSync(envPath, envContent);
    console.log('✅ Updated .env.local file with new tokens');
    
  } catch (error) {
    console.error('❌ Failed to update .env.local file:', error);
    throw error;
  }
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
 * Check if token needs refresh (expires within 1 hour)
 */
function shouldRefreshToken(): boolean {
  const tokenTimestamp = process.env.PINTEREST_TOKEN_TIMESTAMP;
  const expiresIn = process.env.PINTEREST_TOKEN_EXPIRES_IN;
  
  if (!tokenTimestamp || !expiresIn) {
    console.log('⚠️ Token timestamp or expiry info missing, refreshing as precaution');
    return true;
  }
  
  const tokenAge = Date.now() - parseInt(tokenTimestamp);
  const expiryTime = parseInt(expiresIn) * 1000; // Convert to milliseconds
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  
  return (tokenAge + oneHour) >= expiryTime;
}

/**
 * Update token timestamp in env file
 */
function updateTokenTimestamp(expiresIn: number): void {
  const envPath = resolve(projectRoot, '.env.local');
  
  try {
    let envContent = readFileSync(envPath, 'utf8');
    const timestamp = Date.now().toString();
    
    // Update timestamp
    if (envContent.includes('PINTEREST_TOKEN_TIMESTAMP=')) {
      envContent = envContent.replace(
        /PINTEREST_TOKEN_TIMESTAMP=.*/,
        `PINTEREST_TOKEN_TIMESTAMP=${timestamp}`
      );
    } else {
      envContent += `\nPINTEREST_TOKEN_TIMESTAMP=${timestamp}`;
    }
    
    // Update expires_in
    if (envContent.includes('PINTEREST_TOKEN_EXPIRES_IN=')) {
      envContent = envContent.replace(
        /PINTEREST_TOKEN_EXPIRES_IN=.*/,
        `PINTEREST_TOKEN_EXPIRES_IN=${expiresIn}`
      );
    } else {
      envContent += `\nPINTEREST_TOKEN_EXPIRES_IN=${expiresIn}`;
    }
    
    writeFileSync(envPath, envContent);
    
  } catch (error) {
    console.error('❌ Failed to update token timestamp:', error);
  }
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log(`
Pinterest Refresh Token Manager - 2025 Continuous Refresh Token Support
${'='.repeat(70)}

Commands:
  npm run refresh-token                    # Auto-refresh if needed
  npm run refresh-token force             # Force refresh token
  npm run refresh-token test              # Test current token
  npm run refresh-token status            # Check token status

Environment Variables Required (.env.local):
  PINTEREST_CLIENT_ID=your_client_id_here
  PINTEREST_CLIENT_SECRET=your_client_secret_here
  PINTEREST_REFRESH_TOKEN=your_refresh_token_here
  PINTEREST_ACCESS_TOKEN=your_access_token_here

Auto-generated (for tracking):
  PINTEREST_TOKEN_TIMESTAMP=timestamp_when_token_was_created
  PINTEREST_TOKEN_EXPIRES_IN=token_expiry_seconds

Note: This script implements Pinterest's new Continuous Refresh Token system
required from June 25, 2025. Legacy access tokens will be deprecated.
`);
}

async function main() {
  try {
    const [,, command] = process.argv;
    
    switch (command) {
      case 'force':
        const refreshToken = process.env.PINTEREST_REFRESH_TOKEN;
        if (!refreshToken) {
          console.log('❌ PINTEREST_REFRESH_TOKEN not found in environment variables');
          console.log('Please run the OAuth flow first to get a refresh token');
          return;
        }
        
        const tokenData = await refreshAccessToken(refreshToken);
        updateEnvFile(tokenData.access_token, tokenData.refresh_token);
        updateTokenTimestamp(tokenData.expires_in);
        
        console.log('\n🎉 Token refresh completed!');
        console.log('New Access Token expires in:', tokenData.expires_in, 'seconds');
        
        // Test the new token
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
        
      case 'status':
        const currentToken = process.env.PINTEREST_ACCESS_TOKEN;
        const currentRefreshToken = process.env.PINTEREST_REFRESH_TOKEN;
        const timestamp = process.env.PINTEREST_TOKEN_TIMESTAMP;
        const expiresIn = process.env.PINTEREST_TOKEN_EXPIRES_IN;
        
        console.log('\n📊 Token Status:');
        console.log('Access Token:', currentToken ? '✅ Present' : '❌ Missing');
        console.log('Refresh Token:', currentRefreshToken ? '✅ Present' : '❌ Missing');
        
        if (timestamp && expiresIn) {
          const tokenAge = Date.now() - parseInt(timestamp);
          const expiryTime = parseInt(expiresIn) * 1000;
          const remainingTime = expiryTime - tokenAge;
          
          console.log('Token Age:', Math.floor(tokenAge / 1000 / 60), 'minutes');
          console.log('Remaining Time:', Math.floor(remainingTime / 1000 / 60), 'minutes');
          console.log('Needs Refresh:', shouldRefreshToken() ? '⚠️ Yes' : '✅ No');
        } else {
          console.log('Token Timing:', '⚠️ Unknown (missing timestamp data)');
        }
        break;
        
      default:
        // Auto-refresh mode
        const autoRefreshToken = process.env.PINTEREST_REFRESH_TOKEN;
        if (!autoRefreshToken) {
          console.log('❌ PINTEREST_REFRESH_TOKEN not found');
          console.log('Please run the OAuth flow first to get a refresh token');
          showUsage();
          return;
        }
        
        if (shouldRefreshToken()) {
          console.log('🔄 Token needs refresh, refreshing automatically...');
          const newTokenData = await refreshAccessToken(autoRefreshToken);
          updateEnvFile(newTokenData.access_token, newTokenData.refresh_token);
          updateTokenTimestamp(newTokenData.expires_in);
          
          console.log('✅ Token automatically refreshed!');
          await testAccessToken(newTokenData.access_token);
        } else {
          console.log('✅ Token is still valid, no refresh needed');
          const currentAccessToken = process.env.PINTEREST_ACCESS_TOKEN;
          if (currentAccessToken) {
            await testAccessToken(currentAccessToken);
          }
        }
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