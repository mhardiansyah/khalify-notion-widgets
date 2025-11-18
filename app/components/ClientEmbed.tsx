/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import { queryDatabase } from "@/app/lib/notion-server";

export default function ClientEmbed({ token, db }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await queryDatabase(token, db);
      setItems(data);
    } catch (err: any) {
      const msg = err?.message || "Unknown error";

      if (msg.includes("token") || msg.includes("Token"))
        setError("Token not valid. / Token error.");
      else if (msg.includes("database") || msg.includes("db"))
        setError("Database ID not valid. / Token error.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="bg-black min-h-screen p-4">
      {/* Refresh Button */}
      <button
        onClick={loadData}
        className="mb-4 px-4 py-2 bg-white text-black font-semibold rounded"
      >
        Refresh
      </button>

      {/* Error */}
      {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

      {/* Loading */}
      {loading && <p className="text-white">Loading...</p>}

      {/* Grid */}
      {/* Grid: Tampilkan 3 foto dengan rasio 4:5 */}
      <div className="grid grid-cols-3 gap-3">
        {items.slice(0, 3).map((item: any, i: number) => {
          const url = extractImage(item);
          const name = extractName(item);

          return (
            <div key={i} className="relative group">
              {/* Rasio 4:5 seperti instagram post */}
              <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-900">
                <div className="w-full h-full object-cover">
                  <AutoThumbnail
                    src={url}
                  />
                </div>
              </div>

              {/* Hover Overlay */}
              <div
                className="
            absolute inset-0 bg-black/60 
            opacity-0 group-hover:opacity-100
            transition-all duration-300
            flex items-center justify-center
          "
              >
                <p className="text-white font-semibold text-center px-2 text-sm">
                  {name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

// helper functions
function extractImage(item: any) {
  const props = item.properties;

  const isVideoUrl = (url: string) =>
    /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(url);

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;

    if (url?.includes("canva.com")) return "/canva-placeholder.png";
    if (url && isVideoUrl(url)) return url;
    return url;
  }

  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText) {
    if (linkText.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(linkText)) return linkText;
    return linkText;
  }

  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl) {
    if (canvaUrl.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(canvaUrl)) return canvaUrl;
    return canvaUrl;
  }

  return "/placeholder.png";
}

function extractName(item: any) {
  return item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
}
