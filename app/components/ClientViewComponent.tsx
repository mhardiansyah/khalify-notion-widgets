/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin, X, ExternalLink, Settings, Menu, ChevronRight } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";
import { useSearchParams, useRouter } from "next/navigation";

/* ================= FILTER CONFIG ================= */

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

/* ================= MAIN ================= */

export default function ClientViewComponent({
  filtered = [],
  profile,
  theme = "light",
  gridColumns = 3,
}: any) {
  const params = useSearchParams();
  const router = useRouter();

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [showBio, setShowBio] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);

  const [openFilter, setOpenFilter] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
    const q = new URLSearchParams(params.toString());

    if (value === defaultValue[key as keyof typeof defaultValue]) {
      q.delete(key);
    } else {
      if (key === "pinned") {
        q.set(
          key,
          value === "Pinned Only"
            ? "true"
            : value === "Unpinned Only"
            ? "false"
            : "all"
        );
      } else {
        q.set(key, value);
      }
    }

    router.push(`?${q.toString()}`);
    setActiveKey(null);
    setOpenFilter(false);
  };

  const filteredData = filtered.filter((item: any) => {
    const p = item.properties;
    if (current.platform !== "All Platform" && p.Platform?.select?.name !== current.platform) return false;
    if (current.status !== "All Status" && p.Status?.select?.name !== current.status) return false;
    if (params.get("pinned") === "true" && p.Pinned?.checkbox !== true) return false;
    if (params.get("pinned") === "false" && p.Pinned?.checkbox !== false) return false;
    return true;
  });

  /* ================= RENDER ================= */

  return (
    <main className={`${currentTheme === "light" ? "bg-white text-gray-900" : "bg-black text-white"} min-h-screen`}>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 px-4 py-3 flex justify-between border-b bg-white/80 backdrop-blur">
        <span className="font-semibold text-sm">khaslify</span>

        <div className="flex gap-2">
          <RefreshButton />

          <IconButton onClick={() => setOpenFilter(true)}>
            <Menu size={16} />
          </IconButton>

          <IconButton onClick={() => setOpenSetting((s) => !s)}>
            <Settings size={16} />
          </IconButton>
        </div>
      </header>

      {/* ================= FILTER ================= */}
      {openFilter && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpenFilter(false)} />

          {/* DESKTOP */}
          <div className="hidden sm:block fixed top-[64px] left-1/2 -translate-x-1/2 z-50">
            <EmbedFilter />
          </div>

          {/* MOBILE – SETTINGS STYLE */}
          <div className="sm:hidden fixed inset-x-0 bottom-0 top-2 z-50 bg-white rounded-t-2xl flex flex-col">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

            <div className="px-4 space-y-2">
              {Object.keys(current).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveKey(key)}
                  className="w-full px-4 py-3 rounded-xl border flex justify-between items-center text-sm bg-gray-50"
                >
                  <span className="capitalize">{key}</span>
                  <span className="flex items-center gap-2 text-gray-500">
                    {current[key as keyof typeof current]}
                    <ChevronRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= OPTION SHEET ================= */}
      {activeKey && (
        <div className="fixed inset-0 z-[60] bg-black/30">
          <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 space-y-2">
            {filterOptions[activeKey as keyof typeof filterOptions].map((opt) => (
              <button
                key={opt}
                onClick={() => updateFilter(activeKey, opt)}
                className="w-full py-3 text-left rounded-lg hover:bg-gray-100"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="p-5 space-y-6">
        {showBio && profile && <BioSection profile={profile} />}
        {showHighlight && profile?.highlights && (
          <HighlightSection highlights={profile.highlights} />
        )}

        <VisualGrid
          filtered={filteredData}
          gridColumns={gridColumns}
          onSelect={setSelectedItem}
        />
      </div>

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </main>
  );
}

/* ================= UI ================= */

function IconButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-full border"
    >
      {children}
    </button>
  );
}

/* ================= SECTIONS ================= */

function BioSection({ profile }: any) {
  return (
    <section className="border rounded-2xl p-4 flex gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-300" />
      <div>
        <h2 className="font-semibold">{profile.name}</h2>
        <p className="text-xs text-gray-500">{profile.bio}</p>
      </div>
    </section>
  );
}

function HighlightSection({ highlights }: any) {
  return (
    <section className="border rounded-2xl p-4">
      <div className="flex gap-3 overflow-x-auto">
        {highlights.map((h: any, i: number) => (
          <div key={i} className="min-w-[72px] text-center">
            <div className="w-14 h-14 rounded-full bg-gray-300 mx-auto mb-1" />
            <p className="text-[11px]">{h.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= GRID ================= */

function VisualGrid({ filtered, gridColumns, onSelect }: any) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
    >
      {filtered.map((item: any, i: number) => (
        <div
          key={i}
          onClick={() => onSelect(item)}
          className="relative aspect-[4/5] bg-gray-200 rounded-xl overflow-hidden cursor-pointer"
        >
          <AutoThumbnail src={extractImage(item)} />
        </div>
      ))}
    </div>
  );
}

/* ================= MODAL ================= */

function DetailModal({ item, onClose }: any) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>
        <img src={extractImage(item)} className="w-full rounded-lg" />
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function extractImage(item: any) {
  const p = item.properties;
  return (
    p.Attachment?.files?.[0]?.file?.url ||
    p.Attachment?.files?.[0]?.external?.url ||
    "/placeholder.png"
  );
}
