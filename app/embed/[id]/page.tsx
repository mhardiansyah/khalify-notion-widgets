/* eslint-disable @typescript-eslint/no-explicit-any */ 
import { getToken } from "@/app/api/embed/route";
import ClientEmbed from "@/app/components/ClientEmbed";

export default async function EmbedPage(props: any) {
  try {
    const paramsObj = await props.params;
    const searchObj = await props.searchParams;

    const id = paramsObj.id;
    const db = searchObj?.db;

    if (!db) {
      return <p style={{ color: "red" }}>Database ID not valid. / Token error.</p>;
    }

    const token = await getToken(id);
    if (!token) {
      return <p style={{ color: "red" }}>Token not valid. / Token error.</p>;
    }

    return <ClientEmbed token={token} db={db} />;

  } catch (err: any) {
    return (
      <p style={{ color: "red", padding: 20 }}>
        Error: {err?.message || "Unknown server error"}
      </p>
    );
  }
}
