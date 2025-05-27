# Scripts 目錄說明

這個目錄包含了專案的 Node.js 工具腳本，主要用於圖片處理和 SEO 優化。

## 🎯 主要功能

- **圖片批量上傳到 Cloudinary**：`npm run upload-images`
- **圖片上傳測試**：`npm run upload-images:test`
- **生成圖片 sitemap**：`npm run generate-image-sitemap`

## 🤔 為什麼需要複雜的 Node.js 設定？

### 三層技術挑戰

我們遇到的是三個獨立技術層面的相容性問題：

1. **語言層面**：TypeScript vs JavaScript
2. **模組系統層面**：ES Module vs CommonJS  
3. **執行環境層面**：Node.js 原生支援

#### 問題 1：Node.js + TypeScript
```bash
node script.ts  # ❌ Node.js: "我不認識 .ts 檔案"
```

#### 問題 2：Node.js + ES Module
```bash
node script.js  # ❌ Node.js: "Unexpected token 'import'"
# 因為 Node.js 預設期望 CommonJS 語法
```

#### 問題 3：TypeScript + ES Module + Node.js
```bash
node script.ts  # ❌ 三重錯誤！
```

### 為什麼必須用 ES Module？

因為我們需要重用 Next.js 專案的模組：

```typescript
// ✅ 可以重用 Next.js 的工具
import { getImageUrl } from '../app/utils/imageUtils.ts';
import type { ImageData } from '../app/types/image.ts';

// ❌ 如果用 CommonJS 就無法重用
const { getImageUrl } = require('../app/utils/imageUtils.ts'); // 失敗！
```

## 🔧 解決方案架構

### 檔案結構
```
scripts/
├── README.md                    # 本檔案
├── package.json                 # ES Module 配置
├── register.mjs                 # TypeScript 載入器註冊
├── tsconfig.json               # TypeScript 配置
├── generate-image-sitemap.js   # 圖片 sitemap 生成腳本
└── image-processor/            # 圖片處理腳本群
    ├── index.mts               # 主執行檔案
    ├── cloudinaryUploader.mts  # Cloudinary 上傳邏輯
    ├── imageCollector.mts      # MDX 圖片解析器
    └── pinterestPublisher.mts  # Pinterest 發布功能
```

### 關鍵配置檔案

#### `package.json`
```json
{
  "type": "module",
  "private": true
}
```
- **作用**：告訴 Node.js 這個目錄使用 ES Module 格式
- **效果**：可以使用 `import/export` 語法

#### `register.mjs`
```javascript
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));
```
- **作用**：註冊 TypeScript 載入器
- **效果**：Node.js 可以直接執行 `.ts` 和 `.mts` 檔案
- **關鍵**：使用 `ts-node/esm` 支援 ES Module 格式的 TypeScript

#### `tsconfig.json`
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  },
  "ts-node": {
    "esm": true
  }
}
```
- **作用**：配置 TypeScript 編譯選項
- **重點**：啟用 ES Module 支援

## 🚀 執行流程解析

### 執行命令格式
```bash
node --import ./scripts/register.mjs [腳本路徑]
```

### 執行步驟
1. **Node.js 啟動**
2. **載入 `register.mjs`**：註冊 TypeScript + ES Module 支援
3. **執行目標腳本**：現在可以處理 TypeScript + ES Module 語法

### 實際範例
```bash
# 圖片上傳
node --import ./scripts/register.mjs scripts/image-processor/index.mts

# 圖片 sitemap 生成
node --import ./scripts/register.mjs scripts/generate-image-sitemap.js
```

## 📁 腳本功能詳解

### 圖片處理腳本群 (`image-processor/`)

#### `index.mts` - 主執行檔案
- 協調整個圖片處理流程
- 讀取 MDX 檔案，解析圖片資訊
- 批量上傳到 Cloudinary

#### `imageCollector.mts` - MDX 圖片解析器
- 解析 MDX 檔案中的 `<MDXImage>` 組件
- 提取圖片的 SEO 資訊、Pinterest 資訊等
- 使用 `@mdx-js/mdx` 進行語法樹分析

#### `cloudinaryUploader.mts` - Cloudinary 上傳邏輯
- 處理圖片上傳到 Cloudinary
- 管理上傳配置和錯誤處理

#### `pinterestPublisher.mts` - Pinterest 發布功能
- 處理 Pinterest 相關的發布邏輯

### 圖片 Sitemap 生成腳本 (`generate-image-sitemap.js`)

#### 功能
1. 讀取所有文章資料（從 Contentlayer 生成的 JSON）
2. 重用 `imageCollector.mts` 解析每篇文章的圖片
3. 重用 `app/utils/imageUtils.ts` 生成正確的 Cloudinary URL
4. 生成符合 Google 標準的圖片 sitemap XML
5. 輸出到 `public/image-sitemap.xml`

#### 重用策略
```javascript
// 動態導入原有的圖片解析器
async function importImageCollector() {
  const { getCollectedImages } = await import('./image-processor/imageCollector.mts');
  return { getCollectedImages };
}

// 動態導入 Next.js 的圖片工具
async function importImageUtils() {
  const { getImageUrl } = await import('../app/utils/imageUtils.ts');
  return { getImageUrl };
}
```

## 🔄 模組重用架構

### 為什麼使用動態導入？
```javascript
// ❌ 靜態導入可能有路徑問題
import { getCollectedImages } from './image-processor/imageCollector.mts';

// ✅ 動態導入在運行時解析
const { getCollectedImages } = await import('./image-processor/imageCollector.mts');
```

### 重用的模組
- **`imageCollector.mts`**：MDX 圖片解析邏輯
- **`app/utils/imageUtils.ts`**：Cloudinary URL 生成工具
- **Contentlayer 資料**：文章和圖片資訊

## 🐛 常見問題排除

### 模組找不到
```bash
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```
**解決**：檢查檔案路徑和副檔名是否正確

### 語法錯誤
```bash
SyntaxError: Unexpected token 'import'
```
**解決**：確保 `package.json` 包含 `"type": "module"`

### TypeScript 錯誤
```bash
Unknown file extension ".ts"
```
**解決**：確保 `register.mjs` 正確載入

### Contentlayer 語法問題
```bash
SyntaxError: Unexpected identifier 'assert'
```
**解決**：使用 JSON 檔案讀取而非直接導入
```javascript
// ✅ 直接讀取 JSON
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// ❌ 避免使用 ES Module 導入
import { allArticles } from '../.contentlayer/generated/index.mjs';
```

## 🎯 設計理念

### 一套環境，多種用途
這個 Node.js 環境就像一個萬能轉接頭：
- 原本為圖片上傳腳本建立
- 現在服務多個不同的工具腳本
- 所有腳本都能重用 Next.js 專案的模組和工具

### 避免重複造輪子
- 重用現有的圖片處理邏輯
- 重用現有的 Cloudinary 配置
- 重用現有的 TypeScript 型別定義
- 保持與 Next.js 專案的一致性

## 📝 新增腳本指南

如果要新增腳本，請遵循以下模式：

1. **使用 ES Module 語法**
```javascript
import fs from 'fs';
export function myFunction() { ... }
```

2. **動態導入其他模組**
```javascript
async function importSomething() {
  const { tool } = await import('../app/utils/tool.ts');
  return { tool };
}
```

3. **在 package.json 中新增執行命令**
```json
{
  "scripts": {
    "my-script": "node --import ./scripts/register.mjs scripts/my-script.js"
  }
}
```

4. **處理錯誤和日誌**
```javascript
try {
  // 腳本邏輯
  console.log('處理完成');
} catch (error) {
  console.error('發生錯誤:', error);
  process.exit(1);
}
```

這樣就能確保新腳本與現有環境完全相容！ 