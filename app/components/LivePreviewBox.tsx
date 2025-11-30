/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ClientViewComponent from "@/app/components/ClientViewComponent";

interface Props {
  token: string | null;
  db: string | null;
}

export default function LivePreviewBox({ token, db }: Props) {
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    if (!token || !db) return;

    (async () => {
      try {
        const res = await fetch("/api/notion/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, db }),
        });

        const json = await res.json();
        if (json.results) setItems(json.results);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [token, db]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          Real-time
        </span>
      </div>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        {items ? (
          <ClientViewComponent
            filtered={items}
            theme="light"
            showTitle={true}
            showMultimedia={true}
            gridColumns={3}
          />
        ) : (
          <div className="grid grid-cols-3 gap-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
