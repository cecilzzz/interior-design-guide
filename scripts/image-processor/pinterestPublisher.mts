import type { ImageData } from '../../app/types/image.js';

/**
 * Pinterest API 所需的數據結構
 */
interface PinData {
  title: string;
  description: string;
  media_source: {
    url: string;
  };
  link: string;
  board_id: string;
}

/**
 * 從 ImageData 創建 PinData
 * @internal 僅在 pinterestPublisher.ts 內部使用
 */
const createPinData = (
  imageData: ImageData,
  imageUrl: string,
  articleUrl: string
): PinData => {
  if (!process.env.PINTEREST_BOARD_ID) {
    throw new Error('缺少 Pinterest Board ID');
  }

  return {
    title: imageData.pin.title,
    description: imageData.pin.description,
    media_source: { url: imageUrl },
    link: `${articleUrl}#${imageData.sectionId}?utm_source=pinterest`,
    board_id: process.env.PINTEREST_BOARD_ID
  };
};

/**
 * 創建 Pinterest Pin
 */
export async function createPin(
  imageData: ImageData,
  imageUrl: string,
  articleUrl: string
): Promise<{ id: string }> {
  if (!process.env.PINTEREST_ACCESS_TOKEN) {
    throw new Error('缺少 Pinterest API Token');
  }

  const pinData = createPinData(imageData, imageUrl, articleUrl);

  const response = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pinData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinterest API 錯誤: ${error.message || response.statusText}`);
  }

  return response.json();
} 