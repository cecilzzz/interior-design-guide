# Interior Design Guide

## 項目概述

### 目標
Interior Design Guide 是一個現代化的室內設計資訊平台，致力於通過精心策劃的視覺語言探索空間設計的微妙敘事。

### 核心特性
- 響應式設計
- 結構化文章展示
- SEO 優化
- 結構化數據支持
- 靜態站點生成
- MDX 內容管理

## 技術棧

### 主要技術框架
- **框架**: Next.js 13.5.8
- **語言**: TypeScript 5.2.2
- **樣式**: Tailwind CSS 3.3.6
- **內容管理**: Contentlayer 0.3.4
- **部署**: Vercel

### 前端技術
- **React**: 18.2.0
- **MDX**: 2.3.0
- **Headless UI**: 1.7.17
- **Hero Icons**: 2.0.18

### 內容處理
- **Gray Matter**: 4.0.3
- **Remark**: 15.0.1
- **Next MDX Remote**: 5.0.0

### 日期和工具庫
- **Date-fns**: 4.1.0
- **Cloudinary**: 2.5.1

### SEO 和性能工具
- **Next Sitemap**: 4.2.3
- **Serve**: 14.2.4

### 開發工具
- **ESLint**: 8.56.0
- **PostCSS**: 8.4.32
- **TypeScript**: 5.2.2

### 圖標和 UI 組件
- **React Icons**: 4.12.0

### 樣式擴展
- **Tailwind Typography**: 0.5.10

## 項目架構

```
interior-design-guide/
│
├── app/                  # 主應用目錄
│   ├── [slug]/           # 動態文章路由
│   ├── category/         # 分類頁面
│   ├── components/       # 可重用組件
│   ├── about/            # 關於頁面
│   └── page.tsx          # 首頁
│
├── content/              # 內容文件
│   └── posts/            # 文章 MDX 文件
├── public/               # 靜態資源
├── scripts/              # 腳本工具
└── types/                # TypeScript 類型定義
```

## 開發環境設置

### 先決條件
- Node.js 18+
- npm / yarn

### 安裝步驟
1. 克隆倉庫
2. 安裝依賴：`npm install`
3. 運行開發服務器：`npm run dev`

## 部署

### Vercel 部署
1. 連接 GitHub 倉庫
2. 配置環境變量
3. 自動部署

## SEO 策略

### 結構化數據
- 使用 Schema.org 標記
- 支持文章、分類和作者頁面的結構化數據
- 麵包屑導航結構化
- 使用 Next Sitemap 生成站點地圖

### 元數據優化
- 動態生成頁面標題和描述
- OpenGraph 標記支持
- Twitter Card 支持

## 性能優化

### 靜態生成
- 使用 Next.js 靜態生成
- 預渲染所有文章和分類頁面
- MDX 內容預編譯

### 圖片優化
- 使用 Next.js Image 組件
- Cloudinary 圖片管理
- 自動圖片壓縮和格式轉換

## 未來roadmap
- 增加搜索功能
- 多語言支持
- 互動設計元素
- 擴展內容管理功能

## 貢獻指南
1. Fork 倉庫
2. 創建功能分支
3. 提交代碼
4. 創建 Pull Request

## 許可證
MIT License 

## 關鍵技術結構與設計模式

### 內容管理架構
#### Contentlayer 集成
- **文檔轉換**：將 MDX 文件自動轉換為型別安全的 TypeScript 對象
- **靜態預編譯**：在構建時將內容編譯為 JSON，提高運行時性能
- **類型安全**：自動生成 TypeScript 類型，確保內容結構一致性

#### 內容模型示例
```typescript
interface Article {
  title: string
  date: string
  categories: string[]
  slug: string
  coverImageUrl: string
  excerpt: string
}
```

### 路由與頁面生成策略
#### Next.js App Router
- **動態路由**：`/[slug]` 和 `category/[category]`
- **靜態生成**：使用 `generateStaticParams()` 預渲染所有可能的路由
- **服務端組件**：最大化性能和 SEO 優化

### 結構化數據設計
#### Schema.org 實現
- **多場景支持**：文章、分類、作者頁面
- **動態生成**：根據當前頁面上下文自動調整 Schema
- **SEO 優化**：提供豐富的語義信息給搜索引擎

### 狀態管理與數據流
#### 無狀態設計
- **服務端渲染**：主要邏輯在服務端完成
- **函數式組件**：使用純函數和不可變數據
- **最小化客戶端狀態**：減少複雜性，提高性能

### 樣式與響應式設計
#### Tailwind CSS 策略
- **原子類設計**：細粒度的樣式控制
- **響應式斷點**：`sm:`、`md:`、`lg:` 前綴實現斷面適配
- **主題可配置性**：通過 `tailwind.config.ts` 客製化設計系統

### 圖片與資源處理
#### 優化策略
- **Next.js Image 組件**：自動圖片優化
- **Cloudinary 集成**：雲端圖片管理
- **懶加載**：僅加載可視區域圖片

### 內容預處理
#### MDX 與 Remark 生態
- **豐富的內容格式**：支持 Markdown 和 JSX 混合
- **插件生態**：使用 Remark 插件進行內容轉換
- **語法高亮**：支持代碼塊增強

### 性能監控與優化
#### 靜態站點生成
- **增量靜態再生**：ISR 策略
- **預渲染**：構建時生成靜態頁面
- **邊緣緩存**：Vercel 全球 CDN 分發

## 安全與最佳實踐
- **環境變量管理**：使用 `.env.local` 
- **類型安全**：嚴格的 TypeScript 配置
- **代碼風格**：ESLint 統一規範
- **依賴安全**：定期更新依賴 

## 常用命令指南

### 開發相關
```bash
# 啟動開發服務器
npm run dev

# 建置專案
npm run build

# 本地預覽生產版本
npm run start

# 運行程式碼檢查
npm run lint

# 上傳圖片（如果有圖片處理腳本）
npm run upload-images
```

### 內容管理
```bash
# 如果使用 Contentlayer
npx contentlayer build

# 清理 Contentlayer 緩存
npx contentlayer clean
```

## 故障排除與常見問題

### 環境問題
1. **Node.js 版本不相容**
   - 確保使用 Node.js 18+ 版本
   - 建議使用 `nvm` 管理 Node.js 版本

2. **依賴安裝失敗**
   - 刪除 `node_modules` 資料夾
   - 清除 npm 快取：`npm cache clean --force`
   - 重新安裝：`npm install`

### 開發常見問題
1. **TypeScript 型別錯誤**
   - 運行 `npm run lint` 檢查
   - 檢查 `tsconfig.json` 配置

2. **Contentlayer 內容未更新**
   - 運行 `npx contentlayer build`
   - 重新啟動開發服務器

3. **環境變數未生效**
   - 檢查 `.env.local` 文件
   - 確保變數名稱正確
   - 重啟開發服務器

### 性能優化建議
- 定期運行 `npm run build` 檢查建置
- 使用 Vercel 分析工具監控性能
- 關注 Lighthouse 報告

## 開發最佳實踐
- 遵循 TypeScript 嚴格模式
- 使用 ESLint 和 Prettier 保持代碼風格一致
- 編寫單元測試覆蓋關鍵邏輯
- 提交代碼前運行 `npm run lint`

## 貢獻指南補充
- 遵循 GitHub Flow
- 每個 PR 應有清晰的描述
- 包含相關的測試用例
- 更新文檔（如有必要） 