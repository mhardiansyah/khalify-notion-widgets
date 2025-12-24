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
    const widgetId = params.id;
    const dbID = searchParams.db;

    if (!widgetId || !dbID) {
      return (
        <p className="text-red-500 text-center mt-10">
          Invalid embed parameters
        </p>
      );
    }

    const widgetRes = await axios.get(
      `https://khalify-be.vercel.app/widgets/detail/${dbID}`
    );

    if (!widgetRes.data?.success || !widgetRes.data?.data?.length) {
      return (
        <p className="text-red-500 text-center mt-10">
          Widget not found
        </p>
      );
    }

    const widget = widgetRes.data.data[0];
    const token = widget.token;

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={null}
        theme="light"
        gridColumns={3} // 👉 tinggal ganti kalo mau
      />
    );
  } catch (err) {
    console.error("EMBED ERROR:", err);
    return (
      <p className="text-red-500 text-center mt-10">
        Embed failed to load
      </p>
    );
  }
}
