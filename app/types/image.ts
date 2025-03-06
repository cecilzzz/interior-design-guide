/**
 * Pinterest 分享資訊
 */
export interface PinData {
  /** Pin 的標題 */
  title: string;
  /** Pin 的描述 */
  description: string;
}

/**
 * SEO 相關資訊
 */
export interface ImageSEOData {
  /** 原始圖片檔名 */
  originalName: string;
  /** 本地相對路徑 */
  localRelativePath: string;
  /** SEO 友好的檔名（不含副檔名） */
  seoFileName: string;
  /** 文章的 slug */
  articleSlug: string;
  /** 圖片所屬文章段落的 ID */
  sectionId: string;
  /** 圖片替代文字 */
  altText: string;
}

/**
 * 圖片資料介面定義
 * 用於 MDX 文件中的圖片元素
 */
export interface ImageData {
  /** 圖片來源 URL */
  src: string;

  /** 圖片標題（用於 SEO 和懸停提示） */
  title: string;

  /** 圖片替代文字（用於 SEO 和無障礙） */
  alt: string;

  /** SEO 相關資訊 */
  seo: ImageSEOData;

  /** Pinterest 分享資訊 */
  pin: PinData;

  /** 自定義 CSS 類名（可選） */
  className?: string;
} 