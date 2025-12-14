/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";

/* ================= TYPES ================= */

type Highlight = {
  title: string;
  image?: string;
};

type Profile = {
  name?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  highlights?: Highlight[];
};

interface Props {
  filtered: any[];
  profile?: Profile | null;
  theme?: "light" | "dark"; // initial theme dari server
  gridColumns?: number;
}

/* ================= MAIN ================= */

export default function ClientViewComponent({
  filtered = [],
  profile,
  theme = "light",
  gridColumns = 3,
}: Props) {
  const [viewMode, setViewMode] = useState<"visual" | "map">("visual");
  const [showBio, setShowBio] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);

  /* sync kalau theme dari server berubah */
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  /* ================= THEME STYLES ================= */

  const bg =
    currentTheme === "light" ? "bg-white text-gray-900" : "bg-black text-white";

  const cardBg = currentTheme === "light" ? "bg-white" : "bg-gray-900";

  const subtleBorder =
    currentTheme === "light" ? "border-gray-200" : "border-gray-800";

  return (
    <main className={`${bg} min-h-screen w-full flex flex-col`}>
      {/* ================= TOP BAR ================= */}
      <div
        className={`sticky top-0 z-30 px-5 py-4 border-b backdrop-blur-md ${
          currentTheme === "light"
            ? "bg-white/80 border-gray-200"
            : "bg-black/70 border-gray-800"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              Creator Gallery
            </h1>
            <p className="text-xs text-gray-500">
              Curated content from your Notion database
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentTheme((t) => (t === "light" ? "dark" : "light"))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium
    transition shadow-sm ring-1 mr-5
    ${
      currentTheme === "dark"
        ? "bg-gray-800 text-white ring-gray-600 hover:bg-gray-700"
        : "bg-gray-100 text-gray-900 ring-gray-300 hover:bg-gray-200"
    }
  `}
          >
            <span className="text-sm">
              {currentTheme === "dark" ? "🌙" : "☀️"}
            </span>
            <span>{currentTheme === "dark" ? "Dark mode" : "Light mode"}</span>
          </button>
            <RefreshButton />
        </div>

        {/* ================= CONTROLS ================= */}
        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="inline-flex rounded-full border text-xs overflow-hidden">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 transition ${
                viewMode === "visual"
                  ? "bg-gray-900 text-white"
                  : currentTheme === "light"
                  ? "bg-white text-gray-700"
                  : "bg-black text-gray-300"
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 transition ${
                viewMode === "map"
                  ? "bg-gray-900 text-white"
                  : currentTheme === "light"
                  ? "bg-white text-gray-700"
                  : "bg-black text-gray-300"
              }`}
            >
              Map View
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <ToggleChip
              label="Show bio"
              active={showBio}
              onClick={() => setShowBio((v) => !v)}
              theme={currentTheme}
            />
            <ToggleChip
              label="Show highlight"
              active={showHighlight}
              onClick={() => setShowHighlight((v) => !v)}
              theme={currentTheme}
            />
          </div>
        </div>

        <div className="mt-4">
          <EmbedFilter />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5 space-y-6">
        {showBio && profile && (profile.bio || profile.name) && (
          <BioSection profile={profile} theme={currentTheme} />
        )}

        {showHighlight &&
          profile?.highlights &&
          profile.highlights.length > 0 && (
            <HighlightSection
              highlights={profile.highlights}
              theme={currentTheme}
            />
          )}

        {viewMode === "visual" ? (
          <VisualGrid
            filtered={filtered}
            gridColumns={gridColumns}
            theme={currentTheme}
            cardBg={cardBg}
          />
        ) : (
          <MapViewGrid filtered={filtered} />
        )}
      </div>
    </main>
  );
}

/* ================= BIO ================= */

function BioSection({
  profile,
  theme,
}: {
  profile: Profile;
  theme: "light" | "dark";
}) {
  return (
    <section
      className={`w-full border rounded-2xl p-4 flex gap-4 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-900 border-gray-800"
      }`}
    >
      <div className="w-16 h-16 rounded-full bg-gray-300" />
      <div>
        <h2 className="font-semibold">{profile.name}</h2>
        {profile.bio && (
          <p className="text-xs text-gray-500 mt-1">{profile.bio}</p>
        )}
      </div>
    </section>
  );
}

/* ================= HIGHLIGHT ================= */

function HighlightSection({
  highlights,
  theme,
}: {
  highlights: Highlight[];
  theme: "light" | "dark";
}) {
  return (
    <section
      className={`border rounded-2xl p-4 ${
        theme === "light"
          ? "bg-gray-50 border-gray-200"
          : "bg-gray-900 border-gray-800"
      }`}
    >
      <div className="flex gap-3 overflow-x-auto">
        {highlights.map((h, i) => (
          <div key={i} className="min-w-[72px] text-center">
            <div className="w-14 h-14 rounded-full bg-gray-300 mx-auto mb-1" />
            <p className="text-[11px]">{h.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= VISUAL GRID ================= */

function VisualGrid({ filtered, gridColumns, theme, cardBg }: any) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      }}
    >
      {filtered.map((item: any, i: number) => {
        const name =
          item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
        const image = extractImage(item);
        const pinned = item.properties?.Pinned?.checkbox;

        return (
          <div
            key={i}
            className={`relative group rounded-xl overflow-hidden aspect-[4/5] ${cardBg}`}
          >
            {pinned && (
              <Pin className="absolute top-3 right-3 text-yellow-400" />
            )}

            <AutoThumbnail src={image} />

            <div
              className={`absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t ${
                theme === "light" ? "from-black/70" : "from-black/80"
              } to-transparent`}
            >
              <p className="text-white text-xs">{name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= MAP VIEW ================= */

function MapViewGrid({ filtered }: any) {
  const colors = ["bg-[#A3A18C]", "bg-[#CFC6A8]", "bg-[#9FA29A]"];

  return (
    <div className="grid grid-cols-3 gap-px bg-gray-200">
      {filtered.map((item: any, i: number) => {
        const name =
          item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
        const pillar = item.properties?.["Content Pillar"]?.select?.name || "";
        const pinned = item.properties?.Pinned?.checkbox;

        return (
          <div
            key={i}
            className={`relative group aspect-square flex items-center justify-center ${
              colors[i % colors.length]
            }`}
          >
            {pinned && <Pin className="absolute top-3 right-3 text-white" />}
            <h3 className="text-white text-sm text-center px-4">{name}</h3>
            <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-[11px] uppercase">{pillar}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= CHIP ================= */

function ToggleChip({ label, active, onClick, theme }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-[11px] ${
        active
          ? "bg-purple-600 border-purple-600 text-white"
          : theme === "light"
          ? "bg-white border-gray-300 text-gray-700"
          : "bg-black border-gray-700 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

/* ================= IMAGE ================= */

function extractImage(item: any) {
  const p = item.properties;
  return (
    p.Attachment?.files?.[0]?.file?.url ||
    p.Attachment?.files?.[0]?.external?.url ||
    "/placeholder.png"
  );
}
