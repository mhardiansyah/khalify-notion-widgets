/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import ClientViewComponent from "@/app/components/ClientViewComponent";

interface Props {
  token: string | null;
  db: string | null;
  step: number;
}

export default function LivePreviewBox({ token, db, step }: Props) {
  const [items, setItems] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Load preview only when token + db exist AND we are in step 3
  useEffect(() => {
    if (!token || !db || step !== 3) return;

    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/embed-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, db }),
        });

        const data = await res.json();

        if (data.success) {
          setItems(data.items);
        }
      } catch (err) {
        console.error("preview error", err);
      }

      setLoading(false);
    })();
  }, [token, db, step]);

  // --------------------------------------------------
  //  CASE 1 — belum lengkap → tampilkan gambar besar (foto 1)
  // --------------------------------------------------
  if (!token || !db || step !== 3) {
    return (
      <div className="w-full h-full bg-white border rounded-xl flex flex-col items-center justify-center p-10">
        <img
          src="/setup-placeholder.svg"
          alt="Setup placeholder"
          className="w-64 opacity-80"
        />
        <p className="text-center text-gray-600 mt-4 text-sm">
          Selesaikan terlebih dahulu semua langkah-langkahnya
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  //  CASE 2 — loading → shimmer
  // --------------------------------------------------
  if (loading || items === null) {
    return (
      <div className="w-full h-full bg-white border rounded-xl p-10 animate-pulse">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //  CASE 3 — sudah ada data → tampilkan PREVIEW asli
  // --------------------------------------------------
  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
      <ClientViewComponent filtered={items} />
    </div>
  );
}
