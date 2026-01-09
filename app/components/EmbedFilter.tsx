"use client";

import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const filterOptions = {
  platform: ["All Platform", "Instagram", "Tiktok", "Others"],
  status: ["All Status", "Not started", "In progress", "Done"],
  pillar: [
    "All Pillars",
    "Tips and How to",
    "Client Wins",
    "Offer and Service",
    "Other",
    "Behind the Scenes",
  ],
  pinned: ["Pinned", "Pinned Only", "Unpinned Only"],
};

const defaultValue = {
  platform: "All Platform",
  status: "All Status",
  pillar: "All Pillars",
  pinned: "Pinned",
};

export default function EmbedFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);

  const current = {
    platform: params.get("platform") ?? defaultValue.platform,
    status: params.get("status") ?? defaultValue.status,
    pillar: params.get("pillar") ?? defaultValue.pillar,
    pinned:
      params.get("pinned") === "true"
        ? "Pinned Only"
        : params.get("pinned") === "false"
        ? "Unpinned Only"
        : defaultValue.pinned,
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value === defaultValue[key as keyof typeof defaultValue]) {
      newParams.delete(key);
    } else {
      if (key === "pinned") {
        newParams.set(
          key,
          value === "Pinned Only"
            ? "true"
            : value === "Unpinned Only"
            ? "false"
            : "all"
        );
      } else {
        newParams.set(key, value);
      }
    }

    router.push(`?${newParams.toString()}`);
    setOpen(null);
  };

  const clearAll = () => {
    const newParams = new URLSearchParams();
    const db = params.get("db");
    if (db) newParams.set("db", db);
    router.push(`?${newParams.toString()}`);
  };

  const isActive = (key: string) =>
    current[key as keyof typeof current] !==
    defaultValue[key as keyof typeof defaultValue];

  const activeCount = Object.keys(current).filter(isActive).length;

  return (
    <div className="mb-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        {/* FILTER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(current).map(([key, value]) => (
            <div key={key} className="relative w-full">
              <button
                onClick={() => setOpen(open === key ? null : key)}
                className={`
                  w-full px-4 py-2 rounded-lg
                  flex items-center gap-3
                  border text-sm transition
                  ${
                    isActive(key)
                      ? "bg-purple-50 border-purple-300 text-purple-700"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="truncate">{value}</span>
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              </button>

              {open === key && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(null)}
                  />
                  <div
  className="
    fixed z-50
    bg-white border border-gray-200 shadow-xl
    overflow-y-auto

    left-1/2 -translate-x-1/2
    w-[92vw]
    rounded-2xl

    /* real mobile safe area */
    top-[20vh]
    max-h-[calc(var(--vh)*70)]

    /* desktop */
    sm:absolute
    sm:top-full
    sm:left-0
    sm:mt-2
    sm:w-full
    sm:max-h-64
    sm:rounded-xl
  "
>
                    {filterOptions[key as keyof typeof filterOptions].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => updateFilter(key, opt)}
                          className={`
                            w-full px-4 py-2 text-left text-sm transition
                            ${
                              value === opt
                                ? "bg-purple-50 text-purple-700"
                                : "hover:bg-gray-100"
                            }
                          `}
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* CLEAR ALL */}
        {activeCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(current).map(
            ([key, value]) =>
              isActive(key) && (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  <span className="capitalize">{key}</span>
                  <span className="truncate max-w-[120px]">{value}</span>
                  <button
                    onClick={() =>
                      updateFilter(
                        key,
                        defaultValue[key as keyof typeof defaultValue]
                      )
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
