/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin, X, ExternalLink, Tag } from "lucide-react";
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
  theme?: "light" | "dark";
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
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const bg =
    currentTheme === "light" ? "bg-white text-gray-900" : "bg-black text-white";

  const cardBg = currentTheme === "light" ? "bg-white" : "bg-gray-900";

  return (
    <main className={`${bg} min-h-screen w-full flex flex-col`}>
      {/* ================= HEADER ================= */}
      <div
        className={`sticky top-0 z-30 px-5 py-4 border-b backdrop-blur-md ${
          currentTheme === "light"
            ? "bg-white/80 border-gray-200"
            : "bg-black/70 border-gray-800"
        }`}
      >
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() =>
              setCurrentTheme((t) => (t === "light" ? "dark" : "light"))
            }
            className={`px-4 py-2 rounded-full text-xs ring-1
      ${
        currentTheme === "dark"
          ? "bg-gray-800 text-white ring-gray-600"
          : "bg-gray-100 text-gray-900 ring-gray-300"
      }`}
          >
            {currentTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

          <RefreshButton />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border overflow-hidden text-xs">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 ${
                viewMode === "visual"
                  ? "bg-gray-900 text-white"
                  : "bg-transparent"
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 ${
                viewMode === "map" ? "bg-gray-900 text-white" : "bg-transparent"
              }`}
            >
              Map
            </button>
          </div>

          <div className="flex gap-2">
            <ToggleChip
              label="Show bio"
              active={showBio}
              onClick={() => setShowBio(!showBio)}
              theme={currentTheme}
            />
            <ToggleChip
              label="Show highlight"
              active={showHighlight}
              onClick={() => setShowHighlight(!showHighlight)}
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
        {showBio && profile && (
          <BioSection profile={profile} theme={currentTheme} />
        )}

        {showHighlight && profile?.highlights && (
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
            onSelect={setSelectedItem}
          />
        ) : (
          <MapViewGrid filtered={filtered} />
        )}
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          theme={currentTheme}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
}

/* ================= SECTIONS ================= */

function BioSection({ profile, theme }: any) {
  return (
    <section
      className={`border rounded-2xl p-4 flex gap-4 ${
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

function HighlightSection({ highlights, theme }: any) {
  return (
    <section
      className={`border rounded-2xl p-4 ${
        theme === "light"
          ? "bg-gray-50 border-gray-200"
          : "bg-gray-900 border-gray-800"
      }`}
    >
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

function VisualGrid({ filtered, gridColumns, theme, cardBg, onSelect }: any) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
    >
      {filtered.map((item: any, i: number) => {
        const name =
          item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
        const image = extractImage(item);
        const pinned = item.properties?.Pinned?.checkbox;

        return (
          <div
            key={i}
            onClick={() => onSelect(item)}
            className={`relative group rounded-xl overflow-hidden aspect-[4/5] cursor-pointer
              hover:-translate-y-1 transition ${cardBg}`}
          >
            {pinned && (
              <Pin className="absolute top-3 right-3 text-yellow-400 z-10" />
            )}

            <AutoThumbnail src={image} />

            <div
              className={`absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t ${
                theme === "light" ? "from-black/70" : "from-black/80"
              }`}
            >
              <p className="text-white text-xs">{name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MapViewGrid({ filtered }: any) {
  const colors = ["bg-[#A3A18C]", "bg-[#CFC6A8]", "bg-[#9FA29A]"];

  return (
    <div className="grid grid-cols-3 gap-px bg-gray-200">
      {filtered.map((item: any, i: number) => (
        <div
          key={i}
          className={`aspect-square flex items-center justify-center ${
            colors[i % colors.length]
          }`}
        >
          <h3 className="text-white text-sm text-center px-3">
            {item.properties?.Name?.title?.[0]?.plain_text}
          </h3>
        </div>
      ))}
    </div>
  );
}

/* ================= UI ================= */

function ToggleChip({ label, active, onClick, theme }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] border ${
        active
          ? "bg-purple-600 border-purple-600 text-white"
          : theme === "light"
          ? "bg-white border-gray-300"
          : "bg-black border-gray-700 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

/* ================= MODAL ================= */

function DetailModal({ item, theme, onClose }: any) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const name = item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
  const image = extractImage(item);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl rounded-2xl overflow-hidden ${
          theme === "light" ? "bg-white" : "bg-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 bg-black flex items-center justify-center">
            <img src={image} alt={name} className="object-contain h-full" />
          </div>

          <div className="lg:w-1/3 p-6 space-y-4">
            <h2 className="text-xl font-semibold">{name}</h2>

            <button className="w-full bg-purple-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
              <ExternalLink size={16} /> Open Original
            </button>
          </div>
        </div>
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
