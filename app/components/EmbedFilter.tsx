"use client";

import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// 🔥 PERBAIKAN: Gunakan format dictionary dengan keys lowercase (camelCase)
// Nilai string disesuaikan dengan ejaan di screenshot
const filterLabels = {
  platform: {
    all: "All Platform",
    instagram: "instagram", // Sesuaikan nama label dengan value dari notion API (lowercase)
    tiktok: "tiktok",
    youtube: "youtube",
    others: "others",
  },
  status: {
    all: "All Status",
    idea: "idea",
    scripting: "scripting",
    editing: "editing",
    review: "review",
    revision: "revision",
    upload: "upload",
    completed: "completed"
  },
  pillar: {
    all: "All Pillars",
    education: "education",
    entertainment: "entertainment",
    promotional: "promotional",
    "story telling": "story telling",
    bts: "bts",
    testimonial: "testimonial"
  },
  pinned: {
    all: "All Posts",
    true: "Pinned Only",
    false: "Unpinned Only"
  }
};

const defaultValue = {
  platform: "all",
  status: "all",
  pillar: "all",  
  pinned: "all",
};

const orderedKeys = ["platform", "status", "pillar", "pinned"] as const; 

   export function EmbedFilter({ // <-- Perhatikan nama function tidak diexport default jika diletakkan dalam satu file
  theme = "light",
  isPro = false,
}: {
  theme?: "light" | "dark";
  isPro?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);

  // Ambil state saat ini dari URL param, pastikan dalam format lowercase (sesuai defaultValue)
  const current = {
    platform: params.get("platform")?.toLowerCase() ?? defaultValue.platform,
    status: params.get("status")?.toLowerCase() ?? defaultValue.status,
    pillar: params.get("pillar")?.toLowerCase() ?? defaultValue.pillar,
    pinned: params.get("pinned")?.toLowerCase() ?? defaultValue.pinned,
  };

  const updateFilter = (key: string, rawValue: string) => {
    if (!isPro) return;

    const newParams = new URLSearchParams(params.toString());

    if (rawValue === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, rawValue); // Simpan nilai raw (lowercase) ke URL param
    }

    router.push(`?${newParams.toString()}`);
    setOpen(null);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const clearAll = () => {
    if (!isPro) return;

    const newParams = new URLSearchParams();
    const db = params.get("db");
    if (db) newParams.set("db", db);
    router.push(`?${newParams.toString()}`);
  };

  const isActive = (key: keyof typeof current) =>
    current[key] !== defaultValue[key];

  const activeCount = orderedKeys.filter(isActive).length;

  return (
    <div className="w-full">
      <div
        className={`rounded-xl p-3 sm:p-4 space-y-3 border ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-[#1F2A3C] border-[#2A3550] text-white"
        }`}
      >
        <div className="grid grid-cols-1 gap-2">
          {orderedKeys.map((key) => {
            const currentRawValue = current[key];
            
            // Ambil text label untuk ditampilkan di button dropdown utama
            let displayValue = currentRawValue;
            if (key === 'pinned') {
                // @ts-ignore
                displayValue = filterLabels[key]?.[currentRawValue] || currentRawValue;
            } else {
                 // Untuk dropdown lain, huruf awalnya dibesarkan untuk tampilan (Capitalize)
                 displayValue = currentRawValue === 'all' 
                     // @ts-ignore
                     ? filterLabels[key]?.all 
                     : currentRawValue.replace(/\b\w/g, l => l.toUpperCase());
            }

            return (
              <div key={key} className="relative w-full">
                <button
                  disabled={!isPro}
                  onClick={() => {
                    if (!isPro) return;
                    setOpen(open === key ? null : key);
                  }}
                  className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 border text-sm transition
                    ${
                      isActive(key)
                        ? theme === "light"
                          ? "bg-purple-50 border-purple-300 text-purple-700"
                          : "bg-purple-600/20 border-purple-500 text-purple-300"
                        : theme === "light"
                          ? "bg-gray-200 border-gray-300 text-gray-500"
                          : "bg-[#2A3550] border-[#2A3550] text-gray-400"
                    }
                    ${!isPro ? "cursor-not-allowed opacity-60" : ""}
                  `}
                >
                  <span className="truncate flex-1">{displayValue}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 ${!isPro ? "opacity-50" : ""}`}
                  />
                </button>

                {open === key && isPro && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpen(null)}
                    />

                    <div
                      className={`absolute z-50 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden ${
                        theme === "light"
                          ? "bg-white border-gray-200"
                          : "bg-[#1F2A3C] border-[#2A3550]"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 text-xs font-semibold border-b ${
                          theme === "light"
                            ? "text-gray-400 border-gray-200"
                            : "text-gray-400 border-[#2A3550]"
                        }`}
                      >
                        {key === "pinned" ? "POSTS" : key.toUpperCase()}
                      </div>

                      {Object.entries(filterLabels[key]).map(([optKey, optLabel]) => {
                          // Pastikan membandingkan lowercase (kecuali pinned yang butuh "true"/"false")
                          const isSelected = currentRawValue === optKey;

                          // Format label options untuk list dropdown
                          let finalOptLabel = optLabel;
                          if (key !== 'pinned' && optKey !== 'all') {
                             finalOptLabel = optKey.replace(/\b\w/g, l => l.toUpperCase());
                          }

                          return (
                            <button
                              key={optKey}
                              onClick={() => updateFilter(key, optKey)}
                              className={`w-full px-4 py-3 flex items-center justify-between text-sm
                                ${
                                  isSelected
                                    ? theme === "light"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-purple-600/20 text-purple-300"
                                    : theme === "light"
                                      ? "hover:bg-[#F9FAFB]"
                                      : "hover:bg-[#24304A]"
                                }
                              `}
                            >
                              <span>{finalOptLabel}</span>
                              {isSelected && <span className="text-xs">✓</span>}
                            </button>
                          )
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!isPro && (
          <>
            <div
              className={`h-px my-3 ${
                theme === "light" ? "bg-gray-200" : "bg-[#2A3550]"
              }`}
            />

            <button
              onClick={() => {
                window.open("https://khlasify.myr.id/pl/content-pro", "_blank");
              }}
              className="w-full py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition rounded-2xl"
            >
              Upgrade to PRO
            </button>
          </>
        )}

        {activeCount > 0 && (
          <div className="flex justify-end">
            <button
              disabled={!isPro}
              onClick={clearAll}
              className={`text-sm ${
                !isPro
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "light"
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-400 hover:text-white"
              }`}
            >
              Clear all
            </button>
          </div>
        )}

        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {orderedKeys.map(
              (key) =>
                isActive(key) && (
                  <div
                    key={key}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      theme === "light"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-purple-600/20 text-purple-300"
                    }`}
                  >
                    <span className="capitalize">{key === "pinned" ? "post" : key}</span>
                    <span className="truncate max-w-[120px]">
                      {/* @ts-ignore */}
                      {key === 'pinned' ? filterLabels[key]?.[current[key]] : (current[key] === 'all' ? filterLabels[key]?.all : current[key].replace(/\b\w/g, l => l.toUpperCase()))}
                    </span>
                    <button
                      disabled={!isPro}
                      onClick={() =>
                        isPro && updateFilter(key, "all")
                      }
                      className={!isPro ? "cursor-not-allowed opacity-50" : ""}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}