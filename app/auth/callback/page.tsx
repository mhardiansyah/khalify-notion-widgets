"use client";

import { Suspense } from "react";
import CallbackBody from "./CallbackBody";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CallbackBody />
    </Suspense>
  );
}
