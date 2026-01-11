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
  const [open, setOpen] = useState<keyof typeof filterOptions | null>(null);

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

  const updateFilter = (key: keyof typeof filterOptions, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value === defaultValue[key]) {
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

  const isActive = (key: keyof typeof defaultValue) =>
    current[key] !== defaultValue[key];

  const activeCount = orderedKeys.filter(isActive).length;

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {orderedKeys.map((key) => {
            const value = current[key];

            return (
              <div key={key} className="w-full relative">
                <button
                  onClick={() => setOpen(open === key ? null : key)}
                  className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 border text-sm`}
                >
                  <span className="truncate flex-1">{value}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {open === key && (
                  <div
                    className="
        mt-2
        w-full
        rounded-xl
        border
        bg-white
        max-h-[40dvh]
        overflow-y-auto
        shadow-lg
      "
                  >
                    {filterOptions[key].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateFilter(key, opt)}
                        className={`w-full px-4 py-3 text-left text-sm ${
                          current[key] === opt
                            ? "bg-purple-50 text-purple-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
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
                  <span className="truncate max-w-[120px]">{current[key]}</span>
                  <button onClick={() => updateFilter(key, defaultValue[key])}>
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
