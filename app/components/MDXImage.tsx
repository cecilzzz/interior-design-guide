import Image from 'next/image';
import PinterestButton from './PinterestButton';
import { getImageUrl } from '@/app/lib/imageUtils';
import type { ImageData } from '@/app/types/image';

export function MDXImage({ src, seo, pin, className = '' }: ImageData) {
  const imageUrl = src.startsWith('http') ? src : getImageUrl(src, 'content');
  
  return (
    <span className={`block relative group my-8 ${className}`}>
      <Image
        src={imageUrl}
        alt={seo.altText}
        width={800}
        height={450}
        className="rounded-lg w-full h-auto"
      />
      <PinterestButton 
        description={pin.description}
        media={imageUrl}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </span>
  );
} 