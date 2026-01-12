"use client";

import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  type FilterKey = keyof typeof filterOptions;
  const [open, setOpen] = useState<FilterKey | null>(null);

  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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
        {/* 🔥 MOBILE = 1 COL | DESKTOP = GRID */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orderedKeys.map((key) => {
            const value = current[key];

            return (
              <div key={key} className="relative w-full">
                {/* ===== DESKTOP BUTTON (TETAP) ===== */}
                <button
                  ref={triggerRef}
                  onClick={() => {
                    if (!triggerRef.current) return;
                    const rect = triggerRef.current.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const spaceAbove = rect.top;

                    setPosition(
                      spaceBelow < 260 && spaceAbove > spaceBelow
                        ? "top"
                        : "bottom"
                    );
                    setOpen(open === key ? null : key);
                  }}
                  className={`
                    hidden sm:flex
                    w-full px-4 py-2 rounded-lg
                    items-center justify-between
                    border text-sm transition
                    ${
                      isActive(key)
                        ? "bg-purple-50 border-purple-300 text-purple-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="truncate">{value}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* ===== MOBILE CARD ===== */}
                <button
                  onClick={() => setOpen(key)}
                  className={`
                    sm:hidden
                    w-full px-4 py-3 rounded-xl
                    flex items-center justify-between
                    border
                    ${
                      isActive(key)
                        ? "bg-purple-50 border-purple-300 text-purple-700"
                        : "bg-gray-50 border-gray-300"
                    }
                  `}
                >
                  <span className="font-medium truncate">{value}</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>

                {/* ===== DESKTOP DROPDOWN ===== */}
                {open === key && (
                  <div
                    className={`
                      hidden sm:block
                      absolute z-50 w-full
                      bg-white rounded-xl shadow-xl
                      max-h-[260px] overflow-y-auto
                      ${
                        position === "bottom"
                          ? "mt-2 top-full"
                          : "mb-2 bottom-full"
                      }
                    `}
                  >
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

      {/* ===== MOBILE BOTTOM SHEET ===== */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            onClick={() => setOpen(null)}
          />

          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto sm:hidden">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <h3 className="text-sm font-semibold capitalize mb-3">
              {open}
            </h3>

            {filterOptions[open].map((opt) => (
              <button
                key={opt}
                onClick={() => updateFilter(open, opt)}
                className="w-full px-4 py-3 rounded-lg text-left hover:bg-gray-100"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

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
