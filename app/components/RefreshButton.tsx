"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { useState } from "react";

export default function RefreshButton({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    if (loading) return;
    setLoading(true);
    router.refresh();

    // safety unlock (router.refresh ga return promise)
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      title="Refresh"
      aria-label="Refresh"
      className={`
        w-9 h-9
        flex items-center justify-center
        rounded-full border
        transition
        ${
          loading
            ? "opacity-60 cursor-not-allowed"
            : theme === "light"
            ? "hover:bg-[#F9FAFB]"
            : "hover:bg-[#24304A]"
        }
      `}
    >
      <RotateCw
        size={16}
        className={loading ? "animate-spin" : ""}
      />
    </button>
  );
}
