/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";

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
  profile?: Profile;
  theme?: "light" | "dark";
  gridColumns?: number;
}

export default function ClientViewComponent({
  filtered,
  profile,
  theme = "light",
  gridColumns = 4,
}: Props) {
  const [viewMode, setViewMode] = useState<"visual" | "map">("visual");

  // 🔥 Update: kalau ga ada profile, hide bio & highlight
  const [showBio, setShowBio] = useState(!!profile);
  const [showHighlight, setShowHighlight] = useState(
    !!profile?.highlights?.length
  );

  const bg =
    theme === "light" ? "bg-white text-gray-900" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const subtleBorder =
    theme === "light" ? "border-gray-200" : "border-gray-800";

  return (
    <main className={`${bg} min-h-screen w-full flex flex-col`}>
      {/* TOP BAR / HEADER */}
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

        {/* CONTROLS ROW */}
        <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
          {/* View Toggle */}
          <div className="inline-flex rounded-full border text-xs overflow-hidden">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 transition ${
                viewMode === "visual"
                  ? theme === "light"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-black"
                  : theme === "light"
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
                  ? theme === "light"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-black"
                  : theme === "light"
                  ? "bg-white text-gray-700"
                  : "bg-black text-gray-300"
              }`}
            >
              Map View
            </button>
          </div>

          {/* Toggles show bio / highlight */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <ToggleChip
              label="Show bio"
              active={showBio}
              onClick={() => setShowBio((prev) => !prev)}
              theme={theme}
              disabled={!profile}
            />
            <ToggleChip
              label="Show highlight"
              active={showHighlight}
              onClick={() => setShowHighlight((prev) => !prev)}
              theme={theme}
              disabled={!profile?.highlights?.length}
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-4">
          <EmbedFilter />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-5 space-y-6">
        {/* BIO SECTION */}
        {showBio && profile && <BioSection profile={profile} theme={theme} />}

        {/* HIGHLIGHT SECTION */}
        {showHighlight &&
          profile?.highlights &&
          profile.highlights.length > 0 && (
            <HighlightSection highlights={profile.highlights} theme={theme} />
          )}

        {/* MAIN CONTENT */}
        {viewMode === "visual" ? (
          <VisualGrid
            filtered={filtered}
            gridColumns={gridColumns}
            theme={theme}
            cardBg={cardBg}
          />
        ) : (
          <MapViewList
            filtered={filtered}
            theme={theme}
            borderColor={subtleBorder}
          />
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
    theme === "light" ? "border-gray-200 bg-white" : "border-gray-800 bg-gray-900";

  return (
    <section
      className={`w-full border ${border} rounded-2xl p-4 md:p-5 flex items-start gap-4 md:gap-5`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name || "avatar"}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
            {profile.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Bio text */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base md:text-lg font-semibold">
            {profile.name || "Unnamed Creator"}
          </h2>

          {profile.username && (
            <span className="text-xs text-gray-500">
              {profile.username.startsWith("@")
                ? profile.username
                : `@${profile.username}`}
            </span>
          )}

          <span className="inline-flex items-center text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
            Creator Highlight
          </span>
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
  const bg =
    theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-900 border-gray-800";

  return (
    <section className={`w-full border ${bg} rounded-2xl p-3 md:p-4`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
          Highlights
        </p>
        <span className="text-[11px] text-gray-400">{highlights.length} saved</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {highlights.map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[75px]">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
              {h.image ? (
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-500">
                  +
                </div>
              )}
            </div>
            <p className="text-[11px] text-center text-gray-600 line-clamp-2">
              {h.title || "Untitled"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- VISUAL GRID ---------------- */

function VisualGrid({
  filtered,
  gridColumns,
  theme,
  cardBg,
}: {
  filtered: any[];
  gridColumns: number;
  theme: "light" | "dark";
  cardBg: string;
}) {
  return (
    <section>
      <div
        className={`grid gap-4`}
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
        }}
      >
        {filtered.map((item: any, i: number) => {
          const name =
            item.properties?.Name?.title?.[0]?.plain_text || "Untitled";

          const url = extractImage(item);
          const isPinned = item.properties?.Pinned?.checkbox === true;

          return (
            <div
              key={i}
              className={`
                relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl 
                transition-all duration-300 aspect-[4/5] ${cardBg}
              `}
            >
              {isPinned && (
                <div className="absolute top-3 right-3 z-30">
                  <Pin
                    className="w-5 h-5 text-yellow-400 drop-shadow-lg"
                    fill="yellow"
                  />
                </div>
              )}

              <AutoThumbnail src={url} />

              <div
                className={`absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 
                  transition-all duration-300 bg-gradient-to-t 
                  ${
                    theme === "light" ? "from-black/80" : "from-black/60"
                  } to-transparent`}
              >
                <p className="text-white text-xs font-medium line-clamp-2">
                  {name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- MAP VIEW LIST ---------------- */

function MapViewList({
  filtered,
  theme,
  borderColor,
}: {
  filtered: any[];
  theme: "light" | "dark";
  borderColor: string;
}) {
  const rowBgHover =
    theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-900";

  return (
    <section className="space-y-2">
      {filtered.map((item: any, i: number) => {
        const name =
          item.properties?.Name?.title?.[0]?.plain_text || "Untitled";

        const platform =
          item.properties?.Platform?.select?.name || "-";
        const status =
          item.properties?.Status?.status?.name ||
          item.properties?.Status?.select?.name ||
          item.properties?.Status?.multi_select?.[0]?.name ||
          "-";
        const pillar =
          item.properties?.["Content Pillar"]?.select?.name || "-";

        const isPinned = item.properties?.Pinned?.checkbox === true;
        const url = extractImage(item);

        return (
          <div
            key={i}
            className={`flex items-center gap-3 border ${borderColor} rounded-xl p-3 text-sm ${rowBgHover} transition`}
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0">
              <AutoThumbnail src={url} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isPinned && (
                  <Pin
                    className="w-4 h-4 text-yellow-400"
                    fill="yellow"
                  />
                )}
                <p className="font-medium truncate">{name}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                <span className="px-2 py-0.5 rounded-full bg-gray-100">
                  {platform}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100">
                  {status}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100">
                  {pillar}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ---------------- CHIP COMPONENT ---------------- */

function ToggleChip({
  label,
  active,
  onClick,
  theme,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  theme: "light" | "dark";
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] transition
        ${
          active
            ? "bg-purple-600 border-purple-600 text-white"
            : theme === "light"
            ? "bg-white border-gray-300 text-gray-700"
            : "bg-black border-gray-700 text-gray-300"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
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
  const isVideoUrl = (url: string) => /(mp4|mov|avi|webm|mkv)/i.test(url);

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;
    if (url?.includes("canva.com")) return "/canva-rejected.png";
    if (isVideoUrl(url)) return url;
    return url;
  }

  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText?.includes("canva.com")) return "/canva-rejected.png";
  if (linkText) return linkText;

  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl?.includes("canva.com")) return "/canva-rejected.png";
  if (canvaUrl) return canvaUrl;

  return "/placeholder.png";
}
