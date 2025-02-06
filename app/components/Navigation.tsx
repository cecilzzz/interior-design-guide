"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

type NavItem = {
  title: string;
  subItems?: {
    title: string;
    link: string;
  }[];
};

const navItems: NavItem[] = [
  {
    title: "LIVING SPACES",
    subItems: [
      { title: "Living Room", link: "/blog/category/living-room" },
      { title: "Bedroom", link: "/blog/category/bedroom" },
      { title: "Kitchen & Dining", link: "/blog/category/kitchen-and-dining" },
      { title: "Bathroom", link: "/blog/category/bathroom" },
      { title: "Work From Home", link: "/blog/category/work-from-home" },
      { title: "Rentals", link: "/blog/category/rentals" }
    ],
  },
  {
    title: "DESIGN ELEMENTS",
    subItems: [
      { title: "Space Planning", link: "/blog/category/space-planning" },
      { title: "Colors & Palettes", link: "/blog/category/colors-and-palettes" },
      { title: "Lighting", link: "/blog/category/lighting" },
      { title: "Materials & Textures", link: "/blog/category/materials-textures" }
    ],
  },
  {
    title: "INSPIRATION",
    subItems: [
      { title: "Cozy Home", link: "/blog/category/cozy-home" },
      { title: "Modern Living", link: "/blog/category/modern-living" },
      { title: "Trending", link: "/blog/category/trending" },
      { title: "Makeovers", link: "/blog/category/makeovers" }
    ],
  },
  {
    title: "ABOUT",
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#424144] z-50">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-[100px]">
          {/* Logo container */}
          <Link 
            href="/"
            className="flex-shrink-0 h-full hover:opacity-80 transition-opacity flex items-center"
          >
            <Image
              src="/logo-v2.png"
              alt="Interior Design Guide"
              width={500}
              height={100}
              priority
              className="h-[60%] sm:h-[70%] md:h-[80%] w-auto"
            />
          </Link>

          {/* Primary menu container - controls the overall navigation layout */}
          <nav className="hidden md:flex space-x-6 lg:space-x-12 font-montserrat text-sm lg:text-base tracking-widest h-full items-center">
            {navItems.map((item) => (
              <div 
                key={item.title}
                className="relative group"
              >
                {/* Primary menu item */}
                <a
                  href="#"
                  className="block px-3 lg:px-5 py-1 text-white hover:text-gray-300 whitespace-nowrap"
                >
                  {item.title}
                </a>
                
                {item.subItems && (
                  // Submenu positioning container
                  <div className="absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Submenu content container */}
                    <div className="bg-[#3C3C3C] shadow-lg rounded-sm py-2 w-[250px] lg:w-[300px]">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.link}
                          className="block pl-4 lg:pl-5 pr-8 lg:pr-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat"
                        >
                          {subItem.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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

        {/* Mobile menu panel */}
        <div 
          className={`
            md:hidden fixed inset-0 top-[100px] bg-[#424144] 
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <nav className="h-full overflow-y-auto">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.title}>
                  {/* Mobile primary menu item */}
                  <div className="text-white py-2 border-b border-gray-600">
                    {item.title}
                  </div>
                  
                  {/* Mobile submenu items */}
                  {item.subItems && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.link}
                          className="block py-2 text-sm text-gray-300 hover:text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 