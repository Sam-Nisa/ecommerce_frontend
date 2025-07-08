'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';

// Icons
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// A reusable component for navigation links to handle active state
function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const { user: userProfile, fetchUser } = useUserStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  // Fetch detailed user profile when authenticated
  useEffect(() => {
    if (authUser?.id) {
      fetchUser();
    }
  }, [authUser, fetchUser]);

  // Handle closing the user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuRef]);
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/service', label: 'Services' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side: Logo and Desktop Nav Links */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img className="h-15  w-auto" src="/logo.jpeg" alt="Logo" />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: User menu or Auth buttons */}
          <div className="hidden md:block">
            {userProfile ? (
              <div className="ml-4 flex items-center md:ml-6 relative" ref={userMenuRef}>
                <button
  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
  className="flex items-center gap-2 p-1 bg-white rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
  <span className="sr-only">Open user menu</span>

  {/* Avatar / Initial / Icon */}
  {userProfile?.avatarUrl ? (
    <img
      src={userProfile.avatarUrl}
      alt="User Avatar"
      className="h-8 w-8 rounded-full object-cover"
    />
  ) : (
    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
      {userProfile?.name ? (
        userProfile.name[0].toUpperCase()
      ) : (
        <UserCircleIcon className="h-6 w-6" />
      )}
    </div>
  )}

  {/* Username (hidden on very small screens) */}
  <span className="hidden sm:block text-sm font-medium text-gray-700">
    {userProfile?.name ?? 'Guest'}
  </span>
</button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="origin-top-right absolute right-0 mt-10 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    >
                      {userProfile.role === 'admin' && (
                        <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <ChartBarIcon className="h-4 w-4" /> Admin
                        </Link>
                      )}
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                         <Cog6ToothIcon className="h-4 w-4" /> My Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        <ArrowRightOnRectangleIcon className="h-4 w-4"/> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">Login</Link>
                <Link href="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Register</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Menu Panel */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>{link.label}</Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {userProfile ? (
              <div className="px-2 space-y-1">
                 {userProfile.role === 'admin' && (
                    <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">Admin</Link>
                  )}
                <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">My Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">Logout</button>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                <Link href="/login" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">Login</Link>
                <Link href="/register" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Register</Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}