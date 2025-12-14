/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getToken } from "@/app/lib/getToken";
import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin"; // 🔥 ADMIN CLIENT

export default async function EmbedPage(props: any) {
  try {
    const params = await props.params;
    const search = await props.searchParams;

    const id = params.id; // widget ID
    const db = search?.db; // Notion DB ID

    if (!db) {
      return <p style={{ color: "red" }}>Database ID missing.</p>;
    }

    /* ===============================
       THEME (dark | light)
       =============================== */
    const theme: "light" | "dark" =
      search?.theme === "dark" || search?.theme === "light"
        ? search.theme
        : "light";

    /* ===============================
       1️⃣ GET TOKEN
       =============================== */
    const token = await getToken(id);
    if (!token) {
      return <p style={{ color: "red" }}>Invalid widget.</p>;
    }

    /* ===============================
       2️⃣ FETCH NOTION DATA
       =============================== */
    let notionData = await queryDatabase(token, db);

    let filtered = notionData.filter(
      (i: any) => i.properties?.Hide?.checkbox !== true
    );

    /* ===============================
       FILTERS
       =============================== */
    const decode = (v: string) =>
      decodeURIComponent(v).replace(/\+/g, " ");

    const status = search?.status ? decode(search.status) : null;
    const platform = search?.platform ? decode(search.platform) : null;
    const pillar = search?.pillar ? decode(search.pillar) : null;
    const pinned = search?.pinned;

    if (status) {
      filtered = filtered.filter((item: any) => {
        const v =
          item.properties?.Status?.status?.name ||
          item.properties?.Status?.select?.name ||
          item.properties?.Status?.multi_select?.[0]?.name;

        return v?.toLowerCase() === status.toLowerCase();
      });
    }

    if (platform) {
      filtered = filtered.filter(
        (i: any) =>
          i.properties?.Platform?.select?.name?.toLowerCase() ===
          platform.toLowerCase()
      );
    }

    if (pillar) {
      filtered = filtered.filter(
        (i: any) =>
          i.properties?.["Content Pillar"]?.select?.name?.toLowerCase() ===
          pillar.toLowerCase()
      );
    }

    if (pinned === "true") {
      filtered = filtered.filter((i: any) => i.properties?.Pinned?.checkbox);
    }

    if (pinned === "false") {
      filtered = filtered.filter((i: any) => !i.properties?.Pinned?.checkbox);
    }

    /* ===============================
       SORT: PINNED FIRST
       =============================== */
    filtered = filtered.sort((a: any, b: any) => {
      const A = a.properties?.Pinned?.checkbox ? 1 : 0;
      const B = b.properties?.Pinned?.checkbox ? 1 : 0;
      return B - A;
    });

    /* ===============================
       3️⃣ LOAD PROFILE (ADMIN)
       =============================== */
    const { data: widget } = await supabaseAdmin
      .from("widgets")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    let profile = null;

    if (widget?.user_id) {
      const { data: p } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", widget.user_id)
        .maybeSingle();

      if (p) {
        profile = {
          name: p.name,
          username: p.username,
          avatarUrl: p.avatar_url,
          bio: p.bio,
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
        };
      }
    }

    /* ===============================
       RENDER
       =============================== */
    return (
      <ClientViewComponent
        filtered={filtered}
        profile={profile}
        theme={theme}
      />
    );
  } catch (err: any) {
    console.error("EMBED ERROR:", err);
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
