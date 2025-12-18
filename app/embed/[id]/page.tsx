/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

interface EmbedPageProps {
  params: {
    id: string;
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  try {
    const id = params.id;

    /* ===============================
       1️⃣ FETCH WIDGET FROM BACKEND
       =============================== */
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/widgets/embed/${id}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!json.success) {
      return <p style={{ color: "red" }}>Invalid widget.</p>;
    }

    const { token, dbID, profile } = json.data;

    if (!dbID) {
      return <p style={{ color: "red" }}>Database ID missing.</p>;
    }

    /* ===============================
       2️⃣ FETCH NOTION DATA
       =============================== */
    let notionData = await queryDatabase(token, dbID);

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
        theme="light"
      />
    );
  } catch (err: any) {
    console.error("EMBED ERROR:", err);
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
