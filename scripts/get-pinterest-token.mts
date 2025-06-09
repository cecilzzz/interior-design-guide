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
 * Get Pinterest API base URL
 */
function getApiBaseUrl(): string {
  const useSandbox = process.env.PINTEREST_USE_SANDBOX === 'true';
  return useSandbox ? 'https://api-sandbox.pinterest.com/v5' : 'https://api.pinterest.com/v5';
}

/**
 * Show instructions on how to get Pinterest Access Token
 */
function showInstructions() {
  console.log('\n' + '='.repeat(80));
  console.log('How to get Pinterest Access Token');
  console.log('='.repeat(80));
  
  const apiUrl = getApiBaseUrl();
  console.log(`\n🌐 Current API environment: ${apiUrl}`);
  console.log(`📦 Sandbox mode: ${process.env.PINTEREST_USE_SANDBOX === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
  
  console.log('\n📋 Method 1: Through Developer Console (Simple)');
  console.log('1. Visit https://developers.pinterest.com/console/');
  console.log('2. Select your application');
  console.log('3. Click "OAuth" in the left menu');
  console.log('4. Find the "Generate access token" button');
  if (process.env.PINTEREST_USE_SANDBOX === 'true') {
    console.log('5. ⚠️  Make sure to generate a Sandbox Access Token');
  }
  console.log('5. Copy the generated Access Token');
  
  console.log('\n📋 Method 2: Manual OAuth Flow');
  console.log('1. Prepare your app information:');
  console.log('   - Client ID (App ID)');
  console.log('   - Client Secret');
  console.log('   - Redirect URI');
  
  console.log('\n🔗 OAuth authorization URL format:');
  console.log('https://www.pinterest.com/oauth/authorize?' +
    'client_id=YOUR_CLIENT_ID&' +
    'redirect_uri=YOUR_REDIRECT_URI&' +
    'response_type=code&' +
    'scope=boards:read,pins:read,pins:write');
    
  console.log('\n⚙️  Current environment variables check:');
  console.log('PINTEREST_ACCESS_TOKEN:', process.env.PINTEREST_ACCESS_TOKEN ? 
    `${process.env.PINTEREST_ACCESS_TOKEN.substring(0, 10)}...` : '❌ Not set');
  console.log('PINTEREST_USE_SANDBOX:', process.env.PINTEREST_USE_SANDBOX || '❌ Not set (default: false)');
    
  console.log('\n📝 Valid Access Token format:');
  console.log('- Usually 40-60 characters long');
  console.log('- May start with "pina_"');
  console.log('- Contains letters, numbers and special characters');
  
  console.log('\n🔧 Setup method:');
  console.log('Add to .env.local file:');
  console.log('PINTEREST_ACCESS_TOKEN=your_actual_access_token_here');
  if (process.env.PINTEREST_USE_SANDBOX === 'true') {
    console.log('PINTEREST_USE_SANDBOX=true  # Use Sandbox environment');
  }
}

/**
 * Generate OAuth authorization URL
 */
function generateOAuthUrl(clientId: string, redirectUri: string) {
  const scopes = [
    'boards:read',
    'boards:write', 
    'pins:read',
    'pins:write'
  ];
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state: 'random_state_string' // Should be a random string
  });
  
  return `https://www.pinterest.com/oauth/authorize?${params.toString()}`;
}

/**
 * Validate Access Token format
 */
function validateAccessToken(token: string): boolean {
  // Basic format check
  if (!token || token.length < 20) {
    return false;
  }
  
  // Check for invalid characters
  if (token.includes(' ') || token.includes('\n')) {
    return false;
  }
  
  return true;
}

/**
 * Test if Access Token is valid
 */
async function testAccessToken(token: string): Promise<boolean> {
  try {
    console.log('\n🧪 Testing Access Token...');
    
    const apiUrl = getApiBaseUrl();
    console.log(`🌐 Using API: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/user_account`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Access Token is valid!');
      console.log('User info:', {
        username: data.username,
        account_type: data.account_type
      });
      
      if (process.env.PINTEREST_USE_SANDBOX === 'true') {
        console.log('📦 Note: Currently using Sandbox environment, created pins will not be publicly visible');
      }
      
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Access Token is invalid');
      console.log('Error:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Test failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function main() {
  try {
    const [,, command, ...args] = process.argv;
    
    switch (command) {
      case 'test':
        if (!process.env.PINTEREST_ACCESS_TOKEN) {
          console.log('❌ PINTEREST_ACCESS_TOKEN environment variable not found');
          showInstructions();
          return;
        }
        
        if (!validateAccessToken(process.env.PINTEREST_ACCESS_TOKEN)) {
          console.log('❌ Access Token format is incorrect');
          showInstructions();
          return;
        }
        
        await testAccessToken(process.env.PINTEREST_ACCESS_TOKEN);
        break;
        
      case 'oauth':
        const clientId = args[0];
        const redirectUri = args[1] || 'https://localhost:3000/callback';
        
        if (!clientId) {
          console.log('❌ Please provide Client ID');
          console.log('Usage: npm run get-token oauth YOUR_CLIENT_ID [REDIRECT_URI]');
          return;
        }
        
        const oauthUrl = generateOAuthUrl(clientId, redirectUri);
        console.log('\n🔗 Please visit the following URL for authorization:');
        console.log(oauthUrl);
        console.log('\n📝 After authorization, copy the "code" parameter from the callback URL');
        break;
        
      default:
        console.log('\nUsage:');
        console.log('  npm run get-token test          - Test current Access Token');
        console.log('  npm run get-token oauth CLIENT_ID [REDIRECT_URI] - Generate OAuth URL');
        console.log('  npm run get-token               - Show detailed instructions');
        
        showInstructions();
        break;
    }
  } catch (error) {
    console.error('Script execution failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : error);
  process.exit(1);
}); 