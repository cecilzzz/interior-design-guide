import { CldUploadApi } from 'next-cloudinary/server';
import type { ImageData } from './markdownProcessor';

interface ProcessingResult {
  success: boolean;
  cloudinaryUrl?: string;
  pinId?: string;
  error?: string;
}

interface ProcessingStats {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    file: string;
    error: string;
  }>;
}

interface PinterestPinData {
  title: string;
  description: string;
  media_source: {
    url: string;
  };
  link: string;
  board_id: string;
}

/**
 * 上傳圖片到 Cloudinary
 */
export const uploadToCloudinary = async (
  file: string,
  seoFileName: string,
  altText: string
): Promise<{ secure_url: string }> => {
  try {
    const result = await CldUploadApi.upload(file, {
      public_id: seoFileName,
      tags: ['interior-design'],
      context: {
        alt: altText
      },
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      secure_url: result.secure_url
    };
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * 創建 Pinterest Pin
 */
export const createPinterestPin = async (
  pinData: PinterestPinData
): Promise<{ id: string }> => {
  const response = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pinData)
  });

  if (!response.ok) {
    throw new Error(`Pinterest API error: ${response.statusText}`);
  }

  return response.json();
};

/**
 * 處理單個圖片
 */
export const processImage = async (
  imageData: ImageData,
  sectionId: string,
  articleSlug: string,
  boardId: string
): Promise<ProcessingResult> => {
  try {
    // 上傳到 Cloudinary
    const uploadResult = await uploadToCloudinary(
      `content/images/${imageData.originalName}`,
      imageData.seoFileName,
      imageData.altText
    );

    // 創建 Pinterest Pin
    const pinResult = await createPinterestPin({
      title: imageData.pin.title,
      description: imageData.pin.description,
      media_source: {
        url: uploadResult.secure_url
      },
      link: `${process.env.NEXT_PUBLIC_SITE_URL}/${articleSlug}#${sectionId}?utm_source=pinterest`,
      board_id: boardId
    });

    return {
      success: true,
      cloudinaryUrl: uploadResult.secure_url,
      pinId: pinResult.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error'
    };
  }
};

/**
 * 追蹤處理統計
 */
export const createProcessingStats = (): ProcessingStats => ({
  total: 0,
  success: 0,
  failed: 0,
  errors: []
});

export const updateStats = (
  stats: ProcessingStats,
  result: ProcessingResult,
  file: string
): void => {
  stats.total++;
  if (result.success) {
    stats.success++;
  } else {
    stats.failed++;
    stats.errors.push({
      file,
      error: result.error || 'Unknown error'
    });
  }
}; 