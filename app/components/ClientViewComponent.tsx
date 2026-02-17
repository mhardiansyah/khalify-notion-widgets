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
  profile, // Profil asli tetap bisa di-pass nanti kalau udah dinamis
  theme = "light",
  gridColumns = 3,
  isPro = false,
}: Props) {
  const [viewMode] = useState<"visual" | "map">("visual");
  
  // DIBUAT TRUE DEFAULT BIAR DUMMY BIO LANGSUNG MUNCUL
  const [showBio, setShowBio] = useState(true); 
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
      {/* 1. HEADER LOGO CENTERED */}
      <header className="w-full pt-6 pb-2 flex justify-center">
        <Image
          src="/logo-primary.png" // Ganti dengan path logo lo
          alt="Khlasify"
          width={110}
          height={28}
          priority
          className="select-none"
        />
      </header>

      <div className="max-w-[400px] sm:max-w-xl md:max-w-3xl mx-auto px-5">
        
        {/* 2. BIO SECTION (DUMMY DARI FOTO CANVA) */}
        {showBio && <DummyBioSection theme={currentTheme} />}

        {/* 3. ACTION BAR (REFRESH, FILTER, SETTING) */}
        {/* Posisi: Kiri, Tengah, Kanan persis seperti desain */}
        <div
          className={`sticky top-0 z-40 py-3 mb-6 flex items-center justify-between border-b backdrop-blur ${
            currentTheme === "light"
              ? "bg-white/90 border-gray-200"
              : "bg-[#1A2332]/90 border-[#2A3550]"
          }`}
        >
          {/* KIRI - Refresh */}
          <div className="flex-1 flex justify-start">
            <RefreshButton theme={currentTheme} />
          </div>

          {/* TENGAH - Filter Menu */}
          <div className="flex-1 flex justify-center relative">
            <IconButton
              theme={currentTheme}
              onClick={() => setShowFilterBar((s) => !s)}
            >
              <Menu size={20} />
            </IconButton>

            {/* Dropdown Filter */}
            {showFilterBar && (
              <div className="absolute top-full mt-3 z-50 w-64 -translate-x-1/2 left-1/2">
                <EmbedFilter theme={currentTheme} isPro={isPro} />
              </div>
            )}
          </div>

          {/* KANAN - Settings */}
          <div className="flex-1 flex justify-end relative">
            <IconButton
              theme={currentTheme}
              onClick={() => setOpenSetting((s) => !s)}
            >
              <Settings size={20} />
            </IconButton>

            {/* Dropdown Settings */}
            {openSetting && (
              <div
                className={`absolute right-0 top-full mt-3 z-50 w-60 rounded-2xl border shadow-xl overflow-hidden
                ${
                  currentTheme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-[#1F2A3C] border-[#2A3550]"
                }`}
              >
                <div className="p-2 space-y-1">
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
                      setCurrentTheme((t) => (t === "light" ? "dark" : "light"))
                    }
                  />
                </div>

                <div
                  className={`h-px ${
                    currentTheme === "light" ? "bg-gray-100" : "bg-[#2A3550]"
                  }`}
                />

                <div className="p-2">
                  {isPro ? (
                    <button
                      onClick={() => alert("Open customize bio")}
                      className={`w-full py-2.5 text-sm font-semibold rounded-xl transition ${
                        currentTheme === "light"
                          ? "text-purple-600 hover:bg-purple-50"
                          : "text-purple-400 hover:bg-[#24304A]"
                      }`}
                    >
                      Click here to customize your bio
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        window.open("https://khlasify.myr.id/pl/content-pro", "_blank")
                      }
                      className={`w-full py-2.5 text-sm font-semibold rounded-xl transition ${
                        currentTheme === "light"
                          ? "text-purple-600 hover:bg-purple-50"
                          : "text-purple-400 hover:bg-[#24304A]"
                      }`}
                    >
                      Upgrade to PRO
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. VISUAL GRID CONTENT */}
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

        {/* Modal Item */}
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
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg backdrop-blur ${
                currentTheme === "light"
                  ? "bg-white/90 text-gray-900 border border-gray-200"
                  : "bg-[#1F2A3C]/90 text-white border border-[#2A3550]"
              }`}
            >
              <p className="text-xs sm:text-sm font-medium">
                You’ve reached your free limit of{" "}
                <span className="font-semibold">9 posts</span>.
              </p>
              {isOverLimit && (
                <button
                  onClick={() =>
                    window.open("https://khlasify.myr.id/pl/content-pro", "_blank")
                  }
                  className="shrink-0 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
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

/* ================= UI COMPONENTS ================= */

// 🔥 INI KOMPONEN DUMMY BIO SESUAI FOTO CANVA LO 🔥
function DummyBioSection({ theme }: { theme: string }) {
  return (
    <div className="flex flex-col pt-6 pb-4 space-y-4">
      {/* Username */}
      <h1 className="text-2xl font-bold tracking-tight">username</h1>

      {/* Avatar Box (Bulat dengan border tipis) */}
      <div
        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center overflow-hidden ${
          theme === "light" ? "border-gray-200 bg-gray-50" : "border-gray-700 bg-gray-800"
        }`}
      >
        <span className="text-4xl">🧑🏻‍💻</span> {/* Dummy ilustrasi kacamata */}
      </div>

      {/* Nama & Deskripsi */}
      <div className="space-y-1.5 pt-1">
        <h2 className="text-lg font-semibold">Your Name</h2>
        
        <div
          className={`text-[15px] space-y-1 leading-relaxed ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          <p>🚀 Build efficient & friendly Notion workspaces.</p>
          <p>🔥 Minimalist setup, maximal productivity.</p>
          <p>🎁 FREE Notion Template! 👇</p>
        </div>
        
        <a
          href="#"
          className={`inline-flex items-center gap-1.5 text-[15px] font-medium pt-1 transition hover:opacity-70 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          🔗 khlasify.notion.site
        </a>
      </div>
    </div>
  );
}

function IconButton({ children, onClick, theme }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition
          ${theme === "light" ? "hover:bg-gray-100 text-gray-700" : "hover:bg-[#24304A] text-gray-300"}
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
        w-full px-3 py-2.5 flex items-center justify-between text-sm rounded-lg transition
        ${theme === "light" ? "hover:bg-gray-50 text-gray-700" : "hover:bg-[#24304A] text-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span className="font-medium">{label}</span>
      <span
        className={`w-10 h-6 rounded-full transition-colors ${
          value ? "bg-purple-500" : theme === "light" ? "bg-gray-200" : "bg-gray-600"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full translate-y-0.5 transition-transform shadow-sm ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
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
          className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition"
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