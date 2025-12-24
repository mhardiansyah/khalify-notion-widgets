"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

export default function RefreshButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.refresh()}
      className="
        inline-flex items-center gap-2
        px-4 py-2 rounded-full text-xs font-medium
        transition-all active:scale-95
        bg-gray-100 text-gray-900
        hover:bg-gray-200
        dark:bg-gray-800 dark:text-white
        dark:hover:bg-gray-700
        ring-1 ring-gray-300 dark:ring-gray-600
      "
      title="Refresh content"
    >
      <RotateCw className="w-4 h-4" />
      Refresh
    </button>
  );
}
