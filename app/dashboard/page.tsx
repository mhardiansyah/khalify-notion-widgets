export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
