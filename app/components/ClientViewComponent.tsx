/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";

interface Props {
  filtered: any[];
  theme?: "light" | "dark";
  showTitle?: boolean;
  showMultimedia?: boolean;
  gridColumns?: number;
}

export default function ClientViewComponent({
  filtered,
  theme = "light",
  showTitle = true,
  showMultimedia = true,
  gridColumns = 3,
}: Props) {
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual");

  const bg = theme === "light" ? "bg-white text-gray-900" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";

  return (
    <main className={`${bg} min-h-screen p-4 rounded-xl`}>

      {/* FILTERS */}
      <EmbedFilter />

      {/* TOGGLE VIEW */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setViewMode("visual")}
          className={`px-4 py-2 rounded ${
            viewMode === "visual"
              ? theme === "light" ? "bg-gray-200" : "bg-gray-700"
              : theme === "light" ? "bg-gray-100" : "bg-gray-900"
          }`}
        >
          Visual
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded ${
            viewMode === "list"
              ? theme === "light" ? "bg-gray-200" : "bg-gray-700"
              : theme === "light" ? "bg-gray-100" : "bg-gray-900"
          }`}
        >
          Map View
        </button>
      </div>

      {/* VISUAL GRID */}
      {viewMode === "visual" && (
        <div
          className={`grid gap-3`}
          style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
        >
          {filtered.map((item: any, i: number) => {
            const name =
              item.properties?.Name?.title?.[0]?.plain_text || "Untitled";

            const url = extractImage(item);
            const isPinned = item.properties?.Pinned?.checkbox === true;

            return (
              <div
                key={i}
                className={`relative group rounded-lg overflow-hidden aspect-square ${cardBg}`}
              >
                {/* PIN ICON */}
                {isPinned && (
                  <div className="absolute top-2 right-2 z-20">
                    <Pin
                      className="w-5 h-5 text-yellow-400 drop-shadow"
                      fill="yellow"
                    />
                  </div>
                )}

                {/* IMAGE / VIDEO */}
                {showMultimedia && <AutoThumbnail src={url} />}

                {/* TITLE OVERLAY */}
                {showTitle && (
                  <div
                    className={`absolute inset-0 ${
                      theme === "light" ? "bg-black/30" : "bg-black/60"
                    } opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center`}
                  >
                    <p className="font-semibold text-center px-2 text-sm text-white">
                      {name}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <table
          className={`w-full border-collapse ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}
        >
          <thead>
            <tr
              className={
                theme === "light"
                  ? "border-b border-gray-300"
                  : "border-b border-gray-600"
              }
            >
              <th className="p-3 text-left">Pin</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Platform</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Pillar</th>
            </tr>
          </thead>

          <tbody>
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

              return (
                <tr
                  key={i}
                  className={
                    theme === "light"
                      ? "border-b border-gray-200 hover:bg-gray-100"
                      : "border-b border-gray-800 hover:bg-gray-900"
                  }
                >
                  <td className="p-3">
                    {isPinned && (
                      <Pin
                        className="w-5 h-5 text-yellow-400 inline-block"
                        fill="yellow"
                      />
                    )}
                  </td>
                  <td className="p-3">{name}</td>
                  <td className="p-3">{platform}</td>
                  <td className="p-3">{status}</td>
                  <td className="p-3">{pillar}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Refresh */}
      <RefreshButton />
    </main>
  );
}

/* Image extraction stays same */
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
