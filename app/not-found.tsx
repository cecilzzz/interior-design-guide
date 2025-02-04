import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-playfair text-6xl mb-4">404</h1>
        <h2 className="font-playfair text-2xl mb-6">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. 
          It might have been moved, deleted, or never existed.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white transition-colors rounded-md group"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Return to Home
          </Link>
          
          <div className="pt-4">
            <p className="text-sm text-gray-500">
              Looking for design inspiration? 
              <Link href="/blog" className="text-coral-500 hover:text-coral-600 ml-1">
                Check out our blog
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 