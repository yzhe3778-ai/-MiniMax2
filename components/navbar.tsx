import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="minimaxm2 Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              minimaxm2
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-purple-600 font-medium hover:text-purple-700 border-b-2 border-purple-600 pb-1">
              Home
            </Link>
            <Link href="/inspiration" className="text-gray-600 hover:text-gray-900">
              Inspiration
            </Link>
            <Link href="/tutorials" className="text-gray-600 hover:text-gray-900">
              Tutorials
            </Link>
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                Tools
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </div>

          {/* Right Side Icons & Login */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/sora2">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Sora2</Button>
            </Link>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
