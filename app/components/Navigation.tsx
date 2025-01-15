"use client";
import { useState } from "react";
import Image from "next/image";

type SubItem = {
  title: string;
  items?: string[];
};

type NavItem = {
  title: string;
  subItems?: (string | SubItem)[];
};

const navItems: NavItem[] = [
  {
    title: "LIVING SPACES",
    subItems: [
      "Living Room",
      "Bedroom",
      "Kitchen & Dining",
      "Bathroom",
      "Work From Home",
      "Rentals"
    ],
  },
  {
    title: "DESIGN ELEMENTS",
    subItems: [
      "Space Planning",
      "Colors & Palettes",
      "Lighting",
      "Materials & Textures"
    ],
  },
  {
    title: "INSPIRATION",
    subItems: [
      "Cozy Home",
      "Modern Living",
      "Trending",
      "Makeovers"
    ],
  },
  {
    title: "ABOUT",
  },
];

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="w-full bg-white relative z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-8">
          <Image
            src="/logo-main-light.png"
            alt="Olivia Wilson"
            width={100}
            height={100}
            priority
            className="h-auto w-auto"
          />
        </div>
      </div>

      <div className="border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="flex space-x-16 font-montserrat text-sm tracking-widest">
              {navItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.title)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <a href="#" className="text-gray-900 hover:text-gray-500">
                    {item.title}
                  </a>
                  
                  {activeMenu === item.title && item.subItems && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white shadow-lg rounded-sm py-2 min-w-[200px] z-50">
                      {item.subItems.map((subItem) => (
                        <div key={typeof subItem === 'string' ? subItem : subItem.title} className="relative group">
                          {typeof subItem === 'string' ? (
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {subItem}
                            </a>
                          ) : (
                            <>
                              <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {subItem.title}
                              </a>
                              {subItem.items && (
                                <div className="absolute left-full top-0 hidden group-hover:block">
                                  <div className="bg-white shadow-lg rounded-sm py-2 min-w-[160px] ml-2">
                                    {subItem.items.map((item) => (
                                      <a
                                        key={item}
                                        href="#"
                                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                                      >
                                        {item}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 