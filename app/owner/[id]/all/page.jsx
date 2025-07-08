"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useServiceStore } from "../../../store/ServiceStore";
import {
  PhotoIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* ... your existing skeleton UI ... */}
    </div>
  );
}

export default function ServicePageView() {
  const param = useParams();
  const userId = param.id;

  const { page, menus, loading, error, fetchServicePage, fetchMenus } =
    useServiceStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userId) {
      fetchServicePage();
      fetchMenus(userId);
    }
  }, [isClient, userId, fetchServicePage, fetchMenus]);

  if (!isClient || loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-red-50 p-6">
        <div className="flex flex-col items-center gap-4 text-red-700 bg-white p-8 rounded-xl shadow-lg">
          <ExclamationTriangleIcon className="h-12 w-12" />
          <h2 className="text-2xl font-bold">Failed to load service page</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-800">
          No Service Page Found
        </h3>
        <p className="mt-2 text-gray-500">
          It looks like you haven't created your service page yet.
        </p>
      </div>
    );
  }

  // Use menus fetched from API (fallback to page.menu if empty)
  const menuItems =
    Array.isArray(menus) && menus.length > 0
      ? menus
      : Array.isArray(page.menu)
      ? page.menu
      : [];

  return (
    <main className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Your Service Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            This is how customers will see your page.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Banner */}
            <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden">
              <div className="text-black text-2xl font-bold">Service Menu</div>
              {page.banner_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${page.banner_path}`}
                  alt="Service Banner"
                  className="w-full h-86 object-cover" // Adjusted height
                />
              ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400">
                  <PhotoIcon className="h-16 w-16" />
                  <span>No Banner Image</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-white p-8 rounded-xl shadow-md">
               <div className="text-black font-bold text-2xl">Service Menu</div>
              <article className="prose prose-lg max-w-none">
                
                {page.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: page.content.replace(/\n/g, "<br />"),
                    }}
                  />
                ) : (
                  <p className="italic text-gray-500">No content provided.</p>
                )}
              </article>
            </div>
          </div>

          <aside className="space-y-8 mt-12 lg:mt-0">
            {/* Logo */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Company Logo
              </h3>
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {page.logo_path ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${page.logo_path}`}
                    alt="Service Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Services & Menu
              </h3>
              {menuItems.length > 0 ? (
                <ul className="space-y-3">
                  {menuItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No menu items listed.
                </p>
              )}
            </div>

            {/* Details */}
            <div className="bg-white p-6 rounded-xl shadow-md text-sm text-gray-600 space-y-2">
              <p>
                <strong>Profile Created:</strong>{" "}
                {new Date(page.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(page.updated_at).toLocaleDateString()}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
