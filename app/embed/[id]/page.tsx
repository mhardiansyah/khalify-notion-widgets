/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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

    let filtered = data.filter(
      (item: any) => item.properties?.Hide?.checkbox !== true
    );

    if (statusFilter) {
      filtered = filtered.filter((i: any) => {
        const val =
          i.properties?.Status?.status?.name ||
          i.properties?.Status?.select?.name ||
          i.properties?.Status?.multi_select?.[0]?.name;

        return val?.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    if (platformFilter) {
      filtered = filtered.filter((i: any) => {
        const val = i.properties?.Platform?.select?.name;
        return val?.toLowerCase() === platformFilter.toLowerCase();
      });
    }

    if (pillarFilter) {
      filtered = filtered.filter((i: any) => {
        const val = i.properties?.["Content Pillar"]?.select?.name;
        return val?.toLowerCase() === pillarFilter.toLowerCase();
      });
    }

    if (pinnedFilter === "true") {
      filtered = filtered.filter((i: any) => i.properties?.Pinned?.checkbox);
    }
    if (pinnedFilter === "false") {
      filtered = filtered.filter((i: any) => !i.properties?.Pinned?.checkbox);
    }

    filtered = filtered.sort((a: any, b: any) => {
      const A = a.properties?.Pinned?.checkbox ? 1 : 0;
      const B = b.properties?.Pinned?.checkbox ? 1 : 0;
      return B - A;
    });

    // ⭐ GET PROFILE OWNER
    const supabase = createServerComponentClient({ cookies });

    const { data: widget } = await supabase
      .from("widgets")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!widget) {
      return <p style={{ color: "red" }}>Widget not found.</p>;
    }

    // ⭐ GET PROFILE DATA
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", widget.user_id)
      .single();

    const normalizedProfile = profile
      ? {
          name: profile.name,
          username: profile.username,
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
          highlights: profile.highlights ?? [],
        }
      : undefined;

    return <ClientViewComponent filtered={filtered} profile={normalizedProfile} />;
  } catch (err: any) {
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
