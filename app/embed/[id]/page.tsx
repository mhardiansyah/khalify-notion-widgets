/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

interface EmbedPageProps {
  params: {
    id: string;
  };
  searchParams: {
    db?: string;
    theme?: "light" | "dark";
  };
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  try {
    const id = params.id;
    const db = searchParams.db;

    if (!db) {
      return <p style={{ color: "red" }}>Database ID missing.</p>;
    }

    const theme =
      searchParams.theme === "dark" || searchParams.theme === "light"
        ? searchParams.theme
        : "light";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/widgets/embed/${id}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!json.success) {
      return <p style={{ color: "red" }}>Invalid widget.</p>;
    }

    const { token, profile } = json.data;

    let notionData = await queryDatabase(token, db);

    let filtered = notionData.filter(
      (i: any) => i.properties?.Hide?.checkbox !== true
    );

    filtered = filtered.sort((a: any, b: any) => {
      const A = a.properties?.Pinned?.checkbox ? 1 : 0;
      const B = b.properties?.Pinned?.checkbox ? 1 : 0;
      return B - A;
    });

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
