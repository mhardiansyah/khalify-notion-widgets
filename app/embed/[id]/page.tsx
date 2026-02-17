export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";
import axios from "axios"; // 🔥 Jangan lupa import axios

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

    // 🔥 PERBAIKAN: Menggunakan axios dengan header anti-cache
    const response = await axios.get(
      `https://khlasify-widget-be.vercel.app/widgets/detail/${dbID}`, 
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      } 
    );

    // Axios otomatis mem-parse JSON, jadi tinggal panggil response.data
    const widgetRes = response.data; 

    if (!widgetRes?.success || !widgetRes?.data?.length) {
      return (
        <p className="text-red-500 text-center mt-10">
          Widget not found
        </p>
      );
    }

    const widgetData = widgetRes.data[0];
    const token = widgetData.token;

    // Data dari database
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