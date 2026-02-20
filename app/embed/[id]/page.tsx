// app/embed/[id]/page.tsx
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
        <p className="text-red-500 text-center mt-10">Invalid embed params</p>
      );
    }

    const response = await axios.get(
      `https://khlasify-widget-be.vercel.app/widgets/detail/${dbID}`,
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    const widgetRes = response.data;

    if (!widgetRes?.success || !widgetRes?.data?.length) {
      return (
        <p className="text-red-500 text-center mt-10">Widget not found</p>
      );
    }

    const widgetData = widgetRes.data[0];
    const token = widgetData.token;
    const isOwnerPro = widgetData.isPro === true;

    // 🔥 PERBAIKAN 1: Buat object profile dari data backend
    // Kita cek dulu, kalau isPro true, baru kita pakai custom datanya.
    // Kalau belum diset (kosong), pakai default fallback.
    const widgetProfile = isOwnerPro ? {
      name: widgetData.customName || "Your Name",
      username: widgetData.customUsername || "username",
      avatarUrl: widgetData.customAvatar || "https://api.dicebear.com/7.x/notionists/svg?seed=khlasify",
      bio: widgetData.customBio || "🚀 Build efficient & friendly Notion workspaces.\n🔥 Minimalist setup, maximal productivity.\n🎁 FREE Notion Template! 👇",
      link: widgetData.customLink || "https://khlasify.notion.site",
      highlights: [] // Jika kamu belum punya highlight di backend, biarkan array kosong
    } : null; // Jika bukan Pro, atau kalau mau tetap ditampilin dummy, ganti null dengan default object.

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={widgetProfile} // 🔥 PERBAIKAN 2: Kirim data profil yang sudah disusun
        theme="light"
        isPro={isOwnerPro}
      />
    );
  } catch (err) {
    console.error("EMBED ERROR:", err);
    return <p className="text-red-500 text-center mt-10">Embed failed</p>;
  }
}