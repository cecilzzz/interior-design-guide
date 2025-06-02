import SchemaOrg from '../components/SchemaOrg';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <SchemaOrg isAboutPage={true} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-left mb-16">
          <h1 className="text-5xl font-playfair font-bold text-gray-900 mb-6 tracking-tight">
            About
          </h1>

        </div>

        <div className="space-y-16">
          <div className="prose lg:prose-xl text-gray-700 max-w-none text-left">
            <p className="text-xl leading-relaxed">
              Interior design is a visual language that speaks beyond words. This journal explores the subtle narratives of spatial design, offering a curated perspective on how environments shape our experiences.
            </p>
            <p className="text-xl leading-relaxed">
              Each collection is an invitation to see spaces differently - not as static arrangements, but as living, breathing compositions that reflect cultural aesthetics, personal stories, and the evolving dialogue between architecture and human emotion.
            </p>
            <p className="text-xl leading-relaxed">
              Through carefully selected imagery and thoughtful insights, we seek to reveal the poetry hidden in everyday spaces.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="flex justify-center">
              <Image 
                src="/images/akio-hasegawa.jpg" 
                alt="Akio Hasegawa" 
                width={400} 
                height={400} 
                className="rounded-2xl shadow-xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6">
                Akio Hasegawa
              </h2>
              <div className="prose lg:prose-xl text-gray-700 space-y-4">
                <p>
                  Akio Hasegawa, M.Arch, is an interior design strategist with a multidisciplinary approach to architectural research and visual design. His work explores the intersections of spatial theory, cultural aesthetics, and contemporary design practices.
                </p>
                <p>
                  With advanced training from Harvard Graduate School of Design and recognition from the International Interior Design Association, Hasegawa brings a sophisticated perspective to the exploration of interior design and architectural spaces.
                </p>
              </div>
            </div>
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