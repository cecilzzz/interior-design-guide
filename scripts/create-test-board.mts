#!/usr/bin/env node

// 代理設置 - 必須在其他導入之前
import './proxy-setup.mts';

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// 獲取專案根目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 載入環境變數
config({ path: resolve(projectRoot, '.env.local') });

/**
 * 獲取 Pinterest API 基礎 URL
 */
function getApiBaseUrl(): string {
  const useSandbox = process.env.PINTEREST_USE_SANDBOX === 'true';
  return useSandbox ? 'https://api-sandbox.pinterest.com/v5' : 'https://api.pinterest.com/v5';
}

/**
 * 創建測試 Board
 */
async function createTestBoard(name: string, description?: string): Promise<{ id: string; name: string }> {
  if (!process.env.PINTEREST_ACCESS_TOKEN) {
    throw new Error('缺少 Pinterest API Token (PINTEREST_ACCESS_TOKEN)');
  }

  const apiUrl = getApiBaseUrl();
  
  const boardData = {
    name: name,
    description: description || `測試 Board - ${new Date().toLocaleString()}`,
    privacy: 'PUBLIC'
  };

  console.log(`🌐 使用 API: ${apiUrl}`);
  console.log(`📦 Sandbox 模式: ${process.env.PINTEREST_USE_SANDBOX === 'true' ? '✅ 開啟' : '❌ 關閉'}`);
  console.log('正在創建 Board:', boardData);

  const response = await fetch(`${apiUrl}/boards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(boardData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log('錯誤回應:', response.status, errorText);
    
    try {
      const error = JSON.parse(errorText);
      throw new Error(`Pinterest API 錯誤: ${error.message || response.statusText}`);
    } catch (parseError) {
      throw new Error(`Pinterest API 錯誤 (${response.status}): ${errorText}`);
    }
  }

  const result = await response.json();
  console.log('✅ Board 創建成功!');
  console.log('Board ID:', result.id);
  console.log('Board 名稱:', result.name);
  
  return result;
}

function showUsage() {
  console.log(`
使用方法:
  npm run create-test-board [Board名稱] [描述]

範例:
  npm run create-test-board "測試看板"
  npm run create-test-board "Interior Design Test" "用於測試室內設計釘圖的看板"

參數:
  Board名稱     - Board 的名稱（可選，預設: "測試看板"）
  描述         - Board 的描述（可選）

環境變數要求:
  PINTEREST_ACCESS_TOKEN    - Pinterest API 訪問令牌
  PINTEREST_USE_SANDBOX     - 是否使用 Sandbox 環境
  `);
}

async function main() {
  try {
    const [,, boardName, description] = process.argv;
    
    if (boardName === '--help' || boardName === '-h') {
      showUsage();
      return;
    }

    // 驗證必要的環境變數
    if (!process.env.PINTEREST_ACCESS_TOKEN) {
      throw new Error('缺少 PINTEREST_ACCESS_TOKEN 環境變數');
    }

    const name = boardName || `測試看板 ${new Date().toLocaleDateString()}`;
    const desc = description;

    console.log('開始創建測試 Board...');
    
    const board = await createTestBoard(name, desc);
    
    console.log('\n創建完成！');
    console.log('='.repeat(50));
    console.log(`Board ID: ${board.id}`);
    console.log(`Board 名稱: ${board.name}`);
    
    if (process.env.PINTEREST_USE_SANDBOX === 'true') {
      console.log('\n📦 注意: 這是 Sandbox 環境中的測試 Board');
      console.log('    在正式環境中不會顯示');
    }
    
    console.log('\n💡 使用提示:');
    console.log(`    現在可以用這個 Board ID 來測試釘圖發布:`);
    console.log(`    npm run pinterest-publish <MDX文件> ${board.id}`);

  } catch (error) {
    console.error('創建 Board 失敗:', error instanceof Error ? error.message : error);
    
    if (error instanceof Error && error.message.includes('Pinterest API 錯誤')) {
      console.log('\n🔧 可能的解決方案:');
      console.log('   1. 檢查 Pinterest Access Token 是否正確');
      console.log('   2. 確認 API 權限是否包含 boards:write');
      console.log('   3. 確認是否在正確的環境中（Sandbox/Production）');
    }
    
    process.exit(1);
  }
}

// 確保 main 函數的錯誤被正確處理
main().catch(error => {
  console.error('未處理的錯誤:', error instanceof Error ? error.message : error);
  process.exit(1);
}); 