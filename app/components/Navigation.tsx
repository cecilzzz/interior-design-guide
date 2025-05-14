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
      //{ title: "Modern", link: "/category/modern" },
      //{ title: "Minimalist", link: "/category/minimalist" },
      //{ title: "Scandinavian", link: "/category/scandinavian" },
      { title: "Japandi", link: "/category/japandi" },
      { title: "Industrial", link: "/category/industrial" },
      //{ title: "Contemporary", link: "/category/contemporary" },
      { title: "Mediterranean", link: "/category/mediterranean" },
      //{ title: "Coastal", link: "/category/coastal" },
      { title: "Rustic", link: "/category/rustic" },
      //{ title: "Farmhouse", link: "/category/farmhouse" },
      //{ title: "Boho", link: "/category/boho" },
      //{ title: "Mid-century Modern", link: "/category/mid-century-modern" },
      { title: "French", link: "/category/french" },
      { title: "Dark", link: "/category/dark" },
      //{ title: "Earthy", link: "/category/earthy" }
    ],
  },
  /* {
    title: "THE FRAMEWORK",
    subItems: [
      { title: "Design Principles", link: "/category/design-principles" },
      { title: "Space Planning", link: "/category/space-planning" },
      { title: "Lighting", link: "/category/lighting" },
      { title: "Colors & Palettes", link: "/category/colors-and-palettes" },
      { title: "Materials & Textures", link: "/category/materials-and-textures" }
    ],
  }, */
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
            <div className="relative w-[320px] md:w-[360px] lg:w-[400px] h-[76.8px] md:h-[86.4px] lg:h-[96px]">
              <Image
                src="/logo-no-padding.png"
                alt="Interior Design Guide"
                fill
                priority
                className="object-contain"
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 360px, 320px"
              />
            </div>
          </Link>

          {/* Primary menu container */}
          <nav className="hidden md:flex items-center h-full">
            <ul className="flex space-x-6 lg:space-x-10 font-montserrat text-sm lg:text-base tracking-widest ml-8 lg:ml-12">
              {navItems.map((item) => (
                <li 
                  key={item.title}
                  className="relative group"
                >
                  {/* Primary menu item */}
                  <a
                    href="#"
                    className="block py-1 text-white hover:text-gray-300 whitespace-nowrap"
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
                            className="block px-5 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat"
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    </div>
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