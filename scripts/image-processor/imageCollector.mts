import { compile } from '@mdx-js/mdx';
import type { ImageData } from '../../app/types/image.ts';
import { visit as unistVisit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

/**
 * Extract object value from JSX expression
 */
const extractObjectFromExpression = (expression: string): Record<string, any> => {
  try {
    // Remove opening and closing braces, then execute eval
    const cleanedExpression = expression.trim().replace(/^{|}$/g, '');
    // Use Function constructor instead of eval for better security
    return new Function(`return ${cleanedExpression}`)();
  } catch (error) {
    console.error('Failed to parse JSX expression:', error);
    return {};
  }
};

/**
 * Process image components in MDX file
 * Extract all image information including SEO data and related content
 * 
 * @param content - MDX file content
 * @returns Array of image information, each element contains complete image info
 */
export const getCollectedImages = async (content: string): Promise<ImageData[]> => {
  const collectedImages: ImageData[] = [];
  
  try {
    console.log('Starting MDX compilation...');
    const result = await compile(content, {
      // Enable development mode for more error information
      development: true,
      // Use remark plugin to collect MDXImage components
      remarkPlugins: [
        () => (tree: Root) => {
          console.log('Processing MDX syntax tree...');
          unistVisit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
            if (node.name === 'MDXImage') {
              console.log('Found MDXImage component');
              const props: Record<string, any> = {};
              
              // Process each attribute
              for (const attr of node.attributes) {
                console.log('Processing attribute:', attr);
                if (attr.type === 'mdxJsxAttribute' && attr.name) {
                  if (typeof attr.value === 'string') {
                    props[attr.name] = attr.value;
                  } else if (attr.value?.type === 'mdxJsxAttributeValueExpression') {
                    try {
                      // Safely parse JSX expression
                      const value = new Function(`return ${attr.value.value}`)();
                      props[attr.name] = value;
                    } catch (error) {
                      console.error('Failed to parse attribute:', error);
                    }
                  }
                }
              }
              
              console.log('Collected attributes:', props);
              
              // Validate and collect image data
              if (
                props.localPath?.originalFileName &&
                props.localPath?.articleSlug &&
                props.seo?.seoFileName &&
                props.seo?.altText &&
                props.pin?.title &&
                props.pin?.description
              ) {
                collectedImages.push(props as ImageData);
                console.log('Added image data to collection');
              } else {
                console.warn('Skipping invalid image data:', props);
              }
            }
          });
          console.log('Completed processing MDX syntax tree');
        }
      ]
    });
    
    console.log('Compilation result:', result);
    
  } catch (error) {
    console.error('Error occurred while parsing MDX:', error);
    // Ensure error is properly handled
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error occurred during MDX parsing');
    }
  }

  return collectedImages;
};