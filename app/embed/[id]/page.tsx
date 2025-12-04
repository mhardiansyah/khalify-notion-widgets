/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export default async function EmbedPage(props: any) {
  try {
    const params = await props.params;
    const search = await props.searchParams;

    const id = params.id; // WIDGET ID
    const db = search?.db; // Notion DB ID

    if (!db) {
      return <p style={{ color: "red" }}>Database ID missing.</p>;
    }

    // =======================================
    // 1️⃣ GET NOTION TOKEN FROM SUPABASE
    // =======================================
    const token = await getToken(id);
    if (!token) {
      return <p style={{ color: "red" }}>Invalid or expired widget.</p>;
    }

    // =======================================
    // 2️⃣ QUERY NOTION DATABASE
    // =======================================
    let notionData: any[] = [];

    try {
      notionData = await queryDatabase(token, db);
    } catch (err) {
      console.error("Notion API failed:", err);
      return (
        <p style={{ color: "red" }}>
          Failed to fetch data from Notion. Check your integration token.
        </p>
      );
    }

    // Hide = true → exclude
    let filtered = notionData.filter(
      (i: any) => i.properties?.Hide?.checkbox !== true
    );

    // =======================================
    // 3️⃣ FILTERS
    // =======================================
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
      filtered = filtered.filter(
        (i: any) => i.properties?.Pinned?.checkbox
      );
    }

    if (pinned === "false") {
      filtered = filtered.filter(
        (i: any) => !i.properties?.Pinned?.checkbox
      );
    }

    // Sort pinned first
    filtered = filtered.sort((a, b) => {
      const A = a.properties?.Pinned?.checkbox ? 1 : 0;
      const B = b.properties?.Pinned?.checkbox ? 1 : 0;
      return B - A;
    });

    // ========================================
    // 4️⃣ GET PROFILE FROM SUPABASE (THE FIX)
    // ========================================
    const { data: widget } = await supabaseAdmin
      .from("widgets")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    let profile = undefined;

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

    // ========================================
    // 5️⃣ RENDER CLIENT COMPONENT
    // ========================================
    return (
      <ClientViewComponent
        filtered={filtered}
        profile={profile}
      />
    );
  } catch (err: any) {
    console.error("EMBED PAGE ERROR:", err);
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
