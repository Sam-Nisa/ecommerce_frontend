'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const { id } = useParams();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: `/admin/${id}/dashboard`, label: 'Dashboard' },
    { href: `/admin/${id}/users`, label: 'Users' },
    { href: `/admin/${id}/request`, label: 'Requests' }, // fixed typo here
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold tracking-wide">Admin Panel</div>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8 items-center">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors duration-200 ${
                    pathname === href
                      ? 'border-b-2 border-indigo-400 text-indigo-400'
                      : 'hover:text-indigo-300'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Notifications placeholder */}
            {/* <li><NotificationBell adminId={id} /></li> */}

            <li>
              <Link href="/login" className="hover:text-red-400 transition-colors duration-200">
                Logout
              </Link>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <ul className="md:hidden bg-gray-800 px-6 py-4 space-y-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-2 border-b border-gray-700 ${
                    pathname === href
                      ? 'text-indigo-400 font-semibold'
                      : 'hover:text-indigo-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/login"
                className="block py-2 text-red-400 hover:text-red-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Logout
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-auto select-none">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
}
