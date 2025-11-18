/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export default function AutoThumbnail({
  src,
  className = "",
  style = {},
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src) return;

    setLoading(true);
    setThumb(null);

    const isVideo = /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(src);

    if (!isVideo) {
      // IMAGE LOADING
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setThumb(src);
        setLoading(false);
      };
      img.onerror = () => {
        setThumb("/placeholder.png");
        setLoading(false);
      };
      return;
    }

    // VIDEO LOADING + THUMBNAIL GENERATION
    const video = document.createElement("video");
    video.src = src;
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
      setThumb("/video-placeholder.png");
      setLoading(false);
    };
  }, [src]);

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
        src={thumb || "/video-placeholder.png"}
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
