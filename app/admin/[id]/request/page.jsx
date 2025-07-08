'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useProviderRequestStore } from '../../../store/useProviderRequestStore';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

/* ----------------------------- Status Badge ----------------------------- */
function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      Icon: ClockIcon,
      label: 'Pending',
    },
    approved: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      Icon: CheckCircleIcon,
      label: 'Approved',
    },
    rejected: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      Icon: XCircleIcon,
      label: 'Rejected',
    },
    default: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      Icon: null,
      label: status,
    },
  };

  const { bgColor, textColor, Icon, label } = statusConfig[status] || statusConfig.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bgColor} ${textColor}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </span>
  );
}

/* ------------------------- Main Admin Component ------------------------- */
export default function AdminProviderRequests() {
  const { requests, loading, error, fetchRequests, handleRequest } = useProviderRequestStore();

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  /* ---------- Success / Error Alert ---------- */
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const triggerAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type }), duration);
  };

  /* ------------------------ Fetch requests on mount ------------------------ */
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* -------------- Close the action menu when clicking outside -------------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ------------------------- Loading and Error states ------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin h-6 w-6 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-lg text-gray-700">Loading Provider Requests…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <XCircleIcon className="h-8 w-8" />
          <p className="font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ---------------------------- Toast Alert ---------------------------- */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg
            ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {alert.type === 'success' ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{alert.message}</span>
        </div>
      )}

      {/* ------------------------------ Main UI ------------------------------ */}
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Provider Requests</h1>
            <p className="mt-1 text-md text-gray-600">
              Review, approve, or reject new provider applications.
            </p>
          </header>

          {requests.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No provider requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no pending or completed requests.
              </p>
            </div>
          ) : (
            /* Requests list */
            <section className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col md:flex-row items-start md:items-center gap-4"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-grow">
                    <UserCircleIcon className="h-12 w-12 text-gray-400 flex-shrink-0" />
                    <div>
                      <a
                        href={`mailto:${r.user_email}`}
                        className="font-semibold text-gray-900 hover:text-indigo-600"
                      >
                        {r.user_email}
                      </a>
                    </div>
                  </div>

                  {/* Document & Status */}
                  <div className="flex items-center gap-4 mt-3 md:mt-0 flex-shrink-0">
                    {/* View Document Button */}
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${r.document_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      View Document
                    </a>

                    {/* Status Badge */}
                    <StatusBadge status={r.status} />
                  </div>

                  {/* Actions & Timestamps */}
                  <div className="flex items-center gap-4 mt-3 md:mt-0 ml-auto md:ml-0 flex-shrink-0">
                    {/* Created / Updated at */}
                    <div className="text-xs text-gray-500 text-right hidden sm:block">
                      <p title={new Date(r.created_at).toLocaleString()}>
                        Created: {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      <p title={new Date(r.updated_at).toLocaleString()}>
                        Updated: {new Date(r.updated_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                        disabled={r.status !== 'pending'}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:text-gray-300 disabled:hover:bg-transparent"
                      >
                        <span className="sr-only">Open actions</span>
                        <EllipsisVerticalIcon className="h-6 w-6" />
                      </button>

                      {openMenuId === r.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                        >
                          <div className="py-1">
                            {/* Approve */}
                            <button
                              onClick={() => {
                                handleRequest(r.id, 'approve');
                                setOpenMenuId(null);
                                triggerAlert('Request approved successfully!', 'success');
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                            >
                              <CheckIcon className="h-5 w-5 text-green-500" />
                              Approve
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() => {
                                handleRequest(r.id, 'reject');
                                setOpenMenuId(null);
                                triggerAlert('Request rejected.', 'error');
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-800"
                            >
                              <XMarkIcon className="h-5 w-5 text-red-500" />
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
