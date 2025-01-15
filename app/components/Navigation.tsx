"use client";
import { useState } from "react";
import Image from "next/image";

type SubItem = {
  title: string;
  items?: string[];
};

type NavItem = {
  title: string;
  subItems: (string | SubItem)[];
};

const navItems: NavItem[] = [
  {
    title: "STYLE",
    subItems: [
      {
        title: "Modern",
        items: ["Contemporary", "Minimalist", "Industrial"],
      },
      {
        title: "Classic",
        items: ["Traditional", "Victorian", "Art Deco"],
      },
    ],
  },
  {
    title: "SPACE",
    subItems: ["Living Room", "Bedroom", "Kitchen", "Bathroom"],
  },
  {
    title: "COLOR",
    subItems: ["Neutral", "Bold", "Pastel", "Monochrome"],
  },
  {
    title: "LIGHT",
    subItems: ["Natural", "Artificial", "Ambient", "Task"],
  },
  {
    title: "INSPIRATION",
    subItems: ["Projects", "Gallery", "Blog", "Resources"],
  },
];

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="w-full bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center py-8">
        <div className="mb-8">
          <Image
            src="/logo-main-light.png"
            alt="Olivia Wilson"
            width={100}
            height={100}
            priority
            className="h-auto w-auto"
          />
        </div>
        
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
              
              {activeMenu === item.title && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white shadow-lg rounded-sm py-2 min-w-[200px]">
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
      </nav>
    </header>
  );
} 