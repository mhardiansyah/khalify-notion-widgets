"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import Navbar from "./components/Navbar";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = cookies.get("login_token");
    if (token) setUser({ token });
  }, []);

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 py-16">
        <div className="max-w-[1440px] mx-auto px-6">

          {/* ================= HERO SECTION ================= */}
          <div className="flex flex-col lg:flex-row gap-14 items-start justify-center">

            {/* ===== LEFT : PREVIEW MOCKUP ===== */}
            <div className="relative w-full lg:w-[700px]">
              {/* blur bg */}
              <div className="absolute -top-10 -left-10 w-[480px] h-[600px] bg-purple-400/20 blur-[80px] rounded-3xl" />

              {/* browser frame */}
              <div className="relative bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* browser header */}
                <div className="flex items-center gap-2 px-4 h-12 bg-gray-100 border-b">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-xs text-gray-500">
                    https://widget.khlasify.com
                  </span>
                </div>

                {/* iframe preview */}
                <div className="h-[680px] lg:h-[760px]">
                  <iframe
                    src="https://widget.khlasify.com/embed/873472?db=2ed1519e-69f0-801d-9d05-f41df80688e3"
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* ===== RIGHT : CONTENT ===== */}
            <div className="flex flex-col gap-8 w-full lg:w-[580px]">

              {/* badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 w-fit">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 text-sm">
                  Multi-Platform Content Preview
                </span>
              </div>

              {/* title */}
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Turn Notion into your visual content system.
              </h1>

              {/* subtitle */}
              <p className="text-lg text-gray-600">
                Plan, preview, and organize everything in one clean workspace.
              </p>

              {/* CTA */}
              <button
                onClick={() => router.push("/widgets/create")}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-7 py-4 rounded-xl w-fit shadow-lg shadow-purple-200 transition"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* ===== STEPS ===== */}
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Get started in 5 minutes
                </h2>

                <div className="flex flex-col gap-4">
                  {[
                    ["1", "Duplicate Content OS", "Create your database in Notion"],
                    ["2", "Connect Your Database", "Link your database to widget"],
                    ["3", "Embed Preview Widget", "Add to your Notion page"],
                  ].map(([step, title, desc]) => (
                    <div
                      key={step}
                      className="relative bg-white border rounded-2xl p-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold mb-4">
                        {step}
                      </div>
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTION ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 max-w-[1300px] mx-auto">

            {/* VIDEO */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Video Tutorials</h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-purple-600">
                  <CheckCircle2 className="w-5 h-5" />
                  Starter Setup
                </li>
                <li className="flex items-center gap-2 text-purple-600">
                  <CheckCircle2 className="w-5 h-5" />
                  PRO Setup
                </li>
              </ul>
            </div>

            {/* WHY */}
            <div className="bg-white border rounded-2xl p-8">
              <h3 className="font-semibold text-lg mb-4">
                Why creators use Content OS?
              </h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Plan content visually across platforms
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Live previews synced with Notion database
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Clean, focused workflow — no coding needed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
