"use client";

import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  pinned: ["All Posts", "Pinned Only", "Unpinned Only"],
};

const defaultValue = {
  platform: "All Platform",
  status: "All Status",
  pillar: "All Pillars",
  pinned: "All Posts",
};

const orderedKeys = ["platform", "status", "pillar", "pinned"] as const;

export default function EmbedFilter({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const clearAll = () => {
    const newParams = new URLSearchParams();
    const db = params.get("db");
    if (db) newParams.set("db", db);
    router.push(`?${newParams.toString()}`);
  };

  const isActive = (key: string) =>
    current[key as keyof typeof current] !==
    defaultValue[key as keyof typeof defaultValue];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {orderedKeys.map((key) => {
            const value = current[key];

            return (
              <div key={key} className="relative w-full">
                <button
                  onClick={() => setOpen(open === key ? null : key)}
                  className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 border text-sm transition
                    ${
                      isActive(key)
                        ? theme === "light"
                          ? "bg-purple-50 border-purple-300 text-purple-700"
                          : "bg-purple-600/20 border-purple-500 text-purple-300"
                        : theme === "light"
                        ? "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                        : "bg-[#24304A] border-[#2A3550] text-gray-200 hover:bg-[#2E3A55]"
                    }
                  `}
                >
                  <span className="truncate flex-1">{value}</span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </button>

                {open === key && (
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
                        {key.toUpperCase()}
                      </div>

                      {filterOptions[key].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => updateFilter(key, opt)}
                          className={`w-full px-4 py-3 flex items-center justify-between text-sm
                            ${
                              value === opt
                                ? theme === "light"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-purple-600/20 text-purple-300"
                                : theme === "light"
                                ? "hover:bg-gray-100"
                                : "hover:bg-[#24304A]"
                            }
                          `}
                        >
                          <span>{opt}</span>
                          {value === opt && <span className="text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {activeCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className={`text-sm ${
                theme === "light"
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

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
                  <span className="capitalize">{key}</span>
                  <span className="truncate max-w-[120px]">
                    {current[key]}
                  </span>
                  <button
                    onClick={() => updateFilter(key, defaultValue[key])}
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
