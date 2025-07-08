'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  UsersIcon,
  ClockIcon,
  ServerStackIcon,
  ChevronRightIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

import { useUserStore } from '../../../store/userStore';
import { useProviderRequestStore } from '../../../store/useProviderRequestStore';
import { useServiceStore } from '../../../store/useServiceStore';

/**
 * A redesigned, more modern stat card.
 */
function StatCard({ title, value, Icon, colorName }) {
  const colorClasses = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };
  const { bg, text } = colorClasses[colorName] || { bg: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex items-center gap-6"
    >
      <div className={`p-4 rounded-full ${bg}`}>
        <Icon className={`h-8 w-8 ${text}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${text}`}>{value}</p>
      </div>
    </motion.div>
  );
}

/**
 * A new component to display a list of recent pending requests.
 */
function RecentRequestList({ requests }) {
  // Sort by creation date and take the most recent 5
  const recentPending = requests
    .filter((r) => r.status === 'pending')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (recentPending.length === 0) {
    return null; // Don't render the section if there are no pending requests
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Pending Requests</h2>
        <p className="text-sm text-gray-500 mt-1">Review the latest provider applications.</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {recentPending.map((request) => (
          <li key={request.id}>
            {/* THIS IS THE CORRECTED PART */}
            <Link 
              href="/admin/provider-requests"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-800">{request.user_email}</p>
                <p className="text-sm text-gray-500">
                  Applied on {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Dashboard() {
  const { fetchAllUsers, users, loading: usersLoading, error: usersError } = useUserStore();
  const { fetchRequests, requests, loading: requestsLoading, error: requestsError } = useProviderRequestStore();
  const { fetchAllPagesAdmin, pages, loading: servicesLoading, error: servicesError } = useServiceStore();

  useEffect(() => {
    fetchAllUsers();
    fetchRequests();
    fetchAllPagesAdmin();
  }, [fetchAllUsers, fetchRequests, fetchAllPagesAdmin]);

  const isLoading = usersLoading || requestsLoading || servicesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-lg text-gray-700">Loading Dashboard Data…</p>
        </div>
      </div>
    );
  }

  if (usersError || requestsError || servicesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="flex flex-col items-center gap-4 text-red-700 bg-white p-8 rounded-xl shadow-lg">
          <XCircleIcon className="h-12 w-12" />
          <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
          <div className="text-left text-sm space-y-1">
            {usersError && <p><strong>User Data Error:</strong> {usersError}</p>}
            {requestsError && <p><strong>Requests Data Error:</strong> {requestsError}</p>}
            {servicesError && <p><strong>Services Data Error:</strong> {servicesError}</p>}
          </div>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Derived data is calculated after the loading/error checks
  const nonAdminUsersCount = users?.filter((u) => u.role !== 'admin').length ?? 0;
  const serviceOwnersCount = users?.filter((u) => u.role === 'service_owner').length ?? 0;
  const pendingRequestsCount = requests?.filter((r) => r.status === 'pending').length ?? 0;
  const totalServicesCount = pages?.length ?? 0;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-md text-gray-600">
            A high-level overview of your platform's activity.
          </p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={nonAdminUsersCount}
            Icon={UserGroupIcon}
            colorName="indigo"
          />
          <StatCard
            title="Service Providers"
            value={serviceOwnersCount}
            Icon={UsersIcon}
            colorName="emerald"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequestsCount}
            Icon={ClockIcon}
            colorName="yellow"
          />
          <StatCard
            title="Total Services"
            value={totalServicesCount}
            Icon={ServerStackIcon}
            colorName="purple"
          />
        </section>

        {/* Actionable List */}
        <section>
          <RecentRequestList requests={requests} />
        </section>
      </div>
    </main>
  );
}