'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  XCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import Navbar from '../app/components/Navbar'; // Adjust the path if necessary
import { useUploadStore } from './store/useUploadStore';

/* --------------------------- Helper: format bytes --------------------------- */
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
export default function Home() {
  const {
    document: selectedFile,
    setDocument,
    submitRequest,
    loading,
    message,
  } = useUploadStore();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  /* ----------------------------- Toast handling ----------------------------- */
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  // Display a toast for 3 s whenever `message` changes
  useEffect(() => {
    if (!message) return;

    const isError = message.startsWith('Error:');
    const text = message.replace('Error: ', '');

    setToast({ show: true, text, type: isError ? 'error' : 'success' });

    const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  /* -------------------------- File‑handling helpers ------------------------- */
  const handleFileChange = (file) => file && setDocument(file);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const [file] = e.dataTransfer.files;
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setDocument(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitRequest();
    if (success) handleRemoveFile(); // clear file after successful upload
  };

  /* --------------------------------- Render -------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------------------------------- Navbar -------------------------------- */}
      <Navbar />

      {/* ------------------------------ Toast UI ------------------------------ */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <XCircleIcon className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------ Main page ------------------------------ */}
      <main className="flex justify-center items-start pt-16 sm:pt-24 px-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Become a Provider
              </h1>
              <p className="mt-2 text-gray-600">
                Please upload your certification document to begin the
                verification process.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ------------------------- Upload area / preview ------------------------- */}
              <AnimatePresence mode="wait">
                {!selectedFile ? (
                  /* Dropzone */
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
                        isDragging
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                      }`}
                    >
                      <ArrowUpTrayIcon
                        className={`h-12 w-12 transition-colors ${
                          isDragging ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      />
                      <p className="mt-4 text-lg font-semibold text-gray-700">
                        Drag & drop your file here
                      </p>
                      <p className="mt-1 text-sm text-gray-500">or click to browse</p>
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        disabled={loading}
                        className="hidden"
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Preview */
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentIcon className="h-8 w-8 text-indigo-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800 truncate max-w-xs sm:max-w-md">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatBytes(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={loading}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ----------------------------- Submit button ----------------------------- */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading || !selectedFile}
                  className="w-full sm:w-auto flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center transition-all duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
