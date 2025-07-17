"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-gray-900 font-bold text-xl">PLANA</span>
        </Link>
      </div>
    </header>
  );
} 