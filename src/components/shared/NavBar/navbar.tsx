"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavbarProps, NavItem } from "./types";
import { Drawer } from "./drawer";
import Image from "next/image";

export const Navbar = ({
  logo,
  navDivider = false,
  navItems = [],
  buttons = [],
  mobileBreakpoint = "lg",
  position = "fixed",
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
  activeTextColor = "text-blue-600",
  hoverTextColor = "hover:text-blue-500",
  dropdownBackgroundColor = "bg-white",
  dropdownTextColor = "text-gray-800",
  dropdownHoverBackgroundColor = "hover:bg-gray-100",
  dropdownBorderColor = "border-gray-200",
  hamburgerColor = "text-gray-800",
  drawerBackgroundColor = "bg-white",
  drawerWidth = "w-64",
  shadow = "shadow-md",
  padding = "px-4 py-2",
  transition = "transition-all duration-300 ease-in-out",
  zIndex = "z-[999]",
  showOnScroll = false,
  hideOnScroll = false,
  conditionalRoutes = {},
  className = "",
  activeBgColor = "bg-blue-100",
  activeHoverBgColor = "hover:bg-blue-50",
  onNavItemClick,
  onButtonClick,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<Record<number, boolean>>({});
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  // Responsive breakpoint helper
  const breakpointMap = {
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    "2xl": "2xl",
  };
  const current = breakpointMap[mobileBreakpoint] || "lg";

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      if (hideOnScroll) {
        setVisible(scrollPosition > currentPosition || currentPosition < 50);
      }
      if (showOnScroll) {
        setVisible(currentPosition > 50);
      }
      setScrollPosition(currentPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition, hideOnScroll, showOnScroll]);

  // Helpers
  const toggleDropdown = (index: number) =>
    setDropdownOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const closeAllDropdowns = () => setDropdownOpen({});
  const shouldShowRoute = (item: NavItem) =>
    !item.path || !conditionalRoutes[item.path] || conditionalRoutes[item.path];
  const isActiveRoute = (path: string) =>
    !!path && (pathname === path || pathname.startsWith(`${path}/`));

  const handleNavItemClick = (item: NavItem) => {
    onNavItemClick?.(item);
    closeAllDropdowns();
  };
  const handleButtonClick = (index: number) => {
    if (onButtonClick && buttons[index]?.onClick) {
      onButtonClick(index, buttons[index]);
    }
  };

  // Position & visibility classes
  const positionClasses =
    {
      fixed: "fixed top-0 left-0 right-0",
      sticky: "sticky top-0",
      relative: "relative",
      absolute: "absolute top-0 left-0 right-0",
    }[position] || "fixed top-0 left-0 right-0";
  const visibilityClass = visible ? "translate-y-0" : "-translate-y-full";

  return (
    <>
      <nav
        className={`${backgroundColor} ${textColor} ${positionClasses} ${shadow} ${padding} ${transition} ${zIndex} ${visibilityClass} w-full`}
        onMouseLeave={closeAllDropdowns}
      >
        <div className={`flex items-center justify-between ${className}`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo &&
              (typeof logo === "string" ? (
                <Link href="/" className="flex items-center">
                  <Image
                    width={300}
                    height={300}
                    priority
                    src={logo}
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                </Link>
              ) : (
                <Link href="/" className="flex items-center">
                  {logo}
                </Link>
              ))}
          </div>

          {/* Desktop nav */}
          <div className={`hidden ${current}:flex items-center justify-center flex-1 mx-4`}>
            <ul className="flex">
              {navItems.filter(shouldShowRoute).map((item, index) => (
                <li key={index} className="relative px-4">
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className={`flex items-center ${hoverTextColor} ${
                          isActiveRoute(item.path || "#") ? activeTextColor : ""
                        } focus:outline-none`}
                      >
                        {item.label}
                        <svg
                          className={`ml-1 h-4 w-4 transform ${
                            dropdownOpen[index] ? "rotate-180" : ""
                          } ${transition}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {dropdownOpen[index] && (
                        <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg ${dropdownBackgroundColor} border ${dropdownBorderColor} ${zIndex}`}>
                          <div className="py-1">
                            {item.dropdown.map((ddItem, ddIndex) => (
                              <Link
                                key={ddIndex}
                                href={ddItem.path || "#"}
                                className={`block px-4 py-2 ${dropdownTextColor} ${dropdownHoverBackgroundColor} ${
                                  isActiveRoute(ddItem.path || "#") ? activeTextColor : ""
                                }`}
                                onClick={() =>
                                  handleNavItemClick({ ...item, path: ddItem.path })
                                }
                              >
                                {ddItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.path || "#"}
                      className={`${hoverTextColor} ${isActiveRoute(item.path || "#") ? activeTextColor : ""}`}
                      onClick={() => handleNavItemClick(item)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop buttons */}
          <div className={`hidden ${current}:flex items-center space-x-4`}>
            {buttons.map((button, index) =>
              button.component ? (
                <div key={index} onClick={() => handleButtonClick(index)}>
                  {button.component}
                </div>
              ) : (
                <button
                  key={index}
                  onClick={() => handleButtonClick(index)}
                  className={
                    button.className || "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  }
                >
                  {button.label}
                </button>
              )
            )}
          </div>

          {/* Hamburger */}
          <div className={`flex ${current}:hidden gap-4`}>
            <button
              onClick={() => setIsOpen(true)}
              className={`p-1 border rounded-sm h-fit my-auto aspect-square ${hamburgerColor} focus:outline-none`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navItems={navItems.filter(shouldShowRoute)}
        buttons={buttons}
        backgroundColor={drawerBackgroundColor}
        textColor={textColor}
        activeTextColor={activeTextColor}
        width={drawerWidth}
        zIndex={zIndex}
        onNavItemClick={handleNavItemClick}
        onButtonClick={handleButtonClick}
        isActiveRoute={isActiveRoute}
        activeBgColor={activeBgColor}
        activeHoverBgColor={activeHoverBgColor}
      />
    </>
  );
};
