import { Pin } from "lucide-react";

export function GalleryItem({
  item,
  lightMode,
  onClick,
}: {
  item: any;
  lightMode: boolean;
  onClick: () => void;
}) {
  const name =
    item.properties?.Name?.title?.[0]?.plain_text || "Untitled";

  const image =
    item.properties?.Attachment?.files?.[0]?.file?.url ||
    item.properties?.Attachment?.files?.[0]?.external?.url ||
    "/placeholder.png";

  const pinned = item.properties?.Pinned?.checkbox;

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/5]
      transition hover:scale-[1.02] hover:shadow-xl
      ${lightMode ? "bg-white" : "bg-gray-900"}`}
    >
      {pinned && (
        <Pin className="absolute top-3 right-3 z-10 text-yellow-400" />
      )}

      <img
        src={image}
        className="w-full h-full object-cover"
        alt={name}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white text-sm font-medium truncate">
          {name}
        </p>
      </div>
    </div>
  );
}
