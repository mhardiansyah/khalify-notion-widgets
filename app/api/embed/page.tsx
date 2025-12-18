import { Suspense } from "react";
import AuthEmbedClient from "./AuthEmbedClient";
import VerifyLoading from "@/app/components/VerifyLoading";

export const dynamic = "force-dynamic";

export default function AuthEmbedPage() {
  return (
    <Suspense
      fallback={
        <VerifyLoading />
      }
    >
      <AuthEmbedClient />
    </Suspense>
  );
}
