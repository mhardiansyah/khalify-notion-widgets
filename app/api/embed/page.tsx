import { Suspense } from "react";
import AuthEmbedClient from "./AuthEmbedClient";

export const dynamic = "force-dynamic";

export default function AuthEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-4xl font-semibold">
          Verifying magic link...
        </div>
      }
    >
      <AuthEmbedClient />
    </Suspense>
  );
}
