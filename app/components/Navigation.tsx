"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

type NavItem = {
  title: string;
  subItems?: {
    title: string;
    link: string;
  }[];
  link?: string;
};

const navItems: NavItem[] = [
  {
    title: "ROOMS",
    subItems: [
      //{ title: "Small Space", link: "/category/small-space" },
      { title: "Living Room", link: "/category/living-room" },
      { title: "Bedroom", link: "/category/bedroom" },
      { title: "Kitchen & Dining", link: "/category/kitchen-and-dining" },
      { title: "Bathroom", link: "/category/bathroom" },
      //{ title: "Storage & Organization", link: "/category/storage-and-organization" },
      //{ title: "Rental & Budget", link: "/category/rental-and-budget" }
    ],
  },
  {
    title: "STYLES",
    subItems: [
      { title: "French", link: "/category/french/" },
      { title: "Mediterranean", link: "/category/mediterranean/" },
      { title: "Coastal", link: "/category/coastal/" },
      //{ title: "Modern", link: "/category/modern/" },
      //{ title: "Minimalist", link: "/category/minimalist/" },
      //{ title: "Scandinavian", link: "/category/scandinavian/" },
      { title: "Japandi", link: "/category/japandi/" },
      { title: "Industrial", link: "/category/industrial/" },
      //{ title: "Contemporary", link: "/category/contemporary/" },
      { title: "Rustic", link: "/category/rustic/" },
      //{ title: "Farmhouse", link: "/category/farmhouse/" },
      //{ title: "Boho", link: "/category/boho/" },
      //{ title: "Mid-century Modern", link: "/category/mid-century-modern/" },
      { title: "Dark", link: "/category/dark/" },
      //{ title: "Earthy", link: "/category/earthy/" }
    ],
  },
  /* {
    title: "THE FRAMEWORK",
    subItems: [
      { title: "Design Principles", link: "/category/design-principles/" },
      { title: "Space Planning", link: "/category/space-planning/" },
      { title: "Lighting", link: "/category/lighting/" },
      { title: "Colors & Palettes", link: "/category/colors-and-palettes/" },
      { title: "Materials & Textures", link: "/category/materials-and-textures/" }
    ],
  }, */
  {
    title: "ABOUT", 
    link: "/about/"
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // 如果手機版菜單開啟，強制顯示導航欄
      if (isOpen) {
        setIsVisible(true);
        return;
      }
      
      // 只在滾動超過一定距離時才觸發隱藏
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // 向下滾動
        setIsVisible(false);
      } else {
        // 向上滾動
        setIsVisible(true);
      }

      // 更新最後滾動位置
      setLastScrollY(currentScrollY);
    };

    // 使用 requestAnimationFrame 優化滾動事件
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          controlNavbar();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollY, isOpen]);

  // 當手機版菜單開啟時，禁止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 清理函數
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-[#424144] transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-12">
          <div className="flex items-center justify-between h-[60px] md:h-[80px]">
            {/* Logo container */}
            <Link 
              href="/"
              className="flex-shrink-0 h-full hover:opacity-80 transition-opacity flex items-center"
            >
              <div className="relative w-[320px] md:w-[360px] lg:w-[400px] h-[76.8px] md:h-[86.4px] lg:h-[96px]">
                <Image
                  src="/akio-hasegawa-dark.png"
                  alt="Akio Hasegawa"
                  fill
                  priority
                  className="object-contain"
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 360px, 320px"
                />
              </div>
            </Link>

            {/* Primary menu container */}
            <nav className="hidden md:flex items-center h-full">
              <ul className="flex space-x-6 md:space-x-10 font-montserrat text-sm md:text-base tracking-widest ml-8 md:ml-12">
                {navItems.map((item) => (
                  <li 
                    key={item.title}
                    className="relative group"
                  >
                    {/* 如果有子菜單，顯示下拉菜單 */}
                    {item.subItems ? (
                      <>
                        <a
                          href="#"
                          className="block py-1 text-white hover:text-gray-300 whitespace-nowrap"
                        >
                          {item.title}
                        </a>
                        
                        <div className="absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-[#3C3C3C] shadow-lg rounded-sm py-2 w-[250px] lg:w-[300px]">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.link}
                                className="block px-5 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      // 如果是直接鏈接，使用 Link 組件
                      <Link
                        href={item.link || '#'}
                        className="block py-1 text-white hover:text-gray-300 whitespace-nowrap"
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu panel - 移到 header 外部 */}
      {isOpen && (
        <div 
          className="font-montserrat md:hidden fixed inset-0 top-[60px] md:top-[80px] bg-[#424144] z-[9999]"
          onClick={() => setIsOpen(false)}
        >
          <nav className="h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.title}>
                  {/* Mobile primary menu item */}
                  {item.subItems ? (
                    <>
                      <div className="text-white py-2 border-b border-gray-600 tracking-widest">
                        {item.title}
                      </div>
                      
                      {/* Mobile submenu items */}
                      <div className="ml-4 mt-2 space-y-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.link}
                            className="block py-2 text-sm text-gray-300 hover:text-white font-montserrat tracking-wide"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.link || '#'}
                      className="block py-2 text-white border-b border-gray-600 hover:text-gray-300 tracking-widest"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
} 