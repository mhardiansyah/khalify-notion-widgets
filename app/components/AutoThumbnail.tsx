/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://api.dicebear.com/7.x/shapes/svg?seed=placeholder";

// 🔥 FUNGSI SUPER AKURAT: Ambil ID YouTube dari link
const getYoutubeId = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    } else if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    return null;
  }
  return null;
};

export default function AutoThumbnail({
  src,
  className = "",
  style = {},
}: {
  src: string | string[]; // 🔥 Menerima Array (Carousel) atau String
  className?: string;
  style?: React.CSSProperties;
}) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil gambar pertama jika src adalah array (Menghindari error jika Carousel UI belum siap)
  const rawSrc = Array.isArray(src) ? src[0] : src;
  const imageSrc = typeof rawSrc === "string" ? rawSrc.trim() : "";

  useEffect(() => {
    if (!imageSrc) {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setThumb(null);

    // 🔥 1. DETEKSI YOUTUBE
    const ytId = getYoutubeId(imageSrc);
    if (ytId) {
      // Langsung ambil thumbnail kualitas tinggi bawaan YouTube
      setThumb(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      setLoading(false);
      return;
    }

    // 🔥 2. DETEKSI WEBSITE (Canva, Unsplash, dll)
    // Jangan repot-repot load pakai tag <img> karena pasti gagal. Langsung tembak Microlink!
    const isWebpage = /(unsplash\.com|canva\.com|notion\.site|github\.com)/i.test(imageSrc);

    const fetchMicrolink = async (urlToFetch: string) => {
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(urlToFetch)}`);
        const data = await res.json();
        
        if (data.status === "success" && data.data?.image?.url) {
          setThumb(data.data.image.url);
        } else {
          setThumb(FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error("Gagal ekstrak link preview:", error);
        setThumb(FALLBACK_IMAGE);
      } finally {
        setLoading(false);
      }
    };

    if (isWebpage) {
      fetchMicrolink(imageSrc);
      return;
    }

    // 🔥 3. DETEKSI FORMAT VIDEO LOKAL (MP4, dll)
    const isVideo = /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(imageSrc);

    if (isVideo) {
      const video = document.createElement("video");
      video.src = imageSrc;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.currentTime = 0.1;

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setThumb(FALLBACK_IMAGE);
          setLoading(false);
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumb(canvas.toDataURL("image/png"));
        setLoading(false);
      });

      video.onerror = () => {
        setThumb(FALLBACK_IMAGE);
        setLoading(false);
      };
      return;
    }

    // 🔥 4. LOAD GAMBAR BIASA (.jpg, .png, link S3 Notion)
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setThumb(imageSrc);
      setLoading(false);
    };
    
    // Kalau ternyata ini website yang nggak kedeteksi di atas, coba pakai Microlink sebagai usaha terakhir
    img.onerror = () => {
      fetchMicrolink(imageSrc);
    };

  }, [imageSrc]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "4px",
      }}
    >
      {/* Thumbnail */}
      <img
        src={thumb || FALLBACK_IMAGE}
        className={className}
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

      {/* SHIMMER LOADER */}
      {loading && (
        <div
          className="shimmer"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmerMove 1.4s ease-in-out infinite",
          }}
        />
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