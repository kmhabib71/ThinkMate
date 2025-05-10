import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("w-full bg-gray-800 text-white py-8", className)}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold text-xl">ThinkMate</h3>
            <p className="text-gray-300 mt-2">
              Your AI-powered writing companion
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link
              href="#features"
              className="hover:text-green-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hover:text-green-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="hover:text-green-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} ThinkMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
