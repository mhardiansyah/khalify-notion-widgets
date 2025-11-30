/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, ChevronLeft } from "lucide-react";
import ClientViewComponent from "@/app/components/ClientViewComponent";

interface FinishStepProps {
  onPrev: () => void;
  embedUrl: string;
  showMultimedia: boolean;
  showTitle: boolean;
  gridColumns: number;
  dbUrl: string;
}

export function FinishStep({
  onPrev,
  embedUrl,
  showMultimedia,
  showTitle,
  gridColumns,
  dbUrl
}: FinishStepProps) {
  const [copied, setCopied] = useState(false);
  const [previewItems, setPreviewItems] = useState<any[] | null>(null);

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border-radius: 12px;"></iframe>`;

  /** Load preview from /api/embed-preview */
  useEffect(() => {
    (async () => {
      try {
        const urlObj = new URL(embedUrl);
        const widgetId = urlObj.pathname.split("/").pop();
        const db = urlObj.searchParams.get("db");

        const res = await fetch("/api/embed-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: widgetId, db }),
        });

        const data = await res.json();
        if (data.success) setPreviewItems(data.items);
      } catch (err) {
        console.error("Preview load error", err);
      }
    })();
  }, [embedUrl]);

  /** COPY */
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT SIDEBAR — REVIEW SUMMARY */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Widget Successfully Created!
            </h2>
            <p className="text-sm text-gray-600">
              Your widget is ready to embed
            </p>
          </div>
        </div>

        {/* REVIEW CARD */}
        <div className="space-y-6 mt-4">

          {/* DB URL */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Database URL</p>
            <p className="text-gray-900 text-sm break-all">{dbUrl}</p>
          </div>

          {/* Widget Title */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Widget Title</p>
            <p className="text-gray-900 text-sm">My Notion Gallery</p>
          </div>

          {/* Display Options */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Display</p>
            <p className="text-gray-900 text-sm mb-1">
              Grid {gridColumns} Columns
            </p>
            <p className="text-gray-900 text-sm">
              Multimedia: {showMultimedia ? "On" : "Off"}, Titles:{" "}
              {showTitle ? "On" : "Off"}
            </p>
          </div>

          {/* EMBED URL */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Widget URL</p>
            <div className="flex items-center gap-3">
              <input
                readOnly
                value={embedUrl}
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-700"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-lg flex items-center gap-1"
              >
                {copied ? "Copied" : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Embed Code</p>
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full px-4 py-2 border rounded-lg bg-white text-gray-700 text-xs font-mono"
            />
          </div>

        </div>

        {/* BACK BUTTON */}
        <button
          onClick={onPrev}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Customize
        </button>
      </div>

      {/* RIGHT SIDE — LIVE PREVIEW */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Real-time
          </span>
        </div>

        {/* White embed preview */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          {previewItems ? (
            <ClientViewComponent
              filtered={previewItems}
              theme="light"
              showTitle={showTitle}
              showMultimedia={showMultimedia}
              gridColumns={gridColumns}
            />
          ) : (
            <div className="grid grid-cols-3 gap-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-gray-200 rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Catatan: Ini adalah preview simulasi. Widget asli akan mengambil data secara real-time.
        </p>
      </div>
    </div>
  );
}
