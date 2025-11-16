/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import { queryDatabase } from "@/app/lib/notion-server";

function extractImage(item: any) {
  const props = item.properties;

  const isVideoUrl = (url: string) =>
    /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(url);

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;

    if (url?.includes("canva.com")) return "/canva-placeholder.png";
    if (url && isVideoUrl(url)) return url;

    return url;
  }

  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText) {
    if (linkText.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(linkText)) return linkText;

    return linkText;
  }

  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl) {
    if (canvaUrl.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(canvaUrl)) return canvaUrl;

    return canvaUrl;
  }

  return "/placeholder.png";
}

/** 👉 Ambil NAME dari database Notion */
function extractName(item: any) {
  return item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
}

export default async function EmbedPage(props: any) {
  try {
    const paramsObj = await props.params;
    const searchObj = await props.searchParams;

    const id = paramsObj.id;
    const db = searchObj?.db;

    if (!db) return <p style={{ color: "red" }}>Missing database ID.</p>;

    const token = await getToken(id);
    if (!token)
      return <p style={{ color: "red" }}>Invalid or expired embed link.</p>;

    const data = await queryDatabase(token, db);

    return (
      <main className="bg-black min-h-screen p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((item: any, i: number) => {
            const url = extractImage(item);
            const name = extractName(item);

            return (
              <div
                key={i}
                className="
                  relative group 
                  bg-gray-900 rounded-lg overflow-hidden
                "
              >
                {/* Thumbnail */}
                <AutoThumbnail src={url} />

                {/* Hover Overlay */}
                <div
                  className="
                    absolute inset-0 bg-black/60 
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    flex items-center justify-center
                  "
                >
                  <p className="text-white font-semibold text-center px-2 text-sm">
                    {name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    );
  } catch (err: any) {
    return (
      <p style={{ color: "red", padding: 20 }}>
        Error: {err?.message || "Unknown server error"}
      </p>
    );
  }
}
