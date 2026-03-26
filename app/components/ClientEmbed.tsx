/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AutoThumbnail from "@/app/components/AutoThumbnail";

export default function EmbedClient({ initialData }: any) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch(window.location.href); // hit server component
      const html = await res.text();

      // Extract JSON data sent from server (via special endpoint)
      const apiRes = await fetch(`/api/embed-refresh?${window.location.search}`);
      const newData = await apiRes.json();

      setData(newData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <main className="bg-black min-h-screen p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={refreshData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.map((item: any, i: number) => {
          const url = item.url;
          const name = item.name;

          return (
            <div  
              key={i}
              className="relative group bg-gray-900 rounded-lg overflow-hidden"
            >
              <AutoThumbnail src={url} />

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
