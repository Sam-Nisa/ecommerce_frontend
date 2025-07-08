'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Adjust import based on your Next.js version

export default function OwnerLayout({ children }) {
    const { id } = useParams(); // Assuming you have a way to get the owner ID from the URL or context
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/owner/dashboard" className="text-xl font-bold text-blue-600">
            Owner Dashboard
          </Link>

          <ul className="flex space-x-6">  
            <li>
              <Link href={`/owner/${id}/service`} className="text-gray-700 hover:text-blue-600">
                Services
              </Link>
            </li>
            <li>
              <Link href={`/owner/${id}/all`} className="text-gray-700 hover:text-blue-600">
                View Service
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-red-600 hover:text-red-800">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  );
}
