export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import axios from "axios";

interface EmbedPageProps {
  params: { id: string };
  searchParams: { db?: string };
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  try {
    console.log("PARAMS RAW:", params);
    console.log("SEARCH PARAMS RAW:", searchParams);

    const widgetId = params.id;
    const dbID = searchParams.db;

    console.log("widgetId:", widgetId);
    console.log("dbID:", dbID);

    if (!widgetId || !dbID) {
      return <p style={{ color: "red" }}>Invalid embed params</p>;
    }

    const widgetRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/widgets/${dbID}`
    );

    if (!widgetRes.data.success || !widgetRes.data.data.length) {
      return <p style={{ color: "red" }}>Widget not found</p>;
    }

    const token = widgetRes.data.data[0].token;

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent filtered={notionData} profile={null} theme="light" />
    );
  } catch (err) {
    console.error("EMBED ERROR:", err);
    return <p style={{ color: "red" }}>Embed failed</p>;
  }
}
