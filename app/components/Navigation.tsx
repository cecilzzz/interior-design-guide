"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <header className="w-full bg-[#424144] relative z-50">
      <div className="border-y border-gray-600">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo with proper spacing */}
            <div className="flex-shrink-0 py-4 md:py-4 pl-8">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/logo-v2.png"
                  alt="Interior Design Guide"
                  width={200}
                  height={40}
                  priority
                  className="h-auto w-auto"
                />
              </Link>
            </div>

            {/* Navigation Items aligned to the right */}
            <nav className="flex space-x-12 font-montserrat text-xl tracking-widest py-4 md:py-4 pr-8">
              {navItems.map((item) => (
                <div 
                  key={item.title}
                  className="relative group"
                >
                  <a
                    href="#"
                    className="block px-6 py-2 text-white hover:text-gray-300 whitespace-nowrap"
                  >
                    {item.title}
                  </a>
                  
                  {item.subItems && (
                    <div className="absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-[#3C3C3C] shadow-lg rounded-sm py-3 w-[360px]">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.link}
                            className="block pl-6 pr-16 py-2.5 text-lg text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat"
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
          </div>
        </div>
      </div>
    </header>
  );
} 