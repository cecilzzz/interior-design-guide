 # 開發知識文檔

## 📚 目錄

- [📱 像素系統深度指南](#-像素系統深度指南)

## 📱 像素系統深度指南

### 🎯 核心概念：像素的雙重身份

現代設備中存在兩種截然不同的像素概念：

#### **物理像素 (Physical/Device Pixels)**
- **定義**：螢幕上真實的發光點 (LED/OLED 燈珠)
- **特性**：硬體固定，無法改變
- **用途**：決定螢幕的實際解析度和清晰度

#### **邏輯像素 (Logical/CSS Pixels)**
- **定義**：軟體抽象單位，用於保持跨設備的視覺一致性
- **特性**：由作業系統和瀏覽器管理
- **用途**：開發者進行佈局設計的基準單位

### 📏 像素單位完整體系

#### 絕對長度單位
| 單位 | 全名 | 定義 | 現代用途 |
|------|------|------|----------|
| `px` | Pixel | 1/96 英寸 | 網頁設計主單位 |
| `pt` | Point | 1/72 英寸 | 印刷、字體 |
| `pc` | Pica | 12 點 = 1/6 英寸 | 印刷排版 |
| `in` | Inch | 1 英寸 | 印刷媒體 |
| `cm` | Centimeter | 1 公分 | 國際印刷 |
| `mm` | Millimeter | 1 公釐 | 精密印刷 |

#### 相對長度單位
| 單位 | 相對於 | 用途 | 響應式特性 |
|------|--------|------|------------|
| `em` | 父元素字體大小 | 組件內部間距 | ✅ 高度響應 |
| `rem` | 根元素字體大小 | 全域一致性 | ✅ 高度響應 |
| `%` | 父容器 | 佈局比例 | ✅ 高度響應 |
| `vw` | 視窗寬度 | 全屏佈局 | ✅ 高度響應 |
| `vh` | 視窗高度 | 全屏佈局 | ✅ 高度響應 |

### 🔤 技術縮寫詞典

#### 顯示相關
| 縮寫 | 英文全稱 | 中文翻譯 | 定義 |
|------|----------|----------|------|
| **PPI** | Pixels Per Inch | 每英寸像素密度 | 物理螢幕密度指標 |
| **DPI** | Dots Per Inch | 每英寸點數 | 原指印刷密度，現常與PPI混用 |
| **DPR** | Device Pixel Ratio | 設備像素比 | 物理像素與邏輯像素的比值 |


### 🔗 DPI 與 DPR 的關係

#### 數學關係
```
邏輯DPI = 物理DPI ÷ DPR
```

#### 實際計算範例 - iPhone 14 Pro
```typescript
// 已知數據
const physicalResolution = { width: 1179, height: 2556 };
const logicalResolution = { width: 393, height: 852 };
const screenSize = 6.1; // 英寸 (對角線)

// 計算物理 DPI
const physicalDPI = 460;

// 計算 DPR
const DPR = 1179 / 393 = 3x;

// 計算邏輯 DPI
const logicalDPI = 460 / 3 = 153 DPI;
```

### 📱 主流設備像素密度對比

#### 蘋果設備
| 設備系列 | 邏輯解析度 | 物理解析度 | DPR | PPI | 邏輯DPI |
|---------|-----------|-----------|-----|-----|---------|
| **iPhone SE 3** | 375×667 | 750×1334 | 2x | 326 | 163 |
| **iPhone 14** | 390×844 | 1170×2532 | 3x | 460 | 153 |
| **iPhone 14 Pro** | 393×852 | 1179×2556 | 3x | 460 | 153 |
| **iPad Air** | 820×1180 | 1640×2360 | 2x | 264 | 132 |
| **MacBook Pro 16"** | 1728×1117 | 3456×2234 | 2x | 254 | 127 |

#### Android 主流設備
| 品牌系列 | 代表機型 | 邏輯解析度 | DPR | 特殊情況 |
|---------|---------|-----------|-----|----------|
| **Samsung Galaxy S** | S23 Ultra | 480×1050 | 3.5x | 異形螢幕 |
| **Google Pixel** | Pixel 7 Pro | 480×1056 | 3.5x | 圓角處理 |
| **OnePlus** | 11 Pro | 448×986 | 3x | 高刷新率 |

### 🧠 技術系統分層架構

#### 邏輯像素「技術棧」提供者
```typescript
const logicalPixelProviders = {
  // 🌐 Web 技術棧
  browsers: ['Chrome', 'Safari', 'Firefox'],  // WebKit/Blink 渲染引擎
  
  // 📱 移動端技術棧  
  iOS: 'Core Graphics + Metal',               // 蘋果圖形系統
  android: 'Skia + Vulkan/OpenGL',           // 安卓圖形系統
  
  // 💻 桌面技術棧
  macOS: 'Quartz + Metal',                   // macOS 圖形系統
  windows: 'DirectWrite + Direct2D',         // Windows 圖形系統
};
```

#### 抽象邊界定義
```
📱 圖形渲染系統內部:
├─ UI 框架 (UIKit, Android Views, DOM)
├─ 佈局引擎 (Auto Layout, Flexbox, CSS Grid)  
├─ 渲染引擎 (Core Graphics, Skia, WebKit)
└─ 💡 邏輯像素抽象在這裡生效

🚫 圖形渲染系統外部:
├─ 圖片檔案 (.jpg, .png, .webp)
├─ 影片檔案 (.mp4, .mov)
├─ GPU 紋理記憶體
└─ 💀 只有物理像素，沒有抽象
```

### 🎯 邏輯像素 vs 物理像素使用時機

#### 使用邏輯像素的場景 (開發時思考)
```css
/* ✅ CSS 佈局設計 */
.container {
  width: 100%;
  max-width: 1200px;    /* 邏輯像素 */
  padding: 2rem;        /* 邏輯像素 */
}

.button {
  height: 44px;         /* 邏輯像素 - 蘋果觸控標準 */
  font-size: 16px;      /* 邏輯像素 - 易讀標準 */
}
```

```javascript
// ✅ JavaScript 尺寸計算
const logicalWidth = element.clientWidth;     // 邏輯像素
const logicalHeight = window.innerHeight;     // 邏輯像素

// ✅ 響應式判斷
if (window.innerWidth < 768) {
  // 手機版佈局 (邏輯像素斷點)
}
```

#### 使用物理像素的場景 (資源準備)
```typescript
// ✅ 圖片資源準備
const prepareImages = () => {
  const baseWidth = 800;  // 邏輯尺寸
  
  return {
    '1x': `w_${baseWidth}`,      // 800px 物理
    '2x': `w_${baseWidth * 2}`,  // 1600px 物理  
    '3x': `w_${baseWidth * 3}`,  // 2400px 物理
  };
};

// ✅ Canvas 高清渲染
const canvas = document.createElement('canvas');
const dpr = window.devicePixelRatio || 1;

canvas.style.width = '400px';   // 邏輯尺寸
canvas.style.height = '300px';  // 邏輯尺寸

canvas.width = 400 * dpr;       // 物理尺寸
canvas.height = 300 * dpr;      // 物理尺寸
```

### 📊 物理像素考量場景統計

```typescript
const physicalPixelScenarios = {
  // 🥇 最常見 (90% 的物理像素考量)
  imageAssets: {
    frequency: 'daily',
    examples: ['產品圖片', '使用者頭像', '背景圖', 'Logo', 'Icon']
  },
  
  // 🥈 偶爾遇到 (9% 的物理像素考量)  
  canvasGraphics: {
    frequency: 'occasionally', 
    examples: ['資料視覺化', '遊戲', '圖片編輯器', '簽名功能']
  },
  
  // 🥉 很少遇到 (1% 的物理像素考量)
  specialCases: {
    frequency: 'rarely',
    examples: ['WebGL 紋理', 'PDF 生成', '印刷準備', 'AR/VR']
  }
};
```

### 🔧 實踐決策檢查清單

```typescript
const shouldConsiderPhysicalPixels = (scenario: string) => {
  const checks = {
    // ✅ 需要考慮物理像素
    'preparing-image-assets': true,        // 圖片資源準備
    'canvas-drawing': true,                // Canvas 繪圖
    'webgl-textures': true,                // WebGL 紋理
    'print-stylesheets': true,             // 印刷樣式表
    'pdf-generation': true,                // PDF 生成
    
    // ❌ 不需要考慮物理像素
    'css-layouts': false,                  // CSS 佈局
    'dom-events': false,                   // DOM 事件
    'animations': false,                   // CSS/JS 動畫
    'responsive-design': false,            // 響應式設計
    'font-sizing': false                   // 字體尺寸
  };
  
  return checks[scenario] || false;
};
```

### 💡 記憶口訣

```
🧠 設計思考 = 邏輯像素 (用戶體驗一致性)
💾 資源準備 = 物理像素 (視覺品質保證)

邏輯像素決定「看起來多大」
物理像素決定「看起來多清楚」
```

### 🎨 iPhone 14 Pro 的「奢華渲染」

```
邏輯像素 (CSS 中的 1px):
┌─────┐
│  1  │  ← 開發者看到的
└─────┘

實際物理像素 (在 iPhone 14 Pro 螢幕上):
┌───┬───┬───┐
│ 1 │ 2 │ 3 │
├───┼───┼───┤  ← 螢幕實際的 LED 燈珠
│ 4 │ 5 │ 6 │
├───┼───┼───┤
│ 7 │ 8 │ 9 │
└───┴───┴───┘

結果：9個物理像素渲染1個邏輯像素 = 極致清晰體驗
```
