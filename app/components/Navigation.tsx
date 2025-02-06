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
    <header className="fixed top-0 left-0 right-0 bg-[#424144] z-50">
      <div className="max-w-[120rem] mx-auto px-12">
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
              className="h-[80%] w-auto"
            />
          </Link>

          {/* Primary menu container - controls the overall navigation layout */}
          <nav className="flex space-x-12 font-montserrat text-base tracking-widest h-full items-center">
            {navItems.map((item) => (
              <div 
                key={item.title}
                className="relative group"
              >
                {/* Primary menu item */}
                <a
                  href="#"
                  className="block px-5 py-1 text-white hover:text-gray-300 whitespace-nowrap"
                >
                  {item.title}
                </a>
                
                {item.subItems && (
                  // Submenu positioning container - controls the dropdown position and animation
                  <div className="absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Submenu content container - controls the visual style and dimensions */}
                    <div className="bg-[#3C3C3C] shadow-lg rounded-sm py-3 w-[300px]">
                      {item.subItems.map((subItem) => (
                        // Submenu item
                        <a
                          key={subItem.title}
                          href={subItem.link}
                          className="block pl-5 pr-12 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat"
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
    </header>
  );
} 