/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";

export default function ClientViewComponent({ filtered }: { filtered: any[] }) {
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual");

  return (
    <main className="bg-black min-h-screen p-4 text-white">
      <EmbedFilter />

      {/* TOGGLE VIEW */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setViewMode("visual")}
          className={`px-4 py-2 rounded ${
            viewMode === "visual" ? "bg-gray-700" : "bg-gray-900"
          }`}
        >
          Visual
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded ${
            viewMode === "list" ? "bg-gray-700" : "bg-gray-900"
          }`}
        >
          Map View
        </button>
      </div>

      {/* VISUAL VIEW */}
      {viewMode === "visual" && (
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
          {filtered.map((item: any, i: number) => {
            const name =
              item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
            const url = extractImage(item);
            const isPinned = item.properties?.Pinned?.checkbox === true;

            return (
              <div
                key={i}
                className="relative group bg-gray-900 rounded-lg overflow-hidden aspect-4/5"
              >
                {isPinned && (
                  <div className="absolute top-2 right-2 z-20">
                    <Pin
                      className="w-5 h-5 text-yellow-400 drop-shadow"
                      fill="yellow"
                    />
                  </div>
                )}

                <AutoThumbnail src={url} />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <p className="text-white font-semibold text-center px-2 text-sm">
                    {name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MAP VIEW */}
      {viewMode === "list" && (
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
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
                  className="border-b border-gray-800 hover:bg-gray-900"
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

      <RefreshButton />
    </main>
  );
}

/* 🔥 UTILITY FUNCTIONS (PASTE DI ATAS ATAU BAWAH) */
function extractImage(item: any) {
  const props = item.properties;

  const isVideoUrl = (url: string) =>
    /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(url);

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;
    if (url?.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(url)) return url;
    return url;
  }

  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText) return linkText;

  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl) return canvaUrl;

  return "/placeholder.png";
}
