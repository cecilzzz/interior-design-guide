'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 監聽滾動事件，決定按鈕是否顯示
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // 平滑滾動到頂部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="hidden md:block fixed bottom-8 right-8 z-50 p-2 rounded-full bg-gray-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-coral-400"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
} 