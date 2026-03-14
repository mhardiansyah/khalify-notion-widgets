/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
// 🔥 Tambahkan Link2 di sini untuk icon link di bio
import {
  Pin,
  X,
  ExternalLink,
  Settings,
  Menu,
  Link2,
  ChevronDown,
  UserIcon,
} from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import RefreshButton from "./RefreshButton";
import { EmbedFilter } from "./EmbedFilter";

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
  link?: string;
  highlights?: Highlight[];
};

interface Props {
  filtered: any[];
  profile?: Profile | null;
  theme?: "light" | "dark";
  gridColumns?: number;
  isPro?: boolean;
}

/* ================= FUNGSI SAPU JAGAT ================= */
function getNotionValues(prop: any): string[] {
  if (!prop) return [];
  
  if (prop.select && prop.select.name) return [prop.select.name];
  if (prop.multi_select) return prop.multi_select.map((s: any) => s.name);
  if (prop.status && prop.status.name) return [prop.status.name];
  if (prop.rich_text) return prop.rich_text.map((t: any) => t.plain_text);
  if (prop.title) return prop.title.map((t: any) => t.plain_text);
  
  if (prop.type === "rollup" && prop.rollup && prop.rollup.array) {
    let results: string[] = [];
    prop.rollup.array.forEach((item: any) => {
       if (item.type) {
           results = results.concat(getNotionValues({ [item.type]: item[item.type] }));
       } else {
           results = results.concat(getNotionValues(item));
       }
    });
    return results;
  }
  
  return [];
}

function getProp(propsObj: any, key: string) {
  if (!propsObj) return null;
  if (propsObj[key]) return propsObj[key];
  const foundKey = Object.keys(propsObj).find(
    (k) => k.trim().toLowerCase() === key.toLowerCase(),
  );
  return foundKey ? propsObj[foundKey] : null;
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
      : "bg-[#191919] text-white";

  const cardBg = currentTheme === "light" ? "bg-white" : "bg-[#222222]";

  /* ================= FILTER LOGIC ================= */

  const filteredData = filtered
    .filter((item) => {
      // 🔥 BERSAIHKAN PARAM URL: Hapus '+' dan spasi ekstra
      const platformParam = params.get("platform")?.replace(/\+/g, " ").trim().toLowerCase();
      const statusParam = params.get("status")?.replace(/\+/g, " ").trim().toLowerCase();
      const pillarParam = params.get("pillar")?.replace(/\+/g, " ").trim().toLowerCase();
      const pinnedParam = params.get("pinned"); 

      const props = item.properties;

      // Ambil kolom pake fungsi anti-typo
      const hideProp = getProp(props, "Hide");
      const platformProp = getProp(props, "Platform");
      const statusProp = getProp(props, "Status");
      const pillarProp = getProp(props, "Pillar");
      const pinnedProp = getProp(props, "Pinned");

      if (hideProp?.checkbox === true) return false;

      // 1. Filter Platform
      if (platformParam && platformParam !== "all") {
        const platformVals = getNotionValues(platformProp).map(v => v.trim().toLowerCase());
        if (!platformVals.includes(platformParam)) return false;
      }

      // 2. Filter Status
      if (statusParam && statusParam !== "all") {
        const statusVals = getNotionValues(statusProp).map(v => v.trim().toLowerCase());
        if (!statusVals.includes(statusParam)) return false;
      }

      // 3. Filter Pillar
      if (pillarParam && pillarParam !== "all") {
        const pillarVals = getNotionValues(pillarProp).map(v => v.trim().toLowerCase());
        if (!pillarVals.includes(pillarParam)) return false;
      }

      // 4. Filter Pinned
      if (pinnedParam === "true" && pinnedProp?.checkbox !== true) return false;
      if (pinnedParam === "false" && pinnedProp?.checkbox !== false) return false;

      return true;
    })
    .sort((a, b) => {
      const aPinned = getProp(a.properties, "Pinned")?.checkbox ? 1 : 0;
      const bPinned = getProp(b.properties, "Pinned")?.checkbox ? 1 : 0;
      return bPinned - aPinned;
    });

  const LIMIT_FREE = 9;

  const isOverLimit = !isPro && filteredData.length > LIMIT_FREE;
  const isExactlyLimit = !isPro && filteredData.length === LIMIT_FREE;

  const visibleData = isPro ? filteredData : filteredData.slice(0, LIMIT_FREE);

  const displayUsername = profile?.username || "";

  const isFilterActive = 
    (params.get("platform") && params.get("platform")?.toLowerCase() !== "all") ||
    (params.get("status") && params.get("status")?.toLowerCase() !== "all") ||
    (params.get("pillar") && params.get("pillar")?.toLowerCase() !== "all") ||
    (params.get("pinned") && params.get("pinned")?.toLowerCase() !== "all");

  const shouldHideHighlight = isFilterActive && visibleData.length < 3;

  const hasContentToRender = showBio || (showHighlight && !shouldHideHighlight);

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
        : "bg-[#191919]/90 border-[#333333]" 
    }`}
        >
          <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPro && displayUsername.trim() !== "" ? (
                <span className="font-bold text-lg tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                  {displayUsername}
                </span>
              ) : (
                <Image
                  src="/logo-primary.png"
                  alt="Khlasify"
                  width={110}
                  height={28}
                  priority
                  className="select-none"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <RefreshButton theme={currentTheme} />

              {/* FILTER */}
              <div className="relative">
                <IconButton
                  theme={currentTheme}
                  onClick={() => {
                    setShowFilterBar((s) => !s);
                    setOpenSetting(false);
                  }}
                >
                  <Menu size={16} />
                </IconButton>

                {showFilterBar && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-56">
                    <EmbedFilter theme={currentTheme} isPro={isPro} rawData={filtered} />
                  </div>
                )}
              </div>

              {/* SETTINGS */}
              <div className="relative">
                <IconButton
                  theme={currentTheme}
                  onClick={() => {
                    setOpenSetting((s) => !s);
                    setShowFilterBar(false);
                  }}
                >
                  <Settings size={16} />
                </IconButton>

                {openSetting && (
                  <div
                    className={`absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border shadow overflow-hidden
                  ${
                    currentTheme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-[#222222] border-[#333333]" 
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

                    <div
                      className={`h-px my-1 ${
                        currentTheme === "light"
                          ? "bg-gray-200"
                          : "bg-[#333333]" 
                      }`}
                    />

                    {/* PRO CTA */}
                    <div className="px-2 pb-2 pt-1">
                        {isPro ? (
                          <button
                            onClick={() => {
                              window.open(
                                "https://widget.khlasify.com/accounts",
                                "_blank"
                              );
                            }}
                            className={`
                          w-full py-2.5 text-sm font-semibold rounded-lg
                          transition
          ${
            currentTheme === "light"
              ? "text-purple-600 bg-purple-50 hover:bg-purple-100"
              : "text-purple-400 bg-purple-600/20 hover:bg-purple-600/30" 
          }
              `}
                          >
                            Edit profile
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
          w-full py-2.5 text-sm font-semibold rounded-lg
          transition
          ${
            currentTheme === "light"
              ? "text-purple-600 bg-purple-50 hover:bg-purple-100"
              : "text-purple-400 bg-purple-600/20 hover:bg-purple-600/30" 
          }
              `}
                          >
                            Upgrade to PRO
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        {hasContentToRender && (
          <div className="pb-5 space-y-4 sm:space-y-6 pt-6">
            {showBio && <BioSection profile={profile} theme={currentTheme} />}

            {showHighlight && !shouldHideHighlight && (
              <HighlightSection
                highlights={profile?.highlights}
                theme={currentTheme}
              />
            )}
          </div>
        )}

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

        {/* FREE LIMIT BAR */}
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
            : "bg-[#222222]/90 text-white border border-[#333333]" 
        }
      `}
            >
              <p className="text-xs sm:text-sm font-medium">
                You’ve reached your free limit of{" "}
                <span className="font-semibold">9 posts</span>.
              </p>

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
          ${theme === "light" ? "hover:bg-[#F9FAFB] border-gray-200" : "hover:bg-[#333333] border-[#333333] text-gray-400 hover:text-white"}
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
        w-full px-4 py-3 flex items-center justify-between text-sm transition
        ${theme === "light" ? "hover:bg-[#F9FAFB]" : "hover:bg-[#333333] text-gray-300"} 
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
  const {
    username = "",
    name = "Your Name",
    avatarUrl = "", 
    bio = "🚀 Build efficient & friendly Notion workspaces.\n🔥 Minimalist setup, maximal productivity.\n🎁 FREE Notion Template! 👇",
    link = "https://khlasify.notion.site",
  } = profile || {};

  const formatBio = (bioText: string) => {
    if (!bioText) return null;
    return bioText.split("\n").map((line, i) => <p key={i}>{line}</p>);
  };

  const isValidAvatar = 
    Boolean(avatarUrl) && 
    avatarUrl.trim() !== "" && 
    !avatarUrl.includes("notion.so/image") &&
    !avatarUrl.includes("dicebear.com/7.x/notionists");

  return (
    <section
      className={`flex flex-col items-start text-left w-full px-1 ${
        theme === "light" ? "text-gray-900" : "text-white"
      }`}
    >
      <div className={`w-[84px] h-[84px] rounded-full overflow-hidden border mb-3 shrink-0 flex items-center justify-center ${theme === "light" ? "border-gray-200 bg-gray-50" : "border-[#333333] bg-[#222222]"}`}>
        <img
          src={isValidAvatar ? avatarUrl : "/person.png"} 
          alt="Profile Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-semibold text-[15px] mb-2">{name}</h3>

      <div className="text-sm space-y-1 mb-3 opacity-90">
        {formatBio(bio)}
      </div>

      {link && (
        <a
          href={
            link.startsWith("http")
              ? link
              : `https://${link}`
          }
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Link2 size={14} />
          {link.replace(/^https?:\/\//, "")}
        </a>
      )}
    </section>
  );
}

function HighlightSection({ highlights, theme }: any) {
  const displayHighlights =
    !highlights || highlights.length === 0
      ? [
          { title: "Highlight", image: "" },
          { title: "Highlight", image: "" },
          { title: "Highlight", image: "" },
          { title: "Highlight", image: "" },
        ]
      : highlights;

  return (
    <section
      className={`border rounded-2xl p-4 ${
        theme === "light"
          ? "bg-gray-50 border-gray-200 text-gray-900"
          : "bg-[#222222] border-[#333333] text-gray-300" 
      }`}
    >
      <div className="flex gap-4 overflow-x-auto pb-1 items-center">
        {displayHighlights.map((h: any, i: number) => (
          <div
            key={i}
            className="min-w-[64px] flex flex-col items-center gap-2"
          >
            <div
              className={`w-16 h-16 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0 ${
                theme === "light"
                  ? "bg-gray-100 border-gray-200"
                  : "bg-[#333333] border-[#444444]" 
              }`}
            >
              {h.image && (
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-[12px] font-medium text-center truncate w-full px-1">
              {h.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VisualGrid({ filtered, gridColumns, theme, cardBg, onSelect }: any) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div
      className="grid" 
      style={{
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      }}
    >
      {filtered.map((item: any, i: number) => {
        const name = getProp(item.properties, "Name")?.title?.[0]?.plain_text || "Untitled";
        
        // 🔥 MENGGUNAKAN FUNGSI BARU UNTUK MENDAPATKAN ARRAY GAMBAR (MENDUKUNG CAROUSEL)
        const images = extractAllImages(item);
        
        const pinned = getProp(item.properties, "Pinned")?.checkbox;
        const publishDateRaw = getProp(item.properties, "Publish Date")?.date?.start;
        const publishDateStr = formatDate(publishDateRaw);

        return (
          <div
            key={i}
            onClick={() => onSelect(item)}
            className={`relative group overflow-hidden aspect-[4/5] cursor-pointer hover:-translate-y-1 transition ${cardBg} border ${theme === "dark" ? "border-[#333333]" : "border-gray-100"}`}
            style={{ 
               marginRight: i % 3 !== 2 ? '-1px' : '0',
               marginBottom: '-1px'
            }}
          >
            {pinned && (
              <div
                className="absolute top-2.5 right-2.5 z-20
                  w-6 h-6 rounded-2xl
                  bg-black/40
                  flex items-center justify-center"
              >
                <Pin size={13} className="text-white" strokeWidth={2.2} />
              </div>
            )}

            {/* 🔥 MENGIRIM ARRAY KE AUTOTHUMBNAIL */}
            <AutoThumbnail src={images} />

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
               {publishDateStr && (
                 <p className="text-white/80 text-[10px] sm:text-xs font-medium mb-0.5">
                   {publishDateStr}
                 </p>
               )}
               <p className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-tight">
                 {name}
               </p>
            </div>
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

  const name = getProp(item.properties, "Name")?.title?.[0]?.plain_text || "Untitled";
  // 🔥 MENGGUNAKAN FUNGSI BARU UNTUK MODAL
  const images = extractAllImages(item);

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
            : "bg-[#222222] border-[#333333]" 
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full z-[60]"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 bg-black flex items-center justify-center relative min-h-[50vh]">
            <div className="w-full h-[80vh] flex items-center justify-center">
               {/* 🔥 MENGGANTI TAG <img> LAMA AGAR CAROUSEL BISA BEKERJA DI MODAL */}
               <AutoThumbnail src={images} style={{ objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER FUNCTIONS ================= */

// 🔥 PERBAIKAN: Fungsi Sapu Jagat untuk mendeteksi SEMUA gambar menjadi Array (Carousel Ready)
function extractAllImages(item: any): string[] {
  const p = item.properties;
  const images: string[] = [];
  
  // 1. Cek Kolom Attachment (Upload Lokal)
  const attachment = getProp(p, "Attachment") || getProp(p, "Files & media");
  if (attachment && attachment.files && attachment.files.length > 0) {
    attachment.files.forEach((fileObj: any) => {
      if (fileObj.type === "file" && fileObj.file?.url) {
        images.push(fileObj.file.url);
      } else if (fileObj.type === "external" && fileObj.external?.url) {
        images.push(fileObj.external.url);
      }
    });
  }

  // 2. Cek apakah ada Cover Image bawaan Notion
  if (item.cover) {
    if (item.cover.type === "file" && item.cover.file?.url) {
      images.push(item.cover.file.url);
    } else if (item.cover.type === "external" && item.cover.external?.url) {
      images.push(item.cover.external.url);
    }
  }

  // 3. Cek properti tipe URL (Mencakup kolom "Link", "Canva", dll dari file CSV-mu)
  for (const key in p) {
    if (p[key]?.type === "url" && p[key]?.url) {
      images.push(p[key].url);
    }
  }

  // 4. Fallback ke properti string URL biasa (kalau masih ada)
  const simpleUrl = attachment?.url;
  if (typeof simpleUrl === "string" && simpleUrl.startsWith("http")) {
      images.push(simpleUrl);
  }

  // 5. Jika tetap kosong, gunakan gambar dadu
  if (images.length === 0) {
     images.push("https://api.dicebear.com/7.x/shapes/svg?seed=placeholder");
  }

  // Filter duplikat agar jika ada URL yang sama tidak dirender 2x di Carousel
  return Array.from(new Set(images));
}