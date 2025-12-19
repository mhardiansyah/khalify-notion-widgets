export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import axios from "axios";

interface EmbedPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ db?: string }>;
}

export default async function EmbedPage(props: EmbedPageProps) {
  try {
    // 🔥 UNWRAP PROMISE
    const params = await props.params;
    const searchParams = await props.searchParams;

    console.log("PARAMS:", params);
    console.log("SEARCH PARAMS:", searchParams);

    const widgetId = params.id;
    const dbID = searchParams.db;

    console.log("widgetId:", widgetId);
    console.log("dbID:", dbID);

    if (!widgetId || !dbID) {
      return (
        <p className="text-red-500 text-center mt-10">
          Invalid embed params
        </p>
      );
    }

    // 🔥 ambil widget
    const widgetRes = await axios.get(
      `https://khalify-be.vercel.app/widgets/${dbID}`
    );

    if (!widgetRes.data?.success || !widgetRes.data?.data?.length) {
      return (
        <p className="text-red-500 text-center mt-10">
          Widget not found
        </p>
      );
    }

    const token = widgetRes.data.data[0].token;

    // 🔥 query notion
    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={null}
        theme="light"
      />
    );
  } catch (err) {
    console.error("EMBED ERROR:", err);
    return (
      <p className="text-red-500 text-center mt-10">
        Embed failed
      </p>
    );
  }
}
