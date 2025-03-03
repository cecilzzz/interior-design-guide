export const PATHS = {
  IMAGES_BASE_DIR: process.env.IMAGES_ROOT_DIR || '',
  CLOUDINARY_BASE_PATH: 'interior-inspiration-website/posts'
};

if (!PATHS.IMAGES_BASE_DIR) {
  throw new Error('IMAGES_ROOT_DIR environment variable is required');
} 