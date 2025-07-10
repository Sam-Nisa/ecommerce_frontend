'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore'; // ✅ Fixed: Added this import
import { Search, User, Menu, X, ShoppingCart } from 'lucide-react';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, logout } = useAuthStore();
  const { user: userProfile, fetchUser } = useUserStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (authUser?.id) {
      fetchUser();
    }
  }, [authUser, fetchUser]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Optionally: pass searchTerm to a search handler
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false); // 💡 Optional UX improvement

  const navLinks = [
    { id: 'contactUs', href: userProfile?.id ? `/user/${userProfile.id}/contact` : '#', label: 'Contact Us' },
    { id: 'aboutUs', href: '/about', label: 'About Us' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: '-100%', transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-white md:bg-white dark:bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Links */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img className="h-10 md:h-12 w-auto shadow-sm" src="/logo.jpeg" alt="Logo" />
            </Link>
            <div className="hidden md:block ml-6 space-x-4">
              {navLinks.map((link) => (
                <NavLink key={link.id} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 hidden md:block">
            <div className="max-w-md mx-auto">
              <div className="relative text-gray-600">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white h-11 px-5 pr-10 rounded-full text-sm w-full dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Auth Buttons or User Info */}
          <div className="flex items-center">
            {userProfile ? (
              <div className="flex items-center">
                <Link
                  href={`/profile/${userProfile.id}/myprofile`}
                  className="ml-4 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition hover:bg-gray-100 rounded-full px-3 py-1"
                >
                  {userProfile.profile_image_url ? (
                    <img
                      src={userProfile.profile_image_url}
                      alt="User Avatar"
                      className="h-9 w-9 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                      {userProfile?.name ? userProfile.name[0].toUpperCase() : <User className="h-5 w-5" />}
                    </div>
                  )}
                  <span>{userProfile.name}</span>
                </Link>
                <Link href="/cart" className="ml-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition shadow-sm">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {userProfile ? (
                <div className="px-2 space-y-1">
                  <Link
                    href={`/profile/${userProfile.id}/myprofile`}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-2">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
