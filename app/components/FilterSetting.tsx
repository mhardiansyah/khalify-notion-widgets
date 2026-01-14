import { ChevronDown } from "lucide-react";

function FilterSettings({ current, onOpen }: any) {
  return (
    <div className="space-y-2">
      {[
        ["platform", current.platform],
        ["status", current.status],
        ["pillar", current.pillar],
        ["pinned", current.pinned],
      ].map(([key, value]) => (
        <button
          key={key}
          onClick={() => onOpen(key)}
          className="
            w-full px-4 py-3
            rounded-xl
            border border-gray-200
            flex items-center justify-between
            text-sm
            bg-gray-50
          "
        >
          <span className="capitalize">{key}</span>
          <span className="flex items-center gap-2 text-gray-500">
            {value}
            <ChevronDown size={16} />
          </span>
        </button>
      ))}
    </div>
  );
}
