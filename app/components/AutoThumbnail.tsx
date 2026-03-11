/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

// 🔥 PAKE INI BIAR GAK ERROR LAGI
const FALLBACK_IMAGE = "https://api.dicebear.com/7.x/shapes/svg?seed=placeholder";

// 🔥 FUNGSI BARU: Mendeteksi & Ekstrak ID YouTube dari link apapun
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
  src: string | string[]; // Menerima string (lama) atau array string (Carousel baru)
  className?: string;
  style?: React.CSSProperties;
}) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil gambar pertama jika src adalah array (untuk sementara mendukung single display)
  const imageSrc = Array.isArray(src) ? src[0] : src;

  useEffect(() => {
    if (!imageSrc) {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setThumb(null);

    // 🔥 1. CEK YOUTUBE: Jika ini link YT, langsung tembak ke server gambar YouTube
    const ytId = getYoutubeId(imageSrc);
    if (ytId) {
      setThumb(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      setLoading(false);
      return;
    }

    // 2. CEK FORMAT VIDEO LOKAL (MP4 dll)
    const isVideo = /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(imageSrc);

    if (!isVideo) {
      // 3. IMAGE LOADING BIASA
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setThumb(imageSrc);
        setLoading(false);
      };
      
      // 🔥 JIKA GAGAL DIMUAT (Misal link Unsplash HTML), PAKAI MICROLINK
      img.onerror = async () => {
        try {
          const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(imageSrc)}`);
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
      return;
    }

    // 4. VIDEO LOADING + THUMBNAIL GENERATION (Khusus file .mp4 asli)
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
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");

      setThumb(imageData);
      setLoading(false);
    });

    video.onerror = () => {
      setThumb(FALLBACK_IMAGE);
      setLoading(false);
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