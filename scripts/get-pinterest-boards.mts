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

interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  pin_count: number;
  privacy: string;
}

interface PinterestBoardsResponse {
  items: PinterestBoard[];
  bookmark?: string;
}

/**
 * Get user's Pinterest Boards
 */
async function getPinterestBoards(): Promise<PinterestBoard[]> {
  if (!process.env.PINTEREST_ACCESS_TOKEN) {
    throw new Error('Missing Pinterest API Token (PINTEREST_ACCESS_TOKEN)');
  }

  const apiUrl = getApiBaseUrl();
  console.log(`🌐 Using API: ${apiUrl}`);
  console.log(`📦 Sandbox mode: ${process.env.PINTEREST_USE_SANDBOX === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
  console.log('Access Token first 10 chars:', process.env.PINTEREST_ACCESS_TOKEN.substring(0, 10) + '...');

  const allBoards: PinterestBoard[] = [];
  let bookmark: string | undefined;
  let pageCount = 0;

  do {
    const url = new URL(`${apiUrl}/boards`);
    url.searchParams.set('page_size', '25'); // Max 25 per page
    
    if (bookmark) {
      url.searchParams.set('bookmark', bookmark);
    }

    console.log(`Fetching page ${pageCount + 1} of Boards...`);
    console.log('Request URL:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response content:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          throw new Error(`Pinterest API error: ${error.message || response.statusText}`);
        } catch (parseError) {
          throw new Error(`Pinterest API error (${response.status}): ${errorText}`);
        }
      }

      const data: PinterestBoardsResponse = await response.json();
      console.log(`Retrieved ${data.items.length} Boards`);
      allBoards.push(...data.items);
      
      bookmark = data.bookmark;
      pageCount++;

      // Avoid infinite loop
      if (pageCount > 10) {
        console.log('⚠️  Retrieved 10 pages, stopping to avoid too many requests');
        break;
      }

    } catch (fetchError) {
      console.error('Network request error details:', fetchError);
      
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch failed')) {
        throw new Error('Network connection failed, please check:\n' +
          '1. Network connection is working\n' +
          '2. Proxy settings if needed\n' +
          '3. Firewall is not blocking Pinterest API\n' +
          '4. DNS resolution is working');
      }
      
      throw fetchError;
    }

  } while (bookmark);

  return allBoards;
}

/**
 * Format and display Board information
 */
function displayBoards(boards: PinterestBoard[]) {
  console.log('\n' + '='.repeat(80));
  console.log('Your Pinterest Boards:');
  console.log('='.repeat(80));

  if (boards.length === 0) {
    console.log('No Boards found');
    return;
  }

  boards.forEach((board, index) => {
    console.log(`\n${index + 1}. ${board.name}`);
    console.log(`   Board ID: ${board.id}`);
    console.log(`   Description: ${board.description || 'No description'}`);
    console.log(`   Pin count: ${board.pin_count}`);
    console.log(`   Privacy: ${board.privacy === 'PUBLIC' ? 'Public' : 'Private'}`);
    console.log(`   Usage: npm run pinterest-publish <MDX file> ${board.id}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`Total found: ${boards.length} Boards`);
}

/**
 * Search for Boards by name
 */
function searchBoards(boards: PinterestBoard[], searchTerm: string): PinterestBoard[] {
  const term = searchTerm.toLowerCase();
  return boards.filter(board => 
    board.name.toLowerCase().includes(term) ||
    (board.description && board.description.toLowerCase().includes(term))
  );
}

async function main() {
  try {
    // Check for search parameter
    const [,, searchTerm] = process.argv;

    console.log('Fetching your Pinterest Boards...');
    
    const boards = await getPinterestBoards();
    
    if (searchTerm) {
      console.log(`\nSearch term: "${searchTerm}"`);
      const filteredBoards = searchBoards(boards, searchTerm);
      
      if (filteredBoards.length === 0) {
        console.log(`No Boards found containing "${searchTerm}"`);
        console.log('\nAll available Boards:');
        displayBoards(boards);
      } else {
        displayBoards(filteredBoards);
      }
    } else {
      displayBoards(boards);
    }

    console.log('\n💡 Usage tips:');
    console.log('   - Search specific Board: npm run get-boards "search keyword"');
    console.log('   - Copy the Board ID above to publish Pins');
    console.log('   - Example: npm run pinterest-publish content/posts/article.mdx 123456789');

  } catch (error) {
    console.error('Failed to get Boards:', error instanceof Error ? error.message : error);
    
    if (error instanceof Error && error.message.includes('Pinterest API error')) {
      console.log('\n🔧 Possible solutions:');
      console.log('   1. Check if Pinterest Access Token is correct');
      console.log('   2. Confirm API permissions include boards:read');
      console.log('   3. Confirm upgrade to Standard access permissions');
    }
    
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : error);
  process.exit(1);
}); 