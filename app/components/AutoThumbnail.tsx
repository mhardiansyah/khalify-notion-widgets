/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://api.dicebear.com/7.x/shapes/svg?seed=placeholder";

// ✅ getYoutubeId berada di luar komponen — ini benar karena ia bukan hook,
// hanya fungsi biasa yang tidak bergantung pada state React.
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function AutoThumbnail({
  src,
  className = "",
  style = {},
}: {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  // ✅ SEMUA useState harus berada di dalam sini — di dalam body komponen
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canvaThumbs, setCanvaThumbs] = useState<string[]>([]);

  // srcArray mempertimbangkan canvaThumbs sebagai sumber utama untuk Canva multi-page
  const srcArray =
    canvaThumbs.length > 0 ? canvaThumbs : Array.isArray(src) ? src : [src];

  const activeSrc = srcArray[currentIndex];

  // ✅ useEffect 1: Hanya reset state ketika prop `src` dari LUAR berubah
  useEffect(() => {
    setCanvaThumbs([]);
    setCurrentIndex(0);
  }, [src]);

  // ✅ useEffect 2: Logika loading thumbnail ketika activeSrc berubah
  useEffect(() => {
    if (!activeSrc) {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setThumb(null);

    // 1. CEK YOUTUBE
    const ytId = getYoutubeId(activeSrc);
    if (ytId) {
      setThumb(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      setLoading(false);
      return;
    }

    // 2. CEK FORMAT VIDEO LOKAL (MP4 dll)
    const isVideo = /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(activeSrc);

    if (!isVideo) {
      // 3. IMAGE LOADING BIASA
      const img = new Image();
      img.src = activeSrc;

      img.onload = () => {
        setThumb(activeSrc);
        setLoading(false);
      };

      // 4. JIKA GAGAL DIMUAT, DETEKSI PLATFORM & GUNAKAN STRATEGI YANG TEPAT
      img.onerror = async () => {
        try {
          const isCanva = activeSrc.includes("canva.com");
          const isUnsplash = activeSrc.includes("unsplash.com");

          if (isCanva) {
            console.log(`🎨 Mendeteksi URL Canva, memanggil API internal...`);

            const res = await fetch(
              `/api/embed/thumbnail?url=${encodeURIComponent(activeSrc)}`
            );
            const data = await res.json();
            console.log(`📦 Thumbnail Response (${data.pages} halaman):`, data);

            if (data.thumbnails && data.thumbnails.length > 0) {
              setThumb(data.thumbnails[0]);
              if (data.thumbnails.length > 1) {
                setCanvaThumbs(data.thumbnails);
              }
            } else {
              console.warn("⚠️ API tidak mengembalikan thumbnail.");
              setThumb(FALLBACK_IMAGE);
            }

          } else if (isUnsplash) {
            console.log(`📷 Mendeteksi URL Unsplash, mencoba Microlink...`);

            const res = await fetch(
              `https://api.microlink.io/?url=${encodeURIComponent(activeSrc)}`
            );
            const data = await res.json();
            console.log("🔍 Microlink Response (Unsplash):", data);

            if (data.status === "success" && data.data?.image?.url) {
              setThumb(data.data.image.url);
            } else {
              setThumb(FALLBACK_IMAGE);
            }

          } else {
            console.log(`🌐 URL umum, mencoba Microlink screenshot...`);

            const res = await fetch(
              `https://api.microlink.io/?url=${encodeURIComponent(activeSrc)}&screenshot=true`
            );
            const data = await res.json();

            if (data.status === "success") {
              const thumbUrl =
                data.data?.screenshot?.url ||
                data.data?.image?.url ||
                data.data?.logo?.url;
              setThumb(thumbUrl ?? FALLBACK_IMAGE);
            } else {
              setThumb(FALLBACK_IMAGE);
            }
          }
        } catch (error) {
          console.error("🚨 Error:", error);
          setThumb(FALLBACK_IMAGE);
        } finally {
          setLoading(false);
        }
      };
      return;
    }

    // 5. VIDEO LOADING + THUMBNAIL GENERATION
    const video = document.createElement("video");
    video.src = activeSrc;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.currentTime = 0.1;

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumb(canvas.toDataURL("image/png"));
      setLoading(false);
    });

    video.onerror = () => {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
    };
  }, [activeSrc]);

  return (
    <div
      className="group relative"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "4px",
      }}
    >
      <img
        src={thumb || FALLBACK_IMAGE}
        className={className}
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.4s ease",
          ...style,
        }}
        alt="thumbnail"
      />

      {loading && (
        <div
          className="shimmer"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmerMove 1.4s ease-in-out infinite",
          }}
        />
      )}

      {srcArray.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev === 0 ? srcArray.length - 1 : prev - 1
              );
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-200 z-20"
          >
            &#8592;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev === srcArray.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-200 z-20"
          >
            &#8594;
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {srcArray.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-white scale-110" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <style>
        {`
          @keyframes shimmerMove {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}