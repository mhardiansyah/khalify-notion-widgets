"use client";

import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Portal from "./Portal";

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

const orderedKeys = ["platform", "status", "pillar", "pinned"] as const;

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
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {orderedKeys.map((key) => {
            const value = current[key];

            return (
              <div key={key} className="w-full">
                <button
                  onClick={() => setOpen(open === key ? null : key)}
                  className={`
                    w-full px-3 py-1.5 sm:px-4 sm:py-2
                    rounded-lg flex items-center gap-2
                    border text-[13px] sm:text-sm transition
                    ${
                      isActive(key)
                        ? "bg-purple-50 border-purple-300 text-purple-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="truncate flex-1">{value}</span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </button>

                {open === key && (
                 <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(null)}
      />

      {/* modal */}
      <div className="relative w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
        {filterOptions[key].map((opt) => (
          <button
            key={opt}
            onClick={() => updateFilter(key, opt)}
            className={`w-full px-4 py-2 text-left text-sm ${
              value === opt
                ? "bg-purple-50 text-purple-700"
                : "hover:bg-gray-100"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  </Portal>
                )}
              </div>
            );
          })}
        </div>

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

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {orderedKeys.map(
            (key) =>
              isActive(key) && (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  <span className="capitalize">{key}</span>
                  <span className="truncate max-w-[120px]">
                    {current[key]}
                  </span>
                  <button
                    onClick={() =>
                      updateFilter(key, defaultValue[key])
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
