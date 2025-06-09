#!/usr/bin/env node

// Proxy setup - must be imported before other modules
import './proxy-setup.mts';

import { createPin } from './image-processor/pinterestPublisher.mts';
import { getCollectedImages } from './image-processor/imageCollector.mts';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ImageData } from "../app/types/image.ts";

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Load environment variables
config({ path: resolve(projectRoot, '.env.local') });

/**
 * Generate Cloudinary image URL
 */
function generateCloudinaryUrl(seoFileName: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const basePath = process.env.CLOUDINARY_BASE_PATH || 'interior-inspiration-website/posts';
  
  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable');
  }

  // Fully automatic transformation parameters: auto format, auto quality, auto width/height optimization, smart crop
  const transformations = 'f_auto,q_auto,c_auto,g_auto,w_auto,dpr_auto';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${seoFileName}`;
}

/**
 * Generate article URL
 */
function generateArticleUrl(articleSlug: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL environment variable');
  }

  return `${siteUrl}/posts/${articleSlug}`;
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log(`
Usage:
  npm run pinterest-publish <MDX file path> <Pinterest Board ID>

Example:
  npm run pinterest-publish content/posts/japandi-living-room.mdx 123456789

Parameters:
  MDX file path    - Full path to the MDX file to process
  Board ID         - Pinterest Board ID

Required Environment Variables:
  PINTEREST_ACCESS_TOKEN              - Pinterest API access token
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   - Cloudinary cloud name
  CLOUDINARY_BASE_PATH               - Cloudinary base path
  NEXT_PUBLIC_SITE_URL               - Website URL
  `);
}

async function main() {
  const startTime = Date.now();

  try {
    // Check command line arguments
    const [,, mdxFilePath, boardId] = process.argv;
    
    if (!mdxFilePath || !boardId) {
      showUsage();
      process.exit(1);
    }

    // Validate MDX file path
    const markdownPath = resolve(mdxFilePath);
    if (!markdownPath.endsWith('.mdx')) {
      throw new Error('Please provide a valid MDX file path');
    }

    // Validate required environment variables
    const requiredEnvVars = [
      'PINTEREST_ACCESS_TOKEN',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_BASE_PATH',
      'NEXT_PUBLIC_SITE_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('Starting Pinterest publishing process...');
    console.log('MDX file:', markdownPath);
    console.log('Board ID:', boardId);
    
    // Read and parse Markdown
    const content = readFileSync(markdownPath, 'utf-8');
    console.log('Successfully read file content, length:', content.length, 'bytes');
    
    const collectedImages = await getCollectedImages(content);
    console.log('Found images count:', collectedImages.length);
    
    if (collectedImages.length === 0) {
      console.log('No images found for publishing');
      return;
    }

    // Processing statistics
    let total = 0, success = 0, failed = 0;
    const errors: Array<{ file: string; error: string }> = [];
    const successPins: Array<{ file: string; pinId: string }> = [];

    // Process images one by one (to avoid API limits)
    for (const [index, imageData] of collectedImages.entries()) {
      total++;
      try {
        console.log(`\nProcessing image (${index + 1}/${collectedImages.length}): ${imageData.localPath.originalFileName}`);
        
        // Generate Cloudinary URL
        const imageUrl = generateCloudinaryUrl(imageData.seo.seoFileName);
        console.log('Image URL:', imageUrl);
        
        // Generate article URL
        const articleUrl = generateArticleUrl(imageData.localPath.articleSlug);
        console.log('Article URL:', articleUrl);
        
        // Publish to Pinterest
        const result = await createPin(imageData, imageUrl, articleUrl, boardId);
        
        success++;
        successPins.push({
          file: imageData.localPath.originalFileName,
          pinId: result.id
        });
        
        // Add delay to avoid API limits
        if (index < collectedImages.length - 1) {
          console.log('Waiting 2 seconds to avoid API limits...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          file: imageData.localPath.originalFileName,
          error: errorMessage
        });
        console.error(`Processing failed: ${errorMessage}`);
      }
    }

    // Calculate processing time
    const duration = (Date.now() - startTime) / 1000;

    // Output statistics
    console.log('\nProcessing Statistics:');
    console.log('='.repeat(50));
    console.log(`Total: ${total}`);
    console.log(`Success: ${success} (${((success/total)*100).toFixed(1)}%)`);
    console.log(`Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)`);
    console.log(`Total time: ${duration.toFixed(1)} seconds`);

    if (successPins.length > 0) {
      console.log('\nSuccessfully published Pins:');
      console.log('-'.repeat(50));
      successPins.forEach(({ file, pinId }, index) => {
        console.log(`${index + 1}. ${file} → Pin ID: ${pinId}`);
      });
    }

    if (errors.length > 0) {
      console.log('\nError Details:');
      console.log('-'.repeat(50));
      errors.forEach(({ file, error }, index) => {
        console.log(`${index + 1}. ${file}:`);
        console.log(`   ${error}`);
      });
    }

    console.log('\nPinterest publishing completed!');

  } catch (error) {
    console.error('Script execution failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Ensure main function error is handled correctly
main().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : error);
  process.exit(1);
}); 