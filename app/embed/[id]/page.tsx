export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

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

    // 🔥 PERBAIKAN: Gunakan native fetch() bawaan Next.js dengan cache: 'no-store'
    const response = await fetch(
      `https://khlasify-widget-be.vercel.app/widgets/detail/${dbID}`, 
      { 
        cache: 'no-store',
      } 
    );

    const widgetRes = await response.json(); // Parse JSON-nya

    if (!widgetRes?.success || !widgetRes?.data?.length) {
      return (
        <p className="text-red-500 text-center mt-10">
          Widget not found
        </p>
      );
    }

    const widgetData = widgetRes.data[0];
    const token = widgetData.token;

    // Sekarang widgetData PASTI adalah data paling fresh dari database
    const isOwnerPro = widgetData.isPro === true; 

    console.log("DEBUG Widget Data Fresh:", widgetData);
    console.log("DEBUG isOwnerPro Fresh:", isOwnerPro);

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={null}
        theme="light"
        isPro={isOwnerPro} 
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