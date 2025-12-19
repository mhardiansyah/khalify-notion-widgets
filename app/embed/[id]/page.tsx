export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import axios from "axios";

interface EmbedPageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  try {
    const widgetId = params.id;

    const dbID =
      typeof searchParams?.db === "string"
        ? decodeURIComponent(searchParams.db)
        : null;

    if (!widgetId || !dbID) {
      return <p style={{ color: "red" }}>Invalid embed params</p>;
    }

    // 🔥 ambil widget dari BE
    const widgetRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/widget/${dbID}`,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!widgetRes.data.success || !widgetRes.data.data.length) {
      return <p style={{ color: "red" }}>Widget not found</p>;
    }

    const widget = widgetRes.data.data[0];
    const token = widget.token;

    // 🔥 query notion
    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={null}
        theme="light"
      />
    );
  } catch (err: any) {
    console.error("EMBED ERROR:", err);
    return <p style={{ color: "red" }}>Embed failed</p>;
  }
}
