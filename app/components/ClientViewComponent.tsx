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

    /* ================= RENDER ================= */

    return (
      <main className={`${bg} min-h-screen w-full`}>
        {/* ================= HEADER ================= */}
        <header
          className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b backdrop-blur ${
            currentTheme === "light"
              ? "bg-white/80 border-gray-200"
              : "bg-[#1A2332]/90 border-[#2A3550]"
          }`}
        >
          <div className="flex items-center gap-2">
  <Image
    src="/logo-khlasify.png"
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
                <div
                  className={`absolute right-0 top-full mt-2 z-50
                  w-[260px] sm:w-[320px] md:w-[520px]
                  rounded-xl border shadow-lg p-4
                  ${
                    currentTheme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-[#1F2A3C] border-[#2A3550]"
                  }`}
                >
                  <EmbedFilter theme={currentTheme} />
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
                    onChange={() => setShowBio(!showBio)}
                  />

                  <SettingToggle
                    theme={currentTheme}
                    label="Show Highlight"
                    value={showHighlight}
                    onChange={() => setShowHighlight(!showHighlight)}
                  />

                  <SettingToggle
                    theme={currentTheme}
                    label="Dark Mode"
                    value={currentTheme === "dark"}
                    onChange={() =>
                      setCurrentTheme((t) => (t === "light" ? "dark" : "light"))
                    }
                  />

                  {/* DIVIDER */}
                  <div
                    className={`h-px my-1 ${
                      currentTheme === "light" ? "bg-gray-200" : "bg-[#2A3550]"
                    }`}
                  />

                  {/* 🔥 PRO BUTTON */}
                  <button
                    onClick={() => {
                      alert("Upgrade to PRO 🚀"); // nanti ganti ke modal / page pro
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
                    Upgrade to PRO version
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

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

  function SettingToggle({ label, value, onChange, theme }: any) {
    return (
      <button
        onClick={onChange}
        className={`w-full px-4 py-3 flex items-center justify-between text-sm rounded-xl transition
    ${theme === "light" ? "hover:bg-[#F9FAFB]" : "hover:bg-[#24304A]"}
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

  /* ================= SECTIONS, GRID, MODAL, HELPERS ================= */
  /* ⛔ TIDAK DIUBAH — SAMA PERSIS SEPERTI KODE KAMU */

  function BioSection({ profile, theme }: any) {
    return (
      <section
        className={`border rounded-2xl p-4 flex gap-4 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-[#1F2A3C] border-[#2A3550]"
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
        className="grid gap-0.5"
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
              className={`relative group overflow-hidden aspect-[4/5] cursor-pointer hover:-translate-y-1 transition ${cardBg}`}
            >
              {pinned && (
                <div className="absolute top-2.5 right-2.5 z-10">
                  <Pin
                    size={14}
                    className="text-white drop-shadow-sm"
                    strokeWidth={2.2}
                  />
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
              <img src={image} alt={name} className="object-contain h-full" />
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
