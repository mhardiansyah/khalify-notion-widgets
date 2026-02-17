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
    const params = await props.params;
    const searchParams = await props.searchParams;

    const widgetId = params.id;
    const dbID = searchParams.db;

    if (!widgetId || !dbID) {
      return (
        <p className="text-red-500 text-center mt-10">
          Invalid embed params
        </p>
      );
    }

    const widgetRes = await axios.get(
      `https://khalify-be.vercel.app/widgets/detail/${dbID}`,
      { headers: { 'Cache-Control': 'no-store' } } 
    );

    if (!widgetRes.data?.success || !widgetRes.data?.data?.length) {
      return (
        <p className="text-red-500 text-center mt-10">
          Widget not found
        </p>
      );
    }

    const widgetData = widgetRes.data.data[0];
    const token = widgetData.token;

    // 🔥 PERBAIKAN: Ambil isPro langsung dari widgetData
    // Karena di response JSON backend, isPro ada di luar, sejajar dengan token/dbID
    const isOwnerPro = widgetData.isPro === true; 

    console.log("DEBUG Widget Data:", widgetData);
    console.log("DEBUG isOwnerPro:", isOwnerPro);

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={null}
        theme="light"
        isPro={isOwnerPro} // Kirim status yang sudah diperbaiki ke ClientViewComponent
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