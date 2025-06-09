import type { ImageData } from '../../app/types/image.ts';

/**
 * Get Pinterest API base URL
 */
function getApiBaseUrl(): string {
  const useSandbox = process.env.PINTEREST_USE_SANDBOX === 'true';
  return useSandbox ? 'https://api-sandbox.pinterest.com/v5' : 'https://api.pinterest.com/v5';
}

/**
 * Pinterest API required data structure
 */
interface PinData {
  title: string;
  description: string;
  media_source: {
    source_type: string;
    url: string;
  };
  link: string;
  board_id: string;
}

/**
 * Create PinData from ImageData
 * @internal Only used internally within pinterestPublisher.ts
 */
const createPinData = (
  imageData: ImageData,
  imageUrl: string,
  articleUrl: string,
  boardId: string
): PinData => {
  return {
    title: imageData.pin.title,
    description: imageData.pin.description,
    media_source: { 
      source_type: 'image_url',
      url: imageUrl 
    },
    link: `${articleUrl}?utm_source=pinterest`,
    board_id: boardId
  };
};

/**
 * Create Pinterest Pin
 */
export async function createPin(
  imageData: ImageData,
  imageUrl: string,
  articleUrl: string,
  boardId: string
): Promise<{ id: string }> {
  if (!process.env.PINTEREST_ACCESS_TOKEN) {
    throw new Error('Missing Pinterest API Token (PINTEREST_ACCESS_TOKEN)');
  }

  const apiUrl = getApiBaseUrl();
  const pinData = createPinData(imageData, imageUrl, articleUrl, boardId);

  console.log(`🌐 Using API: ${apiUrl}`);
  console.log(`📦 Sandbox mode: ${process.env.PINTEREST_USE_SANDBOX === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
  console.log('Creating Pinterest Pin:', {
    title: pinData.title,
    board_id: pinData.board_id,
    imageUrl: imageUrl
  });

  if (process.env.PINTEREST_USE_SANDBOX === 'true') {
    console.log('📦 Note: Currently using Sandbox environment, created pins will not be publicly visible');
  }

  const response = await fetch(`${apiUrl}/pins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pinData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinterest API error: ${error.message || response.statusText}`);
  }

  const result = await response.json();
  console.log('Pinterest Pin created successfully:', result.id);
  return result;
} 