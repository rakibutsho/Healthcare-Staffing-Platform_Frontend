"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { logoutHandler } from "@/utils/handleLogout";

export default function Navbar() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about_us" },
    { name: "Contact", path: "/contact" },
  ];

  // Add scroll listener to set `isScrolled`
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };
  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={1000}
                height={1000}
                className="w-[200px]"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-teal-500 font-medium"
                      : "text-teal-500"
                  }`}
                >
                  {isActive(item.path) ? "• " : ""}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Buttons */}
          {user ? (
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center space-x-4 relative">
                <div
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-teal-600 border border-teal-600 transition-all duration-300 hover:bg-teal-600 hover:text-white"
                >
                  <div className=" text-2xl">
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <div
                  className={`
                    absolute right-4 w-56 top-14 bg-white rounded-lg shadow-xl z-50 border border-gray-200
                    origin-top transition-all duration-200 ease-out overflow-hidden
                    ${profileOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}
                  `}
                >
                  {/* User info section */}
                  <div className="p-4 border-b border-teal-100 bg-teal-50">
                    <h1 className="text-gray-900 font-medium truncate grid grid-cols-1 word-break">
                      {user?.fullName}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 truncate grid grid-cols-1 word-break">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <ul className="py-1">
                    <li>
                      <Link
                        href={
                          user.role === "FACILITY"
                            ? "/facility"
                            : user.role === "PROVIDER"
                            ? "/dashboard"
                            : "/"
                        }
                        className="block px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-100 cursor-pointer transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {user.role === "FACILITY"
                            ? "Facility Dashboard"
                            : "Provider Dashboard"}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full text-left block px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-100 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                          setProfileOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-5">
              <Link
                href="/auth/login"
                className="px-6 py-4 rounded-[8px] font-medium border border-teal-500 hover:bg-teal-500 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/auth/singup"
                className="px-6 py-4 rounded-[8px] font-medium text-white bg-teal-500 hover:bg-teal-600"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-600 hover:text-teal-900 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium ${
                  isActive(item.path)
                    ? "text-teal-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isActive(item.path) ? "• " : ""}
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href={
                    user.role === "FACILITY"
                      ? "/facility"
                      : user.role === "PROVIDER"
                      ? "/dashboard"
                      : "/"
                  }
                  className="px-6 py-3 rounded-lg font-medium text-center border-2 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  {user.role === "FACILITY"
                    ? "Facility Dashboard"
                    : user.role === "PROVIDER"
                    ? "Provider Dashboard"
                    : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    // Add your logout logic here
                    handleLogout();
                  }}
                  className="px-6 py-3 rounded-lg font-medium text-center text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/auth/login"
                  className="px-6 py-3 rounded-lg font-medium text-center border-2 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/singup"
                  className="px-6 py-3 rounded-lg font-medium text-center text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
