export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

interface EmbedPageProps {
  searchParams: {
    db?: string;
  };
}

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  try {
    const dbID = searchParams.db;

    if (!dbID) {
      return <p style={{ color: "red" }}>Database ID missing.</p>;
    }

    // 🔥 FETCH WIDGET BERDASARKAN dbID
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/widgets/embed/by-db/${dbID}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!json.success) {
      return <p style={{ color: "red" }}>Invalid widget.</p>;
    }

    const { token, profile } = json.data;

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={profile}
        theme="light"
      />
    );
  } catch (err: any) {
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
