"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth/");

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    // Don't add scroll listeners on auth pages
    if (isAuthPage) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthPage]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Don't show navbar on auth pages - moved after all hooks
  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gray-900 shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                ThinkMate
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/my-notes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
                  >
                    My Notes
                  </Link>
                  <Link
                    href="/ai-notes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
                  >
                    AI Notes
                  </Link>
                  <div className="hidden md:block ml-4">
                    <DarkModeToggle />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-green-400 text-white hover:bg-green-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="#features"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#pricing"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#contact"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors"
                  >
                    Contact
                  </Link>
                  <div className="hidden md:block ml-4">
                    <DarkModeToggle />
                  </div>
                  <Link
                    href="/auth/sign-in"
                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-green-400 text-white hover:bg-green-500 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
              >
                Dashboard
              </Link>
              <Link
                href="/my-notes"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
              >
                My Notes
              </Link>
              <Link
                href="/ai-notes"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
              >
                AI Notes
              </Link>
              <div className="mt-4 flex justify-start">
                <DarkModeToggle />
              </div>
              <button
                onClick={handleSignOut}
                className="w-full mt-4 px-4 py-2 rounded-md text-base font-medium bg-green-400 text-white hover:bg-green-500 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:text-green-400 dark:hover:text-green-400"
              >
                Contact
              </Link>
              <div className="mt-4 flex justify-start">
                <DarkModeToggle />
              </div>
              <Link
                href="/auth/sign-in"
                className="w-full mt-4 px-4 py-2 rounded-md text-base font-medium bg-green-400 text-white hover:bg-green-500 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
