/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin, X, ExternalLink, Settings, Menu } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
  isPro?: boolean;
}

/* ================= MAIN ================= */

export default function ClientViewComponent({
  filtered = [],
  profile,
  theme = "light",
  gridColumns = 3,
  isPro = false,
}: Props) {
  const [viewMode] = useState<"visual" | "map">("visual");
  const [showBio, setShowBio] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [showFilterBar, setShowFilterBar] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const params = useSearchParams();

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const bg =
    currentTheme === "light"
      ? "bg-white text-gray-900"
      : "bg-[#1A2332] text-white";

  const cardBg = currentTheme === "light" ? "bg-white" : "bg-[#1F2A3C]";

  /* ================= FILTER LOGIC ================= */

  const filteredData = filtered
    .filter((item) => {
      const platform = params.get("platform");
      const status = params.get("status");
      const pinned = params.get("pinned");

      const props = item.properties;

      if (props.Hide?.checkbox === true) return false;

      if (!hasAttachment(item)) return false;

      if (platform && platform !== "All Platform") {
        if (props.Platform?.select?.name !== platform) return false;
      }

      if (status && status !== "All Status") {
        if (props.Status?.select?.name !== status) return false;
      }

      if (pinned === "true" && props.Pinned?.checkbox !== true) return false;
      if (pinned === "false" && props.Pinned?.checkbox !== false) return false;

      return true;
    })
    .sort((a, b) => {
      const aPinned = a.properties?.Pinned?.checkbox ? 1 : 0;
      const bPinned = b.properties?.Pinned?.checkbox ? 1 : 0;
      return bPinned - aPinned;
    });

  const LIMIT_FREE = 9;

  const isOverLimit = !isPro && filteredData.length > LIMIT_FREE;
  const isExactlyLimit = !isPro && filteredData.length === LIMIT_FREE;

  const visibleData = isPro ? filteredData : filteredData.slice(0, LIMIT_FREE);

  /* ================= RENDER ================= */

  return (
    <main className={`${bg} min-h-screen w-full overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-5">
        {/* ================= HEADER ================= */}
        <header
          className={`sticky top-0 z-40 border-b backdrop-blur
    ${
      currentTheme === "light"
        ? "bg-white/80 border-gray-200"
        : "bg-[#1A2332]/90 border-[#2A3550]"
    }`}
        >
          <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-primary.png"
                alt="Khlasify"
                width={110}
                height={28}
                priority
                className="select-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <RefreshButton theme={currentTheme} />

              {/* FILTER */}
              <div className="relative">
                <IconButton
                  theme={currentTheme}
                  onClick={() => setShowFilterBar((s) => !s)}
                >
                  <Menu size={16} />
                </IconButton>

                {showFilterBar && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-56">
                    <EmbedFilter theme={currentTheme} isPro={isPro} />
                  </div>
                )}
              </div>

              {/* SETTINGS ✅ FIXED */}
              <div className="relative">
                <IconButton
                  theme={currentTheme}
                  onClick={() => setOpenSetting((s) => !s)}
                >
                  <Settings size={16} />
                </IconButton>

                {openSetting && (
                  <div
                    className={`absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border shadow overflow-hidden
                  ${
                    currentTheme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-[#1F2A3C] border-[#2A3550]"
                  }`}
                  >
                    <SettingToggle
                      theme={currentTheme}
                      label="Show Bio"
                      value={showBio}
                      disabled={!isPro}
                      onChange={() => setShowBio(!showBio)}
                    />

                    <SettingToggle
                      theme={currentTheme}
                      label="Show Highlight"
                      value={showHighlight}
                      disabled={!isPro}
                      onChange={() => setShowHighlight(!showHighlight)}
                    />

                    <SettingToggle
                      theme={currentTheme}
                      label="Dark Mode"
                      value={currentTheme === "dark"}
                      disabled={!isPro}
                      onChange={() =>
                        setCurrentTheme((t) =>
                          t === "light" ? "dark" : "light",
                        )
                      }
                    />

                    {/* DIVIDER */}
                    <div
                      className={`h-px my-1 ${
                        currentTheme === "light"
                          ? "bg-gray-200"
                          : "bg-[#2A3550]"
                      }`}
                    />

                    {/* 🔥 PRO CTA */}
                    {isPro ? (
                      <button
                        onClick={() => {
                          alert("Open customize bio");
                        }}
                        className={`
                      w-full py-3 text-sm font-semibold
                      transition
      ${
        currentTheme === "light"
          ? "text-purple-600 hover:bg-[#F9FAFB]"
          : "text-purple-400 hover:bg-[#24304A]"
      }
          `}
                      >
                        Click here to customize your bio
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          window.open(
                            "https://khlasify.myr.id/pl/content-pro",
                            "_blank",
                          );
                        }}
                        className={`
      w-full py-3 text-sm font-semibold
      transition
      ${
        currentTheme === "light"
          ? "text-purple-600 hover:bg-[#F9FAFB]"
          : "text-purple-400 hover:bg-[#24304A]"
      }
          `}
                      >
                        Upgrade to PRO
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <div className="pb-5 space-y-4 sm:space-y-6">
          {showBio && (
            <BioSection profile={profile} theme={currentTheme} />
          )}

          {showHighlight && profile?.highlights && (
            <HighlightSection
              highlights={profile.highlights}
              theme={currentTheme}
            />
          )}
        </div>

        {viewMode === "visual" && (
          <div className="relative">
            <VisualGrid
              filtered={visibleData}
              gridColumns={gridColumns}
              theme={currentTheme}
              cardBg={cardBg}
              onSelect={(item: any) => {
                if (!isPro) {
                  alert("Upgrade to PRO to view widget details");
                  return;
                }
                setSelectedItem(item);
              }}
            />
          </div>
        )}

        {selectedItem && (
          <DetailModal
            item={selectedItem}
            theme={currentTheme}
            onClose={() => setSelectedItem(null)}
          />
        )}

        {/* 🔔 FREE LIMIT BAR */}
        {(isExactlyLimit || isOverLimit) && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl">
            <div
              className={`
        flex items-center justify-between gap-3
        px-4 py-3 rounded-2xl shadow-lg
        backdrop-blur
        ${
          currentTheme === "light"
            ? "bg-white/90 text-gray-900 border border-gray-200"
            : "bg-[#1F2A3C]/90 text-white border border-[#2A3550]"
        }
      `}
            >
              {/* TEXT */}
              <p className="text-xs sm:text-sm font-medium">
                You’ve reached your free limit of{" "}
                <span className="font-semibold">9 posts</span>.
              </p>

              {/* BUTTON → HANYA JIKA > 9 */}
              {isOverLimit && (
                <button
                  onClick={() =>
                    window.open(
                      "https://khlasify.myr.id/pl/content-pro",
                      "_blank",
                    )
                  }
                  className="
            shrink-0
            px-4 py-1.5
            rounded-full
            bg-purple-600
            text-white
            text-xs
            font-semibold
            hover:bg-purple-700
            transition
          "
                >
                  Upgrade to PRO
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ================= UI ================= */

function IconButton({ children, onClick, theme }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full border transition
          ${theme === "light" ? "hover:bg-[#F9FAFB]" : "hover:bg-[#24304A]"}
        `}
    >
      {children}
    </button>
  );
}

function SettingToggle({ label, value, onChange, theme, disabled }: any) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange();
      }}
      className={`
        w-full px-4 py-3 flex items-center justify-between text-sm rounded-xl transition
        ${theme === "light" ? "hover:bg-[#F9FAFB]" : "hover:bg-[#24304A]"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
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

function BioSection({ profile, theme }: any) {
  // Gunakan data profile atau fallback ke dummy data jika kosong
  const username = profile?.username || "username";
  const name = profile?.name || "Your Name";
  const bioText = profile?.bio || "🚀 Build efficient & friendly Notion workspaces.\n🔥 Minimalist setup, maximal productivity.\n🎁 FREE Notion Template!👇";
  const link = "khlasify.notion.site";

  return (
    <section className="flex flex-col items-start gap-4 p-4 mt-6">
      <h1 className="text-xl font-bold">{username}</h1>
      
      {/* Avatar Container */}
      <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
         {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={name} className="w-full h-full object-cover" />
         ) : (
            // Fallback ilustrasi dari gambar yang kamu kasih
            <img src="/logo-primary.png" alt="Avatar" className="w-12 h-12 object-contain grayscale" /> 
         )}
      </div>

      <div className="flex flex-col gap-1 w-full text-left">
        <h2 className="text-base font-semibold">{name}</h2>
        
        {/* Render bio text, handling newlines */}
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {bioText}
        </div>
        
        {/* Link Section */}
        <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1 mt-1 hover:underline">
            <ExternalLink size={14} className="text-gray-500" />
            {link}
        </a>
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
          : "bg-[#1F2A3C] border-[#2A3550]"
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

function VisualGrid({ filtered, gridColumns, theme, cardBg, onSelect }: any) {
  return (
    <div
      className="grid gap-px"
      style={{
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
            className={`relative group overflow-hidden aspect-[4/5] cursor-pointer hover:-translate-y-1 transition ${cardBg}`}
          >
            {pinned && (
              <div
                className="absolute top-2.5 right-2.5 z-10
                  w-6 h-6 rounded-2xl
                  bg-black/40
                  flex items-center justify-center"
              >
                <Pin size={13} className="text-white" strokeWidth={2.2} />
              </div>
            )}

            <AutoThumbnail src={image} />
          </div>
        );
      })}
    </div>
  );
}

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
          theme === "light"
            ? "bg-gray-50 border-gray-200"
            : "bg-[#1F2A3C] border-[#2A3550]"
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
            <img
              src={image}
              alt={name}
              className="object-contain max-w-full max-h-[80vh]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function extractImage(item: any) {
  const p = item.properties;
  return (
    p.Attachment?.files?.[0]?.file?.url ||
    p.Attachment?.files?.[0]?.external?.url ||
    "/placeholder.png"
  );
}

function hasAttachment(item: any) {
  const files = item.properties?.Attachment?.files;
  if (!files || files.length === 0) return false;

  const first = files[0];
  return !!(first?.file?.url || first?.external?.url);
}