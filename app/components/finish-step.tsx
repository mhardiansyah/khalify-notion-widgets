/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Download, ChevronLeft } from "lucide-react";
import ClientViewComponent from "@/app/components/ClientViewComponent";

interface FinishStepProps {
  onPrev: () => void;
  embedUrl: string;
}

export function FinishStep({ onPrev, embedUrl }: FinishStepProps) {
  const [copied, setCopied] = useState(false);
  const [previewItems, setPreviewItems] = useState<any[] | null>(null);

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border-radius: 12px;"></iframe>`;

  /** Load preview using your own embed output */
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

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHTML = () => {
    const blob = new Blob(
      [
        `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0">
    ${embedCode}
  </body>
</html>
        `,
      ],
      { type: "text/html" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "widget.html";
    a.click();
  };

  return (
    <div className="space-y-10">

      {/* SUCCESS HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Widget Successfully Created!</h2>
          <p className="text-sm text-gray-600">Your Notion widget is ready to embed</p>
        </div>
      </div>

      {/* EMBED URL */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-1 font-medium">Widget URL</p>
        <div className="flex items-center gap-3">
          <input
            value={embedUrl}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs flex items-center gap-1"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Connected
          </span>
        </div>

        {previewItems ? (
          <ClientViewComponent filtered={previewItems} />
        ) : (
          <div className="grid grid-cols-3 gap-3 animate-pulse">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg" />
            ))}
          </div>
        )}
      </div>

      {/* EMBED CODE */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Embed Code</label>
        <div className="relative">
          <textarea
            value={embedCode}
            readOnly
            rows={4}
            className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-xs rounded-lg border border-gray-700"
          />
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded flex items-center gap-1"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadHTML}
        className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download as HTML File
      </button>

      {/* BACK BUTTON */}
      <button
        onClick={onPrev}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 w-full justify-center transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Customize
      </button>
    </div>
  );
}
