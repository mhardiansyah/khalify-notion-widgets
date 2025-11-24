export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function DashboardPage() {
  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("SERVER USER ERROR:", error);
  }

  if (!user) {
    return <div>Lu belum login bro 🔒</div>;
  }

  return (
    <div className="p-10">
      <h1>Welcome bro 👋</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
