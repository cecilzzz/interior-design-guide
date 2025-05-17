import { SchemaOrg } from '../components/SchemaOrg';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <SchemaOrg isAboutPage={true} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            About
          </h1>
        </div>
        
        <div className="prose lg:prose-xl text-gray-700 max-w-none mb-12">
          <p>
            Interior design is a visual language that speaks beyond words. This journal explores the subtle narratives of spatial design, offering a curated perspective on how environments shape our experiences.
          </p>
          <p>
            Each collection is an invitation to see spaces differently - not as static arrangements, but as living, breathing compositions that reflect cultural aesthetics, personal stories, and the evolving dialogue between architecture and human emotion.
          </p>
          <p>
            Through carefully selected imagery and thoughtful insights, we seek to reveal the poetry hidden in everyday spaces.
          </p>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 items-center">
          <div className="flex justify-center">
            <Image 
              src="/images/akio-hasegawa.jpg" 
              alt="Akio Hasegawa" 
              width={300} 
              height={300} 
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          
          <div className="prose lg:prose-xl text-gray-700">
            <h2>Akio Hasegawa</h2>
            <p>
              Akio Hasegawa, M.Arch, is an interior design strategist with a multidisciplinary approach to architectural research and visual design. His work explores the intersections of spatial theory, cultural aesthetics, and contemporary design practices.
            </p>
            <p>
              With advanced training from Harvard Graduate School of Design and recognition from the International Interior Design Association, Hasegawa brings a sophisticated perspective to the exploration of interior design and architectural spaces.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'About - Interior Design Journal',
  description: 'Exploring the visual language of interior design through curated perspectives and thoughtful insights.',
  openGraph: {
    title: 'About - Interior Design Journal',
    description: 'Exploring the visual language of interior design through curated perspectives and thoughtful insights.',
    type: 'profile',
  }
}; 