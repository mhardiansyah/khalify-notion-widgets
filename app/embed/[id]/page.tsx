/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

export default async function EmbedPage(props: any) {
  try {
    const paramsObj = await props.params;
    const searchObj = await props.searchParams;

    const id = paramsObj.id;
    const db = searchObj?.db;

    const decode = (v: string) => decodeURIComponent(v).replace(/\+/g, " ");

    const statusFilter = searchObj?.status ? decode(searchObj.status) : null;
    const platformFilter = searchObj?.platform ? decode(searchObj.platform) : null;
    const pillarFilter = searchObj?.pillar ? decode(searchObj.pillar) : null;
    const pinnedFilter = searchObj?.pinned;

    if (!db) return <p style={{ color: "red" }}>Database ID not valid.</p>;

    const token = await getToken(id);
    if (!token) return <p style={{ color: "red" }}>Token not valid.</p>;

    const data = await queryDatabase(token, db);

    let filtered = data;

    filtered = filtered.filter(
      (item: any) => item.properties?.Hide?.checkbox !== true
    );

    if (statusFilter) {
      filtered = filtered.filter((item: any) => {
        const val =
          item.properties?.Status?.status?.name ||
          item.properties?.Status?.select?.name ||
          item.properties?.Status?.multi_select?.[0]?.name;

        return val?.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    if (platformFilter) {
      filtered = filtered.filter((item: any) => {
        const val = item.properties?.Platform?.select?.name;
        return val?.toLowerCase() === platformFilter.toLowerCase();
      });
    }

    if (pillarFilter) {
      filtered = filtered.filter((item: any) => {
        const val = item.properties?.["Content Pillar"]?.select?.name;
        return val?.toLowerCase() === pillarFilter.toLowerCase();
      });
    }

    if (pinnedFilter === "true") {
      filtered = filtered.filter((i: any) => i.properties?.Pinned?.checkbox);
    }
    if (pinnedFilter === "false") {
      filtered = filtered.filter((i: any) => !i.properties?.Pinned?.checkbox);
    }

    // Sorting pinned-first
    filtered = filtered.sort((a: any, b: any) => {
      const A = a.properties?.Pinned?.checkbox ? 1 : 0;
      const B = b.properties?.Pinned?.checkbox ? 1 : 0;
      return B - A;
    });

    return <ClientViewComponent filtered={filtered} />;
  } catch (err: any) {
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
