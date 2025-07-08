"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useServiceStore } from "../../../store/ServiceStore";
import {
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

/* ---------- ImageUploader ---------- */
function ImageUploader({ label, currentImageUrl, onFileChange, onRemove }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 flex items-center gap-5">
        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <PhotoIcon className="h-10 w-10 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
          >
            {preview ? "Change" : "Upload Image"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ---------- TagInput (name only) ---------- */
function TagInput({ value, onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const name = inputValue.trim();
    if (!name) return;
    if (value.some((t) => t.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...value, { name }]);
    setInputValue("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const remove = (name) => onChange(value.filter((t) => t.name !== name));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Menu Items
      </label>

      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Name"
          className="flex-grow p-1 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white">
        {value.map(({ name }) => (
          <span
            key={name}
            className="flex items-center gap-1.5 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full"
          >
            {name}
            <button
              type="button"
              onClick={() => remove(name)}
              className="text-indigo-500 hover:text-indigo-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- ServicePageForm ---------- */
export default function ServicePageForm() {
  const router = useRouter();
  const { id: ownerId } = useParams();

  const {
    page,
    fetchServicePage,
    fetchMenus,
    menus,
    savePage,
    createMenu,
    loading,
    error,
    success,
    resetStatus,
  } = useServiceStore();

  const [content, setContent] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const isFormPopulated = useRef(false);

  /* fetch on mount / ownerId change */
  useEffect(() => {
    if (!ownerId) return;
    fetchServicePage();
    fetchMenus(ownerId);
    return resetStatus; // clean up on unmount
  }, [ownerId, fetchServicePage, fetchMenus, resetStatus]);

  /* populate local state once page arrives */
  useEffect(() => {
    if (page && !isFormPopulated.current) {
      setContent(page.content || "");
      setMenuItems(Array.isArray(page.menu) ? page.menu : []);
      isFormPopulated.current = true;
    }
  }, [page]);

  /* whenever menus arrive, prefer them over page.menu */
  useEffect(() => {
    if (Array.isArray(menus) && menus.length) {
      setMenuItems(menus);
    }
  }, [menus]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /* ensure backend menus exist */
      await Promise.all(
        menuItems.map((item) => createMenu(ownerId, { name: item.name }))
      );

      const fd = new FormData();
      fd.append("content", content);
      logo && fd.append("logo", logo);
      banner && fd.append("banner", banner);

      const ok = await savePage(fd);
      if (ok) router.push(`/owner/${ownerId}/all`);
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  /* ---------- Render ---------- */
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {page ? "Edit Your Service Page" : "Create Your Service Page"}
          </h1>
          <p className="mt-2 text-md text-gray-600">
            This is your public‑facing page. Fill it out to attract customers.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg space-y-8"
        >
          {/* alerts */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-3 p-4 rounded-lg text-sm font-medium ${
                  error ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
                }`}
              >
                {error ? (
                  <ExclamationCircleIcon className="h-5 w-5" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}
                <span>
                  {typeof error === "string"
                    ? error
                    : error?.message || "Page saved successfully! Redirecting..."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Page Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your service, your history, what makes you special..."
              className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <hr />
          <TagInput value={menuItems} onChange={setMenuItems} />
          <hr />

          {/* images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              label="Logo Image"
              currentImageUrl={
                page?.logo_path
                  ? `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${page.logo_path}`
                  : null
              }
              onFileChange={setLogo}
              onRemove={() => setLogo(null)}
            />
            <ImageUploader
              label="Banner Image"
              currentImageUrl={
                page?.banner_path
                  ? `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${page.banner_path}`
                  : null
              }
              onFileChange={setBanner}
              onRemove={() => setBanner(null)}
            />
          </div>

          {/* submit */}
          <div className="pt-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-6 py-2.5 transition-all disabled:bg-indigo-400"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" />
                  {page ? "Update Page" : "Create Page"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
