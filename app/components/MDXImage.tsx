import Image from 'next/image';
import PinterestButton from './PinterestButton';
import { getImageUrl } from '@/app/utils/imageUtils';
import type { ImageData } from '../../app/types/image';

export function MDXImage({ 
  localPath,
  seo, 
  pin, 
  className = '' 
}: ImageData) {
  const imageUrl = getImageUrl(seo.seoFileName, 'content');
  
  return (
    <div className={`relative overflow-hidden rounded-lg group my-8 ${className}`}>
      <Image
        src={imageUrl}
        alt={seo.altText}
        width={1200}
        height={800}
        className="w-full h-auto object-cover"
        sizes="(min-width: 1280px) 1200px, 92vw"
      />
      <PinterestButton 
        description={pin.description}
        media={imageUrl}
        url={process.env.NEXT_PUBLIC_SITE_URL || ''}
      />
    </div>
  );
}