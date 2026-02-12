export const dynamic = "force-dynamic"; // Pastikan dynamic agar selalu fetch baru

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

    const dbID = searchParams.db;

    if (!dbID) {
      return <p className="text-red-500 text-center mt-10">Invalid embed params</p>;
    }

    // 1. Fetch Widget Detail dari Backend
    // Endpoint ini harus mengembalikan data widget + profile pemiliknya
    const widgetRes = await axios.get(
      `https://khalify-be.vercel.app/widgets/detail/${dbID}`,
      { headers: { 'Cache-Control': 'no-store' } } // 🔥 PENTING: Agar tidak cache response lama
    );

    if (!widgetRes.data?.success || !widgetRes.data?.data?.length) {
      return <p className="text-red-500 text-center mt-10">Widget not found</p>;
    }

    const widgetData = widgetRes.data.data[0];
    const token = widgetData.token;

    // 2. Ambil Status PRO dari Profile Pemilik Widget
    // Karena Backend sudah di-include 'profile', kita bisa akses profile.isPro
    const isOwnerPro = widgetData.profile?.isPro ?? false; 

    // console.log("DEBUG: Owner is PRO?", isOwnerPro); 

    // 3. Query Notion Data
    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={null}
        theme="light"
        isPro={isOwnerPro} // 🔥 Kirim status terbaru ke client
      />
    );
  } catch (err) {
    console.error("EMBED ERROR:", err);
    return <p className="text-red-500 text-center mt-10">Embed failed</p>;
  }
}