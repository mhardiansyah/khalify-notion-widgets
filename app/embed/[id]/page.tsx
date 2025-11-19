/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import RefreshButton from "@/app/components/RefreshButton";
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

function extractName(item: any) {
  return item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
}

export default async function EmbedPage(props: any) {
  try {
    const paramsObj = await props.params;
    const searchObj = await props.searchParams;

    const id = paramsObj.id;
    const db = searchObj?.db;

    // 🔥 Ambil filter dari query URL
    const statusFilter = searchObj?.status;
    const platformFilter = searchObj?.platform;
    const pillarFilter = searchObj?.pillar;
    const pinnedFilter = searchObj?.pinned; // true / false

    if (!db)
      return (
        <p style={{ color: "red", fontSize: "2rem" }}>
          Database ID not valid.
        </p>
      );

    const token = await getToken(id);
    if (!token)
      return (
        <p style={{ color: "red", fontSize: "2rem" }}>Token not valid.</p>
      );

    const data = await queryDatabase(token, db);

    // 🧠 START FILTERING
    let filtered = data;

    // Filter Status
    if (statusFilter) {
      filtered = filtered.filter((item: any) => {
        const status = item.properties?.Status?.select?.name;
        return status?.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Filter Platform
    if (platformFilter) {
      filtered = filtered.filter((item: any) => {
        const platform = item.properties?.Platform?.select?.name;
        return platform?.toLowerCase() === platformFilter.toLowerCase();
      });
    }

    // Filter Content Pillar
    if (pillarFilter) {
      filtered = filtered.filter((item: any) => {
        const pillar = item.properties?.["Content Pillar"]?.select?.name;
        return pillar?.toLowerCase() === pillarFilter.toLowerCase();
      });
    }

    // Filter Pinned (checkbox)
    if (pinnedFilter === "true") {
      filtered = filtered.filter(
        (item: any) => item.properties?.Pinned?.checkbox === true
      );
    }

    if (pinnedFilter === "false") {
      filtered = filtered.filter(
        (item: any) => item.properties?.Pinned?.checkbox === false
      );
    }

    // END FILTERING 🔥

    return (
      <main className="bg-black min-h-screen p-4">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
          {filtered.map((item: any, i: number) => {
            const url = extractImage(item);
            const name = extractName(item);

            return (
              <div
                key={i}
                className="
                relative group 
                bg-gray-900 rounded-lg overflow-hidden
                aspect-4/5
              "
              >
                <AutoThumbnail src={url} />

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

        <RefreshButton />
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
