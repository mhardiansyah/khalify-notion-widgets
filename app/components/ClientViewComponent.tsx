/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin, X, ExternalLink, Settings, Menu } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";
import { useSearchParams } from "next/navigation";

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
  const [viewMode] = useState<"visual" | "map">("visual");
  const [showBio, setShowBio] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [openFilter, setOpenFilter] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const params = useSearchParams();

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const bg =
    currentTheme === "light" ? "bg-white text-gray-900" : "bg-black text-white";

  const cardBg = currentTheme === "light" ? "bg-white" : "bg-gray-900";

  /* ================= FILTER LOGIC ================= */

  const filteredData = filtered.filter((item) => {
    const platform = params.get("platform");
    const status = params.get("status");
    const pinned = params.get("pinned");

    const props = item.properties;

    if (platform && platform !== "All Platform") {
      if (props.Platform?.select?.name !== platform) return false;
    }

    if (status && status !== "All Status") {
      if (props.Status?.select?.name !== status) return false;
    }

    if (pinned === "true" && props.Pinned?.checkbox !== true) return false;

    if (pinned === "false" && props.Pinned?.checkbox !== false) return false;

    return true;
  });

  /* ================= RENDER ================= */

  return (
    <main className={`${bg} min-h-screen w-full`}>
      {/* ================= HEADER BAR ================= */}
      <header
        className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b backdrop-blur ${
          currentTheme === "light"
            ? "bg-white/80 border-gray-200"
            : "bg-black/70 border-gray-800"
        }`}
      >
        <span className="font-semibold text-sm">khaslify</span>

        <div className="flex items-center gap-2">
          {/* 🔥 REFRESH ICON */}
          <RefreshButton />

          <div className="relative">
            <IconButton onClick={() => setOpenFilter((s) => !s)}>
              <Menu size={16} />
            </IconButton>

            {openFilter && (
              <>
                {/* overlay */}
                <div
                  className="fixed inset-0 z-40 bg-black/30"
                  onClick={() => setOpenFilter(false)}
                />

                {/* DESKTOP / TABLET */}
                <div
                  className={`
        hidden sm:block
        fixed top-[64px] left-1/2 -translate-x-1/2
        z-50
        rounded-xl border shadow-xl
        max-w-[90vw]
        ${
          currentTheme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-900 border-gray-800"
        }
      `}
                >
                  <EmbedFilter />
                </div>

                {/* MOBILE BOTTOM SHEET */}
                <div
                  className={`
    sm:hidden
    mt-10
    fixed inset-x-0 bottom-0 z-50
    max-h-[85dvh]
    rounded-t-2xl
    shadow-2xl
    flex flex-col
    ${
      currentTheme === "light"
        ? "bg-white border-t border-gray-200"
        : "bg-gray-900 border-gray-800"
    }
  `}
                >
                  {/* handle */}
                  <div className="w-12 h-1.5 bg-gray-400/40 rounded-full mt-10 mx-auto my-3" />

                  {/* scroll area */}
                  <div className="flex-1 overflow-y-auto px-3 pb-6">
                    <EmbedFilter />
                  </div>
                </div>
              </>
            )}
          </div>

          <IconButton onClick={() => setOpenSetting((s) => !s)}>
            <Settings size={16} />
          </IconButton>
        </div>
      </header>

      {openSetting && (
        <div
          className={`absolute right-4 top-14 z-50 w-56 rounded-xl border shadow ${
            currentTheme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-900 border-gray-800"
          }`}
        >
          <SettingToggle
            label="Show Bio"
            value={showBio}
            onChange={() => setShowBio(!showBio)}
          />
          <SettingToggle
            label="Show Highlight"
            value={showHighlight}
            onChange={() => setShowHighlight(!showHighlight)}
          />
          <SettingToggle
            label="Dark Mode"
            value={currentTheme === "dark"}
            onChange={() =>
              setCurrentTheme((t) => (t === "light" ? "dark" : "light"))
            }
          />
        </div>
      )}

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

        {viewMode === "visual" && (
          <VisualGrid
            filtered={filteredData}
            gridColumns={gridColumns}
            theme={currentTheme}
            cardBg={cardBg}
            onSelect={setSelectedItem}
          />
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

/* ================= UI SMALL ================= */

function IconButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {children}
    </button>
  );
}

function SettingToggle({ label, value, onChange }: any) {
  return (
    <button
      onClick={onChange}
      className="w-full px-4 py-3 flex items-center justify-between text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span>{label}</span>
      <span
        className={`w-9 h-5 rounded-full transition ${
          value ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full translate-y-0.5 transition ${
            value ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
    </button>
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
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
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
            onClick={() => onSelect(item)}
            className={`relative group  overflow-hidden aspect-[4/5] cursor-pointer hover:-translate-y-1 transition ${cardBg}`}
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
              <ExternalLink size={16} />
              Open Original
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
