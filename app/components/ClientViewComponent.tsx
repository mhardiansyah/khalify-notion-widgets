/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";
import { section } from "framer-motion/client";

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

export default function ClientViewComponent({
  filtered,
  profile,
  theme = "light",
  gridColumns = 3,
}: Props) {
  const [viewMode, setViewMode] = useState<"visual" | "map">("visual");
  const [showBio, setShowBio] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);

  useEffect(() => {
    console.log("PROFILE RECEIVED:", profile);
  }, [profile]);

  const bg =
    theme === "light" ? "bg-white text-gray-900" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const subtleBorder =
    theme === "light" ? "border-gray-200" : "border-gray-800";

  return (
    <main className={`${bg} min-h-screen w-full flex flex-col`}>
      {/* TOP BAR */}
      <div
        className={`sticky top-0 z-30 px-5 py-4 border-b backdrop-blur-md ${
          theme === "light"
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

          <div className="flex items-center gap-2">
            <RefreshButton />
          </div>
        </div>

        {/* CONTROL ROW */}
        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="inline-flex rounded-full border text-xs overflow-hidden">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 transition ${
                viewMode === "visual"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 transition ${
                viewMode === "map"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Map View
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <ToggleChip
              label="Show bio"
              active={showBio}
              onClick={() => setShowBio((prev) => !prev)}
              theme={theme}
            />
            <ToggleChip
              label="Show highlight"
              active={showHighlight}
              onClick={() => setShowHighlight((prev) => !prev)}
              theme={theme}
            />
          </div>
        </div>

        <div className="mt-4">
          <EmbedFilter />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-5 space-y-6">
        {/* BIO SECTION */}
        {showBio && profile && (profile.bio || profile.name) && (
          <BioSection profile={profile} theme={theme} />
        )}

        {/* HIGHLIGHTS SECTION */}
        {showHighlight &&
          profile?.highlights &&
          profile.highlights.length > 0 && (
            <HighlightSection highlights={profile.highlights} theme={theme} />
          )}

        {viewMode === "visual" ? (
          <VisualGrid
            filtered={filtered}
            gridColumns={gridColumns}
            theme={theme}
            cardBg={cardBg}
          />
        ) : (
          <MapViewGrid filtered={filtered} />
        )}
      </div>
    </main>
  );
}

/* ---------------- BIO SECTION ---------------- */

function BioSection({
  profile,
  theme,
}: {
  profile: Profile;
  theme: "light" | "dark";
}) {
  const border =
    theme === "light"
      ? "border-gray-200 bg-white"
      : "border-gray-800 bg-gray-900";

  return (
    <section
      className={`w-full border ${border} rounded-2xl p-4 md:p-5 flex items-start gap-4 md:gap-5`}
    >
      {/* AVATAR */}
      <div className="shrink-0">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center  text-gray-500">
            {profile.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-semibold">
            {profile.name || "Untitled Creator"}
          </h2>
          {profile.username && (
            <span className="text-xs text-gray-500">
              {profile.username.startsWith("@")
                ? profile.username
                : "@" + profile.username}
            </span>
          )}
        </div>

        {profile.bio && (
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------------- HIGHLIGHT SECTION ---------------- */

function HighlightSection({
  highlights,
  theme,
}: {
  highlights: Highlight[];
  theme: "light" | "dark";
}) {
  return (
    <section
      className={`w-full border rounded-2xl ${
        theme === "light"
          ? "bg-gray-50 border-gray-200"
          : "bg-gray-900 border-gray-800"
      } p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
          Highlights
        </p>

        <span className="text-[11px] text-gray-400">
          {highlights.length} saved
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 min-w-[70px]"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border bg-gray-100">
              {h.image ? (
                <img src={h.image} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  +
                </div>
              )}
            </div>
            <p className="text-[11px] line-clamp-2 text-center text-gray-600">
              {h.title || "Untitled"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- GRID + MAP VIEW (SAMA, TAK DIUBAH) ---------------- */

function VisualGrid({ filtered, gridColumns, theme, cardBg }: any) {
  return (
    <section>
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
          const isPinned = item.properties?.Pinned?.checkbox;

          return (
            <div
              key={i}
              className={`relative group rounded-xl overflow-hidden shadow hover:shadow-xl transition ${cardBg} aspect-[4/5]`}
            >
              {isPinned && (
                <div className="absolute top-3 right-3 z-10">
                  <Pin className="w-5 h-5 text-yellow-400" fill="yellow" />
                </div>
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
    </section>
  );
}

function MapViewGrid({ filtered }: any) {
  const colors = [
    "bg-[#A3A18C]",
    "bg-[#CFC6A8]",
    "bg-[#9FA29A]",
    "bg-[#B8B8B8]",
    "bg-[#4B4F3E]",
    "bg-[#AEB7B6]",
  ];

  return (
    <section
      className="grid gap-px bg-gray-200"
      style={{
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      }}
    >
      {filtered.map((item: any, i: number) => {
        const name =
          item.properties?.Name?.title?.[0]?.plain_text || "Untitled";

        const pillar =
          item.properties?.["Content Pillar"]?.select?.name || "";

        const isPinned = item.properties?.Pinned?.checkbox;
        const bgColor = colors[i % colors.length];

        return (
          <div
            key={i}
            className={`relative group aspect-square ${bgColor} flex items-center justify-center text-center p-6 overflow-hidden`}
          >
            {/* PIN */}
            {isPinned && (
              <Pin className="absolute top-3 right-3 w-4 h-4 text-white opacity-80 z-10" />
            )}

            {/* TITLE (always visible) */}
            <h3 className="relative z-10 text-white font-semibold text-2xl leading-snug max-w-[90%]">

              {name}
            </h3>

            {/* HOVER OVERLAY (same pattern as VisualGrid) */}
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-[15px] uppercase tracking-wide">
               Content Pillar: {pillar}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}


/* ---------------- SMALL CHIP ---------------- */

function ToggleChip({ label, active, onClick, theme }: any) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] ${
        active
          ? "bg-purple-600 border-purple-600 text-white"
          : theme === "light"
          ? "bg-white border-gray-300 text-gray-700"
          : "bg-black border-gray-700 text-gray-300"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-white" : "bg-gray-400"
        }`}
      />
      {label}
    </button>
  );
}

/* ---------------- IMAGE EXTRACTOR ---------------- */

function extractImage(item: any) {
  const props = item.properties;

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;
    return url;
  }

  if (props["*Link"]?.rich_text?.length > 0) {
    return props["*Link"].rich_text[0].plain_text;
  }

  if (props["*Canva Link"]?.url) {
    return props["*Canva Link"].url;
  }

  return "/placeholder.png";
}
