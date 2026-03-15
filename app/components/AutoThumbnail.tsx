/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://api.dicebear.com/7.x/shapes/svg?seed=placeholder";

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
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 🔥 Sistem Array Pintar & Caching
  const [dynamicSrcArray, setDynamicSrcArray] = useState<string[]>([]);
  const [resolvedThumbs, setResolvedThumbs] = useState<Record<number, string>>({});

  useEffect(() => {
    setDynamicSrcArray(Array.isArray(src) ? src : [src]);
    setCurrentIndex(0);
    setResolvedThumbs({});
  }, [src]);

  const activeSrc = dynamicSrcArray[currentIndex];

  useEffect(() => {
    if (!activeSrc) {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
      return;
    }

    // Jika URL ini sudah pernah dicari thumbnailnya, langsung load dari cache
    if (resolvedThumbs[currentIndex]) {
      setThumb(resolvedThumbs[currentIndex]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setThumb(null);

    // 1. CEK YOUTUBE
    const ytId = getYoutubeId(activeSrc);
    if (ytId) {
      const ytUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      setThumb(ytUrl);
      setResolvedThumbs(prev => ({ ...prev, [currentIndex]: ytUrl }));
      setLoading(false);
      return;
    }

    // 2. CEK FORMAT VIDEO LOKAL
    const isVideo = /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(activeSrc);

    if (!isVideo) {
      // 3. IMAGE LOADING BIASA
      const img = new Image();
      img.src = activeSrc;

      img.onload = () => {
        setThumb(activeSrc);
        setResolvedThumbs(prev => ({ ...prev, [currentIndex]: activeSrc }));
        setLoading(false);
      };

      // 4. JIKA BUKAN GAMBAR LOKAL (MISAL CANVA/UNSPLASH)
      img.onerror = async () => {
        try {
          const isCanva = activeSrc.includes("canva.com");

          if (isCanva) {
            const res = await fetch(`/api/embed/thumbnail?url=${encodeURIComponent(activeSrc)}`);
            const data = await res.json();

            if (data.thumbnails && data.thumbnails.length > 0) {
              setThumb(data.thumbnails[0]);
              setResolvedThumbs(prev => ({ ...prev, [currentIndex]: data.thumbnails[0] }));
              
              // 🔥 Jaga-jaga: Ekspansi Carousel HANYA JIKA attachment Notionnya cuma 1 link Canva.
              // Kalau dicampur foto, jangan rusak susunan carousel aslinya.
              if (dynamicSrcArray.length === 1 && data.thumbnails.length > 1) {
                setDynamicSrcArray(data.thumbnails);
              }
            } else {
              setThumb(FALLBACK_IMAGE);
            }
          } else {
            // Unsplash & Link lain
            const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(activeSrc)}&screenshot=true`);
            const data = await res.json();

            // 🔥 PERBAIKAN: HAPUS fallback ke `data.data.logo.url`
            const thumbUrl = data.data?.screenshot?.url || data.data?.image?.url;
            
            if (data.status === "success" && thumbUrl) {
              setThumb(thumbUrl);
              setResolvedThumbs(prev => ({ ...prev, [currentIndex]: thumbUrl }));
            } else {
              setThumb(FALLBACK_IMAGE);
            }
          }
        } catch (error) {
          setThumb(FALLBACK_IMAGE);
        } finally {
          setLoading(false);
        }
      };
      return;
    }

    // 5. VIDEO LOKAL
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
      const dataUrl = canvas.toDataURL("image/png");
      setThumb(dataUrl);
      setResolvedThumbs(prev => ({ ...prev, [currentIndex]: dataUrl }));
      setLoading(false);
    });

    video.onerror = () => {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
    };
  }, [activeSrc, currentIndex, dynamicSrcArray.length]);

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

      {dynamicSrcArray.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) =>
                prev === 0 ? dynamicSrcArray.length - 1 : prev - 1
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
                prev === dynamicSrcArray.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-200 z-20"
          >
            &#8594;
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 overflow-x-auto max-w-[80%] hide-scrollbar">
            {dynamicSrcArray.map((_, idx) => (
              <div
                key={idx}
                className={`shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
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
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
}