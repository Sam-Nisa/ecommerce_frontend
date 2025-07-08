'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserIcon as UserRoleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { useUserStore } from '../../../store/userStore';

/**
 * A more descriptive and visually distinct role badge.
 */
function RoleBadge({ role }) {
  const roleConfig = {
    service_owner: {
      label: 'Provider',
      classes: 'bg-emerald-100 text-emerald-800',
      Icon: ShieldCheckIcon,
    },
    user: {
      label: 'User',
      classes: 'bg-blue-100 text-blue-800',
      Icon: UserRoleIcon,
    },
    default: {
      label: role,
      classes: 'bg-gray-100 text-gray-800',
      Icon: UserRoleIcon,
    },
  };

  const { label, classes, Icon } = roleConfig[role] || roleConfig.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

/**
 * A responsive, card-based component for displaying a single user.
 */
function UserCard({ user, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
    >
      {/* User Info (Name, Email, Avatar) */}
      <div className="flex items-center gap-4 col-span-1">
        <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0" />
        <div className="truncate">
          <p className="font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Role */}
      <div className="flex justify-start md:justify-center col-span-1">
        <RoleBadge role={user.role} />
      </div>

      {/* ID (hidden on mobile)
      <div className="hidden md:flex justify-end col-span-1">
        <p className="font-mono text-xs text-gray-500">ID: {user.id}</p>
      </div> */}
    </motion.div>
  );
}


export default function UsersPage() {
  const { user, users, loading, error, fetchUser, fetchAllUsers } = useUserStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllUsers();
    }
  }, [user, fetchAllUsers]);

  const nonAdminUsers = useMemo(() => users?.filter((u) => u.role !== 'admin') ?? [], [users]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return nonAdminUsers;
    const lowercasedSearch = search.toLowerCase();
    return nonAdminUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(lowercasedSearch) ||
        u.email?.toLowerCase().includes(lowercasedSearch)
    );
  }, [nonAdminUsers, search]);

  if (loading && !users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p className="text-lg text-gray-700">Loading Users...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
            <div>
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
                <h2 className="mt-2 text-xl font-semibold text-gray-800">Authentication Required</h2>
                <p className="mt-1 text-gray-600">Please log in to view this page.</p>
            </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
            <div>
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-2 text-xl font-semibold text-gray-800">Access Denied</h2>
                <p className="mt-1 text-gray-600">You do not have permission to view this page.</p>
            </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-8 text-center space-y-4 shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Users</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Users</h1>
            <p className="mt-1 text-md text-gray-600">
              Manage and search through all registered users.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </header>

        <div className="space-y-4">
            {/* Header for the list - hidden on mobile */}
            <div className="hidden md:grid grid-cols-3 items-center gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>User</span>
                <span className="text-center">Role</span>
            </div>
            {/* User List */}
            <div className="space-y-3">
            {filteredUsers.length > 0 ? (
                filteredUsers.map((u, idx) => <UserCard key={u.id} user={u} index={idx} />)
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {search ? "Your search didn't return any results." : "There are no users to display."}
                    </p>
                </div>
            )}
            </div>
        </div>
      </div>
    </main>
  );
}